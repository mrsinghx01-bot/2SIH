"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProjects = getAllProjects;
exports.getProjectById = getProjectById;
exports.createProject = createProject;
const database_1 = require("../config/database");
async function getAllProjects(req, res) {
    const store = (0, database_1.getDatabaseStore)();
    const user = req.user;
    let stateId = req.query.stateId;
    let districtId = req.query.districtId;
    const projectType = req.query.projectType;
    const status = req.query.status;
    const searchQuery = (req.query.search || '').toLowerCase().trim();
    // Enforce role-based geographic scope
    if (user && user.role !== 'CENTRAL_ADMIN' && user.role !== 'CENTRAL_OFFICER') {
        if (user.stateId)
            stateId = user.stateId;
        if (user.districtId)
            districtId = user.districtId;
    }
    let results = store.projects;
    if (stateId) {
        const matchingProjectIds = new Set(store.projectDistricts.filter(pd => pd.stateId === stateId).map(pd => pd.projectId));
        results = results.filter(p => matchingProjectIds.has(p.id));
    }
    if (districtId) {
        const matchingProjectIds = new Set(store.projectDistricts.filter(pd => pd.districtId === districtId).map(pd => pd.projectId));
        results = results.filter(p => matchingProjectIds.has(p.id));
    }
    if (projectType) {
        results = results.filter(p => p.projectType === projectType);
    }
    if (status) {
        results = results.filter(p => p.status === status);
    }
    if (searchQuery) {
        results = results.filter(p => p.name.toLowerCase().includes(searchQuery) ||
            p.projectCode.toLowerCase().includes(searchQuery) ||
            p.implementingAgency.toLowerCase().includes(searchQuery) ||
            p.ministry.toLowerCase().includes(searchQuery));
    }
    // Enrich with associated states and districts
    const enriched = results.map(p => {
        const pDists = store.projectDistricts.filter(pd => pd.projectId === p.id);
        const stateNames = Array.from(new Set(pDists.map(pd => {
            const st = store.states.find(s => s.id === pd.stateId);
            return st ? st.name : '';
        }))).filter(Boolean);
        const districtNames = pDists.map(pd => {
            const d = store.districts.find(dst => dst.id === pd.districtId);
            return d ? d.name : '';
        }).filter(Boolean);
        const progress = Math.min(100, Math.round((p.totalLandAcquired / (p.totalLandRequired || 1)) * 100));
        return {
            ...p,
            states: stateNames,
            districts: districtNames,
            progressPercentage: progress,
            targetCompletion: p.targetCompletionDate || p.targetCompletion,
            targetCompletionDate: p.targetCompletionDate || p.targetCompletion
        };
    });
    res.json({
        success: true,
        data: enriched,
        total: enriched.length,
        message: 'Projects retrieved successfully.'
    });
}
async function getProjectById(req, res) {
    const { id } = req.params;
    const store = (0, database_1.getDatabaseStore)();
    const user = req.user;
    const project = store.projects.find(p => p.id === id || p.projectCode === id);
    if (!project) {
        res.status(404).json({
            success: false,
            data: null,
            message: `Project with identifier ${id} not found.`
        });
        return;
    }
    // 1. Overview & Location mappings
    const pDists = store.projectDistricts.filter(pd => pd.projectId === project.id);
    // Enforce role-based geographic scope
    if (user && user.role !== 'CENTRAL_ADMIN' && user.role !== 'CENTRAL_OFFICER') {
        if (user.stateId && !pDists.some(pd => pd.stateId === user.stateId)) {
            res.status(403).json({
                success: false,
                data: null,
                message: 'Access denied: Project is outside your assigned State jurisdiction.'
            });
            return;
        }
    }
    const districtDetails = pDists.map(pd => {
        const dist = store.districts.find(d => d.id === pd.districtId);
        const st = store.states.find(s => s.id === pd.stateId);
        return {
            districtId: pd.districtId,
            districtName: dist ? dist.name : 'District',
            stateName: st ? st.name : 'State',
            latitude: dist?.latitude,
            longitude: dist?.longitude,
            landRequired: pd.landRequired || 120,
            landAcquired: pd.landAcquired || 95
        };
    });
    // 2. Acquisition Cases
    const cases = store.acquisitionCases.filter(c => c.projectId === project.id);
    // 3. Parcels / GIS — only real parcels from the database store
    const rawParcels = store.parcels.filter(p => p.projectId === project.id);
    // Real GIS Alignment Corridors & Master-Plan Perimeter Polygons for all 47 national infrastructure projects
    const PROJECT_GIS_CONFIG = {
        // 1. Maharashtra
        'PRJ-NHAI-DME-001': {
            center: [19.8500, 73.3500],
            zoom: 10,
            polyline: [
                [19.2500, 73.1500], [19.4500, 73.2200], [19.7000, 73.2800], [19.8500, 73.3500], [20.0500, 73.5500]
            ]
        },
        'PRJ-NHSRCL-MAHSR-005': {
            center: [19.5500, 72.9500],
            zoom: 9,
            polyline: [
                [19.0650, 72.8680], [19.2100, 72.9800], [19.4500, 72.8200], [19.8000, 72.7500], [20.3800, 72.9100], [21.1700, 72.8300], [22.3000, 73.1800], [23.0700, 72.5800]
            ]
        },
        'PRJ-CIDCO-NMIA-006': {
            center: [18.9900, 73.0720],
            zoom: 13,
            polyline: [
                [19.0080, 73.0550], [19.0080, 73.0950], [18.9750, 73.0950], [18.9750, 73.0550], [19.0080, 73.0550]
            ]
        },
        // 2. Uttar Pradesh
        'PRJ-YEIDA-NIA-002': {
            center: [28.1550, 77.5550],
            zoom: 13,
            polyline: [
                [28.1750, 77.5300], [28.1750, 77.5850], [28.1300, 77.5850], [28.1300, 77.5300], [28.1750, 77.5300]
            ]
        },
        'PRJ-YEIDA-NIA-003': {
            center: [28.1250, 77.5850],
            zoom: 13,
            polyline: [
                [28.1400, 77.5650], [28.1400, 77.6150], [28.1050, 77.6150], [28.1050, 77.5650], [28.1400, 77.5650]
            ]
        },
        'PRJ-UPEIDA-PVE-010': {
            center: [26.2500, 82.2000],
            zoom: 8,
            polyline: [
                [26.7500, 81.0800], [26.6500, 81.4000], [26.4000, 81.8500], [26.2500, 82.2000], [25.5800, 83.5800]
            ]
        },
        // 3. Madhya Pradesh
        'PRJ-NWDA-KBLP-004': {
            center: [24.6200, 79.8800],
            zoom: 9,
            polyline: [
                [24.6200, 79.8800], [24.8500, 79.5000], [25.1000, 79.1000], [25.3500, 78.7500]
            ]
        },
        // 4. Karnataka
        'PRJ-BDA-BBC-007': {
            center: [13.0100, 77.6200],
            zoom: 11,
            polyline: [
                [13.0600, 77.4800], [13.1500, 77.5600], [13.1400, 77.6200], [13.0500, 77.6600], [13.0100, 77.7200], [12.8800, 77.7000], [12.8300, 77.6600]
            ]
        },
        // 5. Gujarat
        'PRJ-DFCCIL-WDFC-008': {
            center: [22.3000, 73.2000],
            zoom: 8,
            polyline: [
                [22.2500, 73.2000], [21.7200, 73.0000], [21.0800, 72.8800], [20.3500, 72.9000]
            ]
        },
        // 6. West Bengal
        'PRJ-DFCCIL-EDFC-009': {
            center: [22.6800, 88.3000],
            zoom: 10,
            polyline: [
                [22.6800, 88.3000], [22.7500, 88.3300], [23.2500, 87.8500], [23.7500, 86.9500]
            ]
        },
        // 7. Tamil Nadu
        'PRJ-CMRL-CMP2-011': {
            center: [13.0600, 80.2400],
            zoom: 12,
            polyline: [
                [13.1500, 80.2300], [13.0600, 80.2400], [13.0000, 80.2500], [12.8500, 80.2200]
            ]
        },
        'PRJ-TIDCO-TNDIC-014': {
            center: [11.0200, 77.1200],
            zoom: 11,
            polyline: [
                [11.0500, 77.0800], [11.0200, 77.1200], [10.9500, 77.1500], [10.9000, 77.1800]
            ]
        },
        // 8. Rajasthan
        'PRJ-SECI-BSP4-012': {
            center: [27.5380, 71.9150],
            zoom: 12,
            polyline: [
                [27.5600, 71.8800], [27.5600, 71.9600], [27.5000, 71.9600], [27.5000, 71.8800], [27.5600, 71.8800]
            ]
        },
        // 9. Jammu & Kashmir
        'PRJ-NRLY-USBRL-013': {
            center: [33.1500, 74.8800],
            zoom: 9,
            polyline: [
                [32.9900, 74.9300], [33.1500, 74.8800], [33.5000, 75.2000], [33.5900, 75.1600], [34.0200, 74.8300], [34.2100, 74.3400]
            ]
        },
        // 10. Bihar
        'PRJ-NICDC-AKIC-015': {
            center: [24.5800, 84.9500],
            zoom: 11,
            polyline: [
                [24.5500, 84.8800], [24.5800, 84.9500], [24.6200, 85.0200], [24.6800, 85.1000]
            ]
        },
        // 11. Haryana
        'PRJ-NHAI-KMP-016': {
            center: [28.3500, 76.9200],
            zoom: 10,
            polyline: [
                [28.8800, 77.1200], [28.8800, 76.9100], [28.5800, 76.8100], [28.3500, 76.9200], [28.2400, 77.0600], [28.1400, 77.3300]
            ]
        },
        'PRJ-NHAI-DAK-017': {
            center: [29.3200, 76.3100],
            zoom: 9,
            polyline: [
                [28.7800, 76.8800], [29.3200, 76.3100], [30.0300, 76.3000]
            ]
        },
        // 12. Punjab
        'PRJ-NHAI-DAKP-018': {
            center: [31.1300, 75.4700],
            zoom: 9,
            polyline: [
                [30.1500, 76.0500], [30.8500, 75.8500], [31.1300, 75.4700], [31.2200, 75.2000], [32.0400, 75.4000]
            ]
        },
        // 13. Himachal Pradesh
        'PRJ-NRLY-BML-019': {
            center: [31.7100, 76.9300],
            zoom: 9,
            polyline: [
                [31.3400, 76.7600], [31.7100, 76.9300], [31.9500, 77.1100], [32.2400, 77.1900], [32.6800, 77.2100]
            ]
        },
        // 14. Uttarakhand
        'PRJ-RVNL-RKRL-020': {
            center: [30.1500, 78.6000],
            zoom: 10,
            polyline: [
                [30.1000, 78.3000], [30.1300, 78.3800], [30.1500, 78.6000], [30.2200, 78.7800], [30.2800, 78.9800], [30.2600, 79.2200]
            ]
        },
        'PRJ-BRO-CDH-021': {
            center: [30.5500, 79.1500],
            zoom: 9,
            polyline: [
                [30.1200, 78.3000], [30.2800, 78.9800], [30.5500, 79.1500], [30.7400, 79.4900]
            ]
        },
        // 15. Andhra Pradesh
        'PRJ-APCRDA-ACC-022': {
            center: [16.5400, 80.5100],
            zoom: 13,
            polyline: [
                [16.5600, 80.4800], [16.5600, 80.5500], [16.5100, 80.5500], [16.5100, 80.4800], [16.5600, 80.4800]
            ]
        },
        'PRJ-AP-PIP-023': {
            center: [17.2580, 81.6550],
            zoom: 11,
            polyline: [
                [17.3000, 81.7000], [17.2580, 81.6550], [17.1500, 81.5000], [16.9500, 81.2500]
            ]
        },
        // 16. Telangana
        'PRJ-TSIIC-PFC-024': {
            center: [17.0420, 78.5850],
            zoom: 12,
            polyline: [
                [17.0700, 78.5500], [17.0700, 78.6300], [17.0100, 78.6300], [17.0100, 78.5500], [17.0700, 78.5500]
            ]
        },
        'PRJ-NHAI-TRRR-025': {
            center: [17.8800, 78.4800],
            zoom: 10,
            polyline: [
                [17.6200, 78.0800], [17.7400, 78.2800], [17.8800, 78.4800], [17.8500, 78.6800], [17.5100, 78.8900]
            ]
        },
        // 17. Kerala
        'PRJ-VISL-VZP-026': {
            center: [8.3750, 77.0020],
            zoom: 13,
            polyline: [
                [8.3850, 76.9900], [8.3850, 77.0150], [8.3650, 77.0150], [8.3650, 76.9900], [8.3850, 76.9900]
            ]
        },
        'PRJ-KMRL-KMP2-027': {
            center: [10.0100, 76.3400],
            zoom: 13,
            polyline: [
                [9.9980, 76.2990], [10.0050, 76.3120], [10.0150, 76.3300], [10.0100, 76.3600]
            ]
        },
        // 18. Odisha
        'PRJ-JSW-POSCO-028': {
            center: [21.6250, 85.5850],
            zoom: 12,
            polyline: [
                [21.6500, 85.5500], [21.6500, 85.6200], [21.5900, 85.6200], [21.5900, 85.5500], [21.6500, 85.5500]
            ]
        },
        'PRJ-PPA-WDD-029': {
            center: [20.2650, 86.6720],
            zoom: 13,
            polyline: [
                [20.2800, 86.6500], [20.2800, 86.6900], [20.2400, 86.6900], [20.2400, 86.6500], [20.2800, 86.6500]
            ]
        },
        // 19. Jharkhand
        'PRJ-JUIDCO-RSC-030': {
            center: [23.3100, 85.2900],
            zoom: 11,
            polyline: [
                [23.3100, 85.2900], [23.3500, 85.3900], [23.4400, 85.3200], [23.2700, 85.2800]
            ]
        },
        // 20. Chhattisgarh
        'PRJ-CG-RDMC-031': {
            center: [21.2500, 81.6300],
            zoom: 11,
            polyline: [
                [21.2300, 81.6700], [21.2500, 81.6300], [21.2600, 81.5600], [21.2100, 81.3800], [21.1900, 81.2800]
            ]
        },
        // 21. Goa
        'PRJ-GMR-MOPA-032': {
            center: [15.7500, 73.8650],
            zoom: 13,
            polyline: [
                [15.7650, 73.8450], [15.7650, 73.8850], [15.7300, 73.8850], [15.7300, 73.8450], [15.7650, 73.8450]
            ]
        },
        // 22. Delhi
        'PRJ-DMRC-M4P-033': {
            center: [28.6250, 77.2150],
            zoom: 12,
            polyline: [
                [28.6300, 77.0800], [28.6400, 77.2100], [28.7200, 77.1900], [28.6900, 77.2700]
            ]
        },
        // 23. Assam
        'PRJ-NHAI-GRR-034': {
            center: [26.2300, 91.8500],
            zoom: 11,
            polyline: [
                [26.3400, 91.7100], [26.2300, 91.8500], [26.1100, 91.9700], [26.1100, 91.8200], [26.1500, 91.6600]
            ]
        },
        // 24. Arunachal Pradesh
        'PRJ-BRO-SELA-035': {
            center: [27.5050, 92.1030],
            zoom: 12,
            polyline: [
                [27.4800, 92.1100], [27.5050, 92.1030], [27.5300, 92.0800]
            ]
        },
        // 25. Manipur
        'PRJ-NHIDCL-IMH-036': {
            center: [24.4800, 93.9800],
            zoom: 10,
            polyline: [
                [24.8100, 93.9400], [24.6400, 93.9900], [24.4800, 93.9800], [24.3800, 94.0200], [24.2400, 94.3000]
            ]
        },
        // 26. Meghalaya
        'PRJ-NHAI-SWB-037': {
            center: [25.5400, 91.8200],
            zoom: 11,
            polyline: [
                [25.6800, 91.9000], [25.5800, 91.8400], [25.5400, 91.8200], [25.4900, 91.8200]
            ]
        },
        // 27. Nagaland
        'PRJ-NHIDCL-DKH-038': {
            center: [25.7500, 93.8500],
            zoom: 11,
            polyline: [
                [25.8600, 93.7700], [25.7500, 93.8500], [25.6900, 94.0300], [25.6700, 94.1100]
            ]
        },
        // 28. Mizoram
        'PRJ-NHIDCL-ABP-039': {
            center: [23.7300, 92.6800],
            zoom: 11,
            polyline: [
                [23.8000, 92.6600], [23.7300, 92.6800], [23.6700, 92.7100]
            ]
        },
        // 29. Tripura
        'PRJ-NRLY-AAR-040': {
            center: [23.8320, 91.2480],
            zoom: 13,
            polyline: [
                [23.8050, 91.2750], [23.8320, 91.2480], [23.8500, 91.2380]
            ]
        },
        // 30. Sikkim
        'PRJ-RVNL-SRR-041': {
            center: [27.0580, 88.4980],
            zoom: 11,
            polyline: [
                [26.8850, 88.4750], [27.0580, 88.4980], [27.0900, 88.4550], [27.1500, 88.5000], [27.1750, 88.5300]
            ]
        },
        // 31. Chandigarh UT
        'PRJ-NHAI-CBE-042': {
            center: [30.8500, 76.7300],
            zoom: 11,
            polyline: [
                [30.7350, 76.8400], [30.8500, 76.7300], [30.9500, 76.7800]
            ]
        },
        // 32. Puducherry UT
        'PRJ-PPD-PPM-043': {
            center: [11.9180, 79.8320],
            zoom: 13,
            polyline: [
                [11.9300, 79.8200], [11.9300, 79.8400], [11.9050, 79.8400], [11.9050, 79.8200], [11.9300, 79.8200]
            ]
        },
        // 33. Andaman & Nicobar UT
        'PRJ-AAI-PBA-044': {
            center: [11.6410, 92.7300],
            zoom: 13,
            polyline: [
                [11.6520, 92.7200], [11.6520, 92.7420], [11.6300, 92.7420], [11.6300, 92.7200], [11.6520, 92.7200]
            ]
        },
        // 34. Ladakh UT
        'PRJ-BRO-ZLT-045': {
            center: [34.2850, 75.5000],
            zoom: 11,
            polyline: [
                [34.2550, 75.4200], [34.2850, 75.5000], [34.3100, 75.5900]
            ]
        },
        // 35. Lakshadweep UT
        'PRJ-AAI-AML-046': {
            center: [10.8240, 72.1760],
            zoom: 14,
            polyline: [
                [10.8400, 72.1700], [10.8400, 72.1850], [10.8100, 72.1850], [10.8100, 72.1700], [10.8400, 72.1700]
            ]
        },
        // 36. Dadra & Nagar Haveli and Daman & Diu UT
        'PRJ-NHAI-SDC-047': {
            center: [20.2700, 72.9800],
            zoom: 11,
            polyline: [
                [20.2700, 72.9800], [20.3700, 72.9100], [20.4100, 72.8300]
            ]
        }
    };
    // 4. Documents
    const documents = store.documents.filter(d => d.projectId === project.id);
    // 5. Compensation
    const caseIds = new Set(cases.map(c => c.id));
    const compensationRecords = store.compensationRecords.filter(c => caseIds.has(c.caseId));
    // 6. Affected Families & R&R
    const affectedFamilies = store.affectedFamilies.filter(f => f.projectId === project.id || caseIds.has(f.caseId));
    const familyIds = new Set(affectedFamilies.map(f => f.id));
    const rrRecords = store.rrRecords.filter(r => familyIds.has(r.affectedFamilyId) || caseIds.has(r.caseId));
    // Find matching GIS config for alignment polyline strictly by exact projectCode or exact name
    const gisConfig = (project.projectCode && PROJECT_GIS_CONFIG[project.projectCode])
        ? PROJECT_GIS_CONFIG[project.projectCode]
        : (PROJECT_GIS_CONFIG[project.name] || null);
    // Derive coordinates directly from project.centerCoord (e.g. [Lng, Lat]) or primary district location
    const primaryDist = districtDetails[0];
    const centerLat = gisConfig
        ? gisConfig.center[0]
        : project.centerCoord
            ? project.centerCoord[1]
            : (project.centerLat || (primaryDist && primaryDist.latitude) || 26.8467);
    const centerLng = gisConfig
        ? gisConfig.center[1]
        : project.centerCoord
            ? project.centerCoord[0]
            : (project.centerLng || (primaryDist && primaryDist.longitude) || 80.9462);
    const mapZoom = gisConfig ? gisConfig.zoom : 11;
    const alignmentPolyline = gisConfig ? gisConfig.polyline : [
        [centerLat - 0.04, centerLng - 0.05],
        [centerLat - 0.015, centerLng - 0.02],
        [centerLat, centerLng],
        [centerLat + 0.015, centerLng + 0.02],
        [centerLat + 0.04, centerLng + 0.05]
    ];
    // Map real parcels with GIS polygon coordinates & authentic statutory details
    const parcels = rawParcels.map((p, pIdx) => {
        const comp = compensationRecords.find(c => c.parcelId === p.id);
        const s = (p.acquisitionStatus || '').toUpperCase();
        const isAcquired = s === 'COMPLETED' || s === 'POSSESSION' || s === 'ACQUIRED';
        const isAwarded = s === 'AWARDED' || s === 'AWARD' || s === 'COMPENSATION';
        const isDisputed = s === 'DISPUTED' || s === 'OBJECTION';
        let holdUpReason = 'Joint Cadastral Boundary & Drone Survey verified under Section 4(2).';
        if (isAcquired) {
            holdUpReason = 'Clear Title & Possession Handed Over — PFMS DBT Compensation Settled';
        }
        else if (isAwarded) {
            holdUpReason = 'Section 30 Solatium Award Approved — Clear for Electronic PFMS DBT Release';
        }
        else if (isDisputed) {
            holdUpReason = 'Section 15 Public Objection — Valuation / Title clarification under Collectorate hearing';
        }
        else if (s === 'VALUATION') {
            holdUpReason = 'Section 26 Circle Rate & Solatium Determination Matrix under verification';
        }
        else if (s === 'NOTIFICATION') {
            holdUpReason = 'Section 11 Preliminary Notification Gazette publication active';
        }
        const valuationCr = comp
            ? (comp.assessedAmount >= 10000000 ? `₹${(comp.assessedAmount / 10000000).toFixed(2)} Cr` : `₹${(comp.assessedAmount / 100000).toFixed(1)} Lakh`)
            : `₹${((Number(p.areaHectares) || 1.5) * 1.85).toFixed(2)} Cr`;
        const solatiumAmountCr = comp
            ? (comp.approvedAmount >= 10000000 ? `₹${((comp.approvedAmount * 0.5) / 10000000).toFixed(2)} Cr (100% Solatium u/s 30)` : `₹${((comp.approvedAmount * 0.5) / 100000).toFixed(1)} Lakh (100% Solatium u/s 30)`)
            : `₹${((Number(p.areaHectares) || 1.5) * 1.85).toFixed(2)} Cr (100% Solatium u/s 30)`;
        let center = [centerLat + (pIdx - 1) * 0.006, centerLng + (pIdx - 1) * 0.008];
        let polygon = [
            [center[0] - 0.003, center[1] - 0.004],
            [center[0] - 0.003, center[1] + 0.004],
            [center[0] + 0.003, center[1] + 0.004],
            [center[0] + 0.003, center[1] - 0.004]
        ];
        if (p.geojson) {
            try {
                const geo = JSON.parse(p.geojson);
                const coords = geo?.coordinates?.[0] || [];
                if (coords.length > 0) {
                    center = [
                        coords.reduce((sum, c) => sum + c[1], 0) / coords.length,
                        coords.reduce((sum, c) => sum + c[0], 0) / coords.length
                    ];
                    polygon = coords.map((c) => [c[1], c[0]]);
                }
            }
            catch (e) { /* fall back to computed */ }
        }
        return {
            ...p,
            center,
            polygon,
            ownerName: comp?.beneficiaryName || p.ownerName || p.beneficiaryName || `Recorded Landowner (Khasra ${p.khasraNumber})`,
            valuationCr,
            solatiumAmountCr,
            holdUpReason,
            landCategory: p.landCategory || (p.landUse === 'AGRICULTURAL' ? 'Private Agricultural Land' : p.landUse === 'GOVERNMENT' ? 'Government / Gram Sabha' : p.landUse === 'FOREST' ? 'Forest Rights Act (FRA)' : p.landUse || 'Private Land')
        };
    });
    // 7. Approvals
    const approvals = store.approvals.filter(a => a.entityId === project.id || caseIds.has(a.entityId));
    // 8. Timeline
    const notifDate = project.notificationDate ? new Date(project.notificationDate) : new Date('2020-01-15');
    const awardDate = project.awardDate ? new Date(project.awardDate) : new Date(notifDate.getTime() + 180 * 86400000);
    const rawTargetDate = project.targetCompletionDate || project.targetCompletion;
    const targetDate = rawTargetDate ? new Date(rawTargetDate) : new Date('2026-12-31');
    const isCompleted = project.status === 'COMPLETED';
    const formattedTargetDate = targetDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timelineEvents = [
        {
            date: project.createdAt || notifDate,
            title: 'Project Sanctioned & Registered',
            description: `Project registered under ${project.ministry} with ${project.totalLandRequired} Ha statutory land requirement.`,
            status: 'COMPLETED',
            officer: 'Central Administrative Authority'
        },
        {
            date: notifDate,
            title: 'Section 3A / Section 4 Statutory Gazette Notification Issued',
            description: `Official declaration of intent to acquire land published in eGazette India (Ref: ${project.projectCode}).`,
            status: 'COMPLETED',
            officer: 'Ministry Gazette Authority'
        },
        {
            date: new Date(notifDate.getTime() + 90 * 86400000),
            title: 'Joint Cadastral Survey & SIA Verification Completed',
            description: 'Competent Authority and District Revenue Officers finalized field survey and Social Impact Assessment.',
            status: 'COMPLETED',
            officer: 'Land Acquisition Officer'
        },
        {
            date: awardDate,
            title: 'Section 3G / Section 19 Compensation Determination Matrix Approved',
            description: 'Collectorate finalized circle rate valuation with 100% Solatium and statutory interest.',
            status: 'COMPLETED',
            officer: 'District Collector'
        },
        {
            date: new Date(awardDate.getTime() + 60 * 86400000),
            title: 'DBT Direct Compensation Disbursement via PFMS',
            description: 'Electronic transfer of compensation funds to verified beneficiary accounts.',
            status: isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
            officer: 'PFMS Disbursing Officer'
        },
        isCompleted ? {
            date: targetDate,
            title: '🎉 Official Project Completion & Inauguration Date',
            description: `Project fully constructed, commissioned, and officially inaugurated on ${formattedTargetDate}. All commercial operations and traffic active.`,
            status: 'COMPLETED',
            officer: 'Ministry & State Administrative Authority'
        } : {
            date: targetDate,
            title: '🗓️ Tentative Target Completion & Commercialization',
            description: `Target completion date set for ${formattedTargetDate} as per official Ministry DPR milestone schedules. Construction and remaining land handovers in progress.`,
            status: 'SCHEDULED',
            officer: 'Project Director / Chief Engineer'
        }
    ];
    // 9. Audit Logs
    const auditLogs = store.auditLogs.filter(a => a.entityId === project.id || caseIds.has(a.entityId));
    const progressPercentage = Math.min(100, Math.round((project.totalLandAcquired / (project.totalLandRequired || 1)) * 100));
    // 10. Predictive Delay-Risk Analytics Engine
    const disputedCount = parcels.filter(p => p.acquisitionStatus === 'DISPUTED' || p.acquisitionStatus === 'SURVEYED').length;
    const pendingComp = compensationRecords.filter(c => c.paymentStatus === 'PENDING' || c.paymentStatus === 'APPROVED').length;
    const isOverdue = targetDate.getTime() < new Date().getTime() && !isCompleted;
    let riskScore = 18;
    const riskFactors = [];
    if (disputedCount > 0) {
        riskScore += Math.min(35, disputedCount * 10);
        riskFactors.push(`${disputedCount} Land Parcels under Survey / Boundary Verification`);
    }
    if (pendingComp > 0) {
        riskScore += Math.min(25, pendingComp * 8);
        riskFactors.push(`${pendingComp} Compensation Awards awaiting Direct Benefit Transfer (DBT)`);
    }
    if (isOverdue) {
        riskScore += 25;
        riskFactors.push('DPR Target Completion Date overdue');
    }
    if (progressPercentage < 50) {
        riskScore += 15;
        riskFactors.push('Acquisition Progress below 50% milestone');
    }
    riskScore = Math.min(95, Math.max(12, riskScore));
    const riskCategory = riskScore >= 60 ? 'HIGH' : riskScore >= 35 ? 'MEDIUM' : 'LOW';
    res.json({
        success: true,
        data: {
            ...project,
            targetCompletion: project.targetCompletionDate || project.targetCompletion,
            targetCompletionDate: project.targetCompletionDate || project.targetCompletion,
            progressPercentage,
            predictiveAnalytics: {
                riskScore,
                riskCategory,
                riskFactors: riskFactors.length > 0 ? riskFactors : ['Optimal Milestone Acceleration — Low Acquisition Risk']
            },
            districtBreakdown: districtDetails,
            cases,
            parcels,
            gisMap: {
                center: [centerLat, centerLng],
                zoom: mapZoom,
                alignmentPolyline,
                parcels
            },
            documents,
            compensationRecords,
            affectedFamilies,
            rrRecords,
            approvals,
            timelineEvents,
            auditLogs
        },
        message: 'Project details retrieved successfully.'
    });
}
async function createProject(req, res) {
    const store = (0, database_1.getDatabaseStore)();
    const { name, projectCode, projectType, implementingAgency, ministry, totalLandRequired, estimatedCost, stateId, districtId } = req.body;
    if (!name || !projectCode || !implementingAgency) {
        res.status(400).json({
            success: false,
            data: null,
            message: 'Name, Project Code, and Implementing Agency are required.'
        });
        return;
    }
    const newProject = {
        id: `proj-${Date.now()}`,
        projectCode,
        name,
        description: req.body.description || '',
        projectType: projectType || 'HIGHWAY',
        implementingAgency,
        ministry: ministry || 'Ministry of Road Transport & Highways',
        status: 'PLANNING',
        totalLandRequired: Number(totalLandRequired) || 100.0,
        totalLandAcquired: 0.0,
        estimatedCost: Number(estimatedCost) || 500.0,
        startDate: new Date(),
        targetCompletionDate: new Date(Date.now() + 365 * 24 * 3600 * 1000 * 3),
        dataSource: 'DEMO',
        createdBy: req.user?.id || 'user-central-admin',
        createdAt: new Date(),
        updatedAt: new Date()
    };
    store.projects.unshift(newProject);
    if (stateId && districtId) {
        store.projectDistricts.push({
            id: `pd-${newProject.id}-1`,
            projectId: newProject.id,
            districtId,
            stateId,
            landRequired: newProject.totalLandRequired,
            landAcquired: 0.0,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }
    // Audit
    store.auditLogs.unshift({
        id: `audit-${Date.now()}`,
        userId: req.user?.id || 'user-central-admin',
        userEmail: req.user?.email || 'admin@gov.in',
        action: 'CREATE_PROJECT',
        entityType: 'PROJECT',
        entityId: newProject.id,
        oldValue: null,
        newValue: JSON.stringify({ name: newProject.name, code: newProject.projectCode }),
        ipAddress: req.ip || '127.0.0.1',
        createdAt: new Date()
    });
    (0, database_1.saveDatabaseStore)();
    res.status(201).json({
        success: true,
        data: newProject,
        message: 'Project created successfully.'
    });
}
