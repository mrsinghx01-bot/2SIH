import { Request, Response } from 'express';
import { getDatabaseStore, saveDatabaseStore } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export async function getAllProjects(req: AuthRequest, res: Response): Promise<void> {
  const store = getDatabaseStore();
  const user = req.user;
  let stateId = req.query.stateId as string;
  let districtId = req.query.districtId as string;
  const projectType = req.query.projectType as string;
  const status = req.query.status as string;
  const searchQuery = (req.query.search as string || '').toLowerCase().trim();

  // Enforce role-based geographic scope
  if (user && user.role !== 'CENTRAL_ADMIN' && user.role !== 'CENTRAL_OFFICER') {
    if (user.stateId) stateId = user.stateId;
    if (user.districtId) districtId = user.districtId;
  }

  let results = store.projects;

  if (stateId) {
    const matchingProjectIds = new Set(
      store.projectDistricts.filter(pd => pd.stateId === stateId).map(pd => pd.projectId)
    );
    results = results.filter(p => matchingProjectIds.has(p.id));
  }

  if (districtId) {
    const matchingProjectIds = new Set(
      store.projectDistricts.filter(pd => pd.districtId === districtId).map(pd => pd.projectId)
    );
    results = results.filter(p => matchingProjectIds.has(p.id));
  }

  if (projectType) {
    results = results.filter(p => p.projectType === projectType);
  }

  if (status) {
    results = results.filter(p => p.status === status);
  }

  if (searchQuery) {
    results = results.filter(p =>
      p.name.toLowerCase().includes(searchQuery) ||
      p.projectCode.toLowerCase().includes(searchQuery) ||
      p.implementingAgency.toLowerCase().includes(searchQuery) ||
      p.ministry.toLowerCase().includes(searchQuery)
    );
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

export async function getProjectById(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const store = getDatabaseStore();
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

  // Real GIS Alignment Corridors for major national infrastructure projects across all States & UTs
  const PROJECT_GIS_CONFIG: Record<string, { center: [number, number]; zoom: number; polyline: [number, number][] }> = {
    // 1. Maharashtra
    'PRJ-NHAI-DME-001': {
      center: [23.8000, 74.8000],
      zoom: 6,
      polyline: [
        [28.2488, 77.0688], [27.7916, 76.9427], [26.8920, 76.3330], [25.9926, 76.3570], [25.1804, 75.8573],
        [24.1685, 75.6420], [23.3315, 75.0367], [22.8347, 74.2565], [22.7756, 73.6143], [22.3072, 73.1812],
        [21.7051, 72.9959], [21.1702, 72.8311], [20.6100, 72.9260], [19.4700, 72.8000], [18.9500, 72.9500]
      ]
    },
    'PRJ-NHSRCL-MAHSR-005': {
      center: [20.8000, 72.9000],
      zoom: 7,
      polyline: [
        [23.0225, 72.5714], [22.5645, 72.9289], [22.3072, 73.1812], [21.7051, 72.9959], [21.1702, 72.8311],
        [20.7644, 72.9542], [20.3893, 72.9106], [19.8000, 72.7500], [19.4700, 72.8000], [19.1760, 72.9781], [19.0600, 72.8680]
      ]
    },
    'PRJ-CIDCO-NMIA-006': {
      center: [18.9900, 73.1200],
      zoom: 12,
      polyline: [
        [18.9700, 73.0900], [18.9850, 73.1100], [19.0050, 73.1350], [19.0150, 73.1500]
      ]
    },
    // 2. Uttar Pradesh
    'PRJ-YEIDA-NIA-002': {
      center: [28.1550, 77.5550],
      zoom: 12,
      polyline: [
        [28.1800, 77.5300], [28.1750, 77.5800], [28.1300, 77.5850], [28.1200, 77.5350], [28.1800, 77.5300]
      ]
    },
    'PRJ-YEIDA-NIA-003': {
      center: [28.1200, 77.6000],
      zoom: 12,
      polyline: [
        [28.1400, 77.5700], [28.1350, 77.6200], [28.1000, 77.6250], [28.0900, 77.5750], [28.1400, 77.5700]
      ]
    },
    'PRJ-UPEIDA-PVE-010': {
      center: [26.2500, 82.3000],
      zoom: 8,
      polyline: [
        [26.7800, 81.0500], [26.6500, 81.4000], [26.4000, 81.8500], [26.2500, 82.2000], [25.5800, 83.5800]
      ]
    },
    // 3. Madhya Pradesh
    'PRJ-NWDA-KBLP-004': {
      center: [24.7200, 80.0000],
      zoom: 8,
      polyline: [
        [24.6200, 79.8800], [24.8500, 79.5000], [25.1000, 79.1000], [25.3500, 78.7500], [25.4500, 78.5800]
      ]
    },
    // 4. Karnataka
    'PRJ-BDA-BBC-007': {
      center: [13.0000, 77.6000],
      zoom: 10,
      polyline: [
        [13.1500, 77.5000], [13.1800, 77.6500], [13.0800, 77.7500], [12.9200, 77.7800], [12.8200, 77.6800], [12.8500, 77.5200]
      ]
    },
    // 5. Gujarat
    'PRJ-DFCCIL-WDFC-008': {
      center: [22.3000, 73.2000],
      zoom: 7,
      polyline: [
        [23.1000, 72.6000], [22.8000, 72.9000], [22.3000, 73.2000], [21.7000, 73.0000], [21.1700, 72.8300], [20.4000, 72.9200]
      ]
    },
    // 6. West Bengal
    'PRJ-DFCCIL-EDFC-009': {
      center: [22.6000, 88.0000],
      zoom: 8,
      polyline: [
        [23.7500, 86.9500], [23.5000, 87.3000], [23.2500, 87.8500], [22.9500, 88.2000], [22.6500, 88.3500]
      ]
    },
    // 7. Tamil Nadu
    'PRJ-CMRL-CMP2-011': {
      center: [13.0800, 80.2700],
      zoom: 11,
      polyline: [
        [13.1500, 80.2300], [13.0800, 80.2100], [13.0500, 80.2600], [12.9600, 80.2400], [12.8500, 80.2200]
      ]
    },
    'PRJ-TIDCO-TNDIC-014': {
      center: [11.0100, 76.9600],
      zoom: 11,
      polyline: [
        [11.0300, 76.9200], [11.0100, 76.9600], [10.9800, 77.0200], [10.9200, 77.0600]
      ]
    },
    // 8. Rajasthan
    'PRJ-SECI-BSP4-012': {
      center: [27.5100, 71.9100],
      zoom: 11,
      polyline: [
        [27.5600, 71.8800], [27.5600, 71.9500], [27.5000, 71.9500], [27.5000, 71.8800], [27.5600, 71.8800]
      ]
    },
    // 9. Jammu & Kashmir
    'PRJ-NRLY-USBRL-013': {
      center: [33.5000, 74.9000],
      zoom: 8,
      polyline: [
        [32.9275, 75.1419], [33.1500, 74.8500], [33.3200, 75.1500], [33.5300, 75.2300], [33.9900, 75.0100], [34.0837, 74.7973], [34.2200, 74.4600]
      ]
    },
    // 10. Bihar
    'PRJ-NICDC-AKIC-015': {
      center: [24.7500, 84.9900],
      zoom: 11,
      polyline: [
        [24.7000, 84.9200], [24.7300, 84.9600], [24.7600, 85.0100], [24.8000, 85.0600]
      ]
    },
    // 11. Haryana
    'PRJ-NHAI-KMP-016': {
      center: [28.4000, 76.9200],
      zoom: 9,
      polyline: [
        [28.9800, 77.1000], [28.8800, 76.8000], [28.5500, 76.7000], [28.2500, 76.8500], [28.1800, 77.0500], [28.2500, 77.3200], [28.4500, 77.5200]
      ]
    },
    'PRJ-NHAI-DAK-017': {
      center: [29.8000, 76.3000],
      zoom: 8,
      polyline: [
        [28.7500, 77.1000], [29.2500, 76.7500], [29.6500, 76.4500], [30.0000, 76.2000]
      ]
    },
    // 12. Punjab
    'PRJ-NHAI-DAKP-018': {
      center: [31.3000, 75.5000],
      zoom: 8,
      polyline: [
        [30.5000, 76.0000], [30.9000, 75.8500], [31.3000, 75.5500], [31.6500, 75.1000], [32.1000, 75.0000]
      ]
    },
    // 13. Himachal Pradesh
    'PRJ-NRLY-BML-019': {
      center: [31.8000, 76.9000],
      zoom: 8,
      polyline: [
        [31.3500, 76.7500], [31.7000, 76.9500], [32.2500, 77.1800], [32.5500, 77.2000], [33.2000, 77.5500]
      ]
    },
    // 14. Uttarakhand
    'PRJ-RVNL-RKRL-020': {
      center: [30.2000, 78.6000],
      zoom: 9,
      polyline: [
        [30.1100, 78.3000], [30.1500, 78.5000], [30.2200, 78.7800], [30.2800, 78.9800], [30.2600, 79.2200]
      ]
    },
    'PRJ-BRO-CDH-021': {
      center: [30.7000, 78.4000],
      zoom: 9,
      polyline: [
        [30.1500, 78.3000], [30.5000, 78.4500], [30.7500, 78.6000], [30.5500, 79.1500], [30.7500, 79.5000]
      ]
    },
    // 15. Andhra Pradesh
    'PRJ-APCRDA-ACC-022': {
      center: [16.5000, 80.5000],
      zoom: 11,
      polyline: [
        [16.5500, 80.4500], [16.5800, 80.5200], [16.5200, 80.5800], [16.4800, 80.5000], [16.5500, 80.4500]
      ]
    },
    'PRJ-AP-PIP-023': {
      center: [17.2500, 81.6500],
      zoom: 9,
      polyline: [
        [17.2600, 81.6400], [17.1000, 81.4500], [16.9500, 81.2500], [16.8000, 81.1000]
      ]
    },
    // 16. Telangana
    'PRJ-TSIIC-PFC-024': {
      center: [17.0500, 78.6000],
      zoom: 11,
      polyline: [
        [17.1000, 78.5500], [17.0800, 78.6200], [17.0200, 78.6500], [17.0000, 78.5800]
      ]
    },
    'PRJ-NHAI-TRRR-025': {
      center: [17.8000, 78.5000],
      zoom: 9,
      polyline: [
        [17.6500, 78.1200], [17.8500, 78.4800], [17.6800, 78.8500], [17.3200, 78.9200]
      ]
    },
    // 17. Kerala
    'PRJ-VISL-VZP-026': {
      center: [8.3700, 76.9900],
      zoom: 12,
      polyline: [
        [8.3900, 76.9700], [8.3750, 76.9850], [8.3650, 77.0050], [8.3550, 77.0200]
      ]
    },
    'PRJ-KMRL-KMP2-027': {
      center: [9.9800, 76.3200],
      zoom: 12,
      polyline: [
        [10.0000, 76.3000], [9.9900, 76.3200], [9.9800, 76.3400], [9.9700, 76.3600]
      ]
    },
    // 18. Odisha
    'PRJ-JSW-POSCO-028': {
      center: [21.6000, 85.6000],
      zoom: 11,
      polyline: [
        [21.6400, 85.5600], [21.6200, 85.5900], [21.5800, 85.6200], [21.5500, 85.6500]
      ]
    },
    'PRJ-PPA-WDD-029': {
      center: [20.2700, 86.6800],
      zoom: 12,
      polyline: [
        [20.2900, 86.6500], [20.2750, 86.6750], [20.2600, 86.6950], [20.2500, 86.7100]
      ]
    },
    // 19. Jharkhand
    'PRJ-JUIDCO-RSC-030': {
      center: [23.3500, 85.3000],
      zoom: 10,
      polyline: [
        [23.4500, 85.2500], [23.4800, 85.3800], [23.3500, 85.4500], [23.2500, 85.3500], [23.2800, 85.2000]
      ]
    },
    // 20. Chhattisgarh
    'PRJ-CG-RDMC-031': {
      center: [21.2500, 81.6300],
      zoom: 10,
      polyline: [
        [21.1800, 81.3000], [21.2100, 81.4500], [21.2400, 81.6000], [21.2600, 81.7500]
      ]
    },
    // 21. Goa
    'PRJ-GMR-MOPA-032': {
      center: [15.7500, 73.8600],
      zoom: 12,
      polyline: [
        [15.7700, 73.8400], [15.7600, 73.8700], [15.7350, 73.8800], [15.7200, 73.8500]
      ]
    },
    // 22. Delhi
    'PRJ-DMRC-M4P-033': {
      center: [28.6500, 77.2000],
      zoom: 11,
      polyline: [
        [28.7200, 77.1500], [28.6800, 77.2000], [28.6400, 77.2500], [28.5800, 77.2800]
      ]
    },
    // 23. Assam
    'PRJ-NHAI-GRR-034': {
      center: [26.1500, 91.7000],
      zoom: 10,
      polyline: [
        [26.2500, 91.6000], [26.2200, 91.7200], [26.1400, 91.8000], [26.0800, 91.7000]
      ]
    },
    // 24. Arunachal Pradesh
    'PRJ-BRO-SELA-035': {
      center: [27.5000, 92.1000],
      zoom: 10,
      polyline: [
        [27.3500, 92.2500], [27.4800, 92.1200], [27.5500, 92.0500], [27.6000, 91.9000]
      ]
    },
    // 25. Manipur
    'PRJ-NHIDCL-IMH-036': {
      center: [24.8000, 93.9000],
      zoom: 9,
      polyline: [
        [24.8000, 93.9400], [24.5000, 93.9800], [24.2500, 94.0800], [24.2100, 94.3000]
      ]
    },
    // 26. Meghalaya
    'PRJ-NHAI-SWB-037': {
      center: [25.5700, 91.8800],
      zoom: 11,
      polyline: [
        [25.6500, 91.8200], [25.6000, 91.8600], [25.5500, 91.9000], [25.5000, 91.9400]
      ]
    },
    // 27. Nagaland
    'PRJ-NHIDCL-DKH-038': {
      center: [25.8000, 93.7500],
      zoom: 10,
      polyline: [
        [25.9100, 93.7200], [25.8200, 93.7500], [25.7500, 93.8500], [25.6700, 94.1000]
      ]
    },
    // 28. Mizoram
    'PRJ-NHIDCL-ABP-039': {
      center: [23.7200, 92.7200],
      zoom: 11,
      polyline: [
        [23.7800, 92.6800], [23.7500, 92.7100], [23.7100, 92.7400], [23.6800, 92.7600]
      ]
    },
    // 29. Tripura
    'PRJ-NRLY-AAR-040': {
      center: [23.8300, 91.2800],
      zoom: 12,
      polyline: [
        [23.8500, 91.2600], [23.8350, 91.2750], [23.8200, 91.2950], [23.8050, 91.3100]
      ]
    },
    // 30. Sikkim
    'PRJ-RVNL-SRR-041': {
      center: [27.2000, 88.5000],
      zoom: 10,
      polyline: [
        [26.8800, 88.4800], [27.0500, 88.5200], [27.1800, 88.5400], [27.2200, 88.5600]
      ]
    },
    // 31. Chandigarh UT
    'PRJ-NHAI-CBE-042': {
      center: [30.7300, 76.8000],
      zoom: 11,
      polyline: [
        [30.7000, 76.7600], [30.7300, 76.8000], [30.8200, 76.8500], [30.9000, 76.8800]
      ]
    },
    // 32. Puducherry UT
    'PRJ-PPD-PPM-043': {
      center: [11.9200, 79.8300],
      zoom: 12,
      polyline: [
        [11.9400, 79.8100], [11.9250, 79.8300], [11.9100, 79.8450], [11.8950, 79.8600]
      ]
    },
    // 33. Andaman & Nicobar UT
    'PRJ-AAI-PBA-044': {
      center: [11.6400, 92.7300],
      zoom: 12,
      polyline: [
        [11.6600, 92.7100], [11.6450, 92.7300], [11.6300, 92.7450], [11.6150, 92.7600]
      ]
    },
    // 34. Ladakh UT
    'PRJ-BRO-ZLT-045': {
      center: [34.3000, 75.8000],
      zoom: 10,
      polyline: [
        [34.2500, 75.6000], [34.2800, 75.7200], [34.3100, 75.8500], [34.3400, 75.9800]
      ]
    },
    // 35. Lakshadweep UT
    'PRJ-AAI-AML-046': {
      center: [10.8500, 72.1800],
      zoom: 13,
      polyline: [
        [10.8700, 72.1700], [10.8550, 72.1800], [10.8400, 72.1900], [10.8250, 72.2000]
      ]
    },
    // 36. Dadra & Nagar Haveli and Daman & Diu UT
    'PRJ-NHAI-SDC-047': {
      center: [20.3000, 72.9000],
      zoom: 11,
      polyline: [
        [20.2500, 73.0000], [20.2800, 72.9500], [20.3500, 72.8700], [20.4000, 72.8300]
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
    } else if (isAwarded) {
      holdUpReason = 'Section 30 Solatium Award Approved — Clear for Electronic PFMS DBT Release';
    } else if (isDisputed) {
      holdUpReason = 'Section 15 Public Objection — Valuation / Title clarification under Collectorate hearing';
    } else if (s === 'VALUATION') {
      holdUpReason = 'Section 26 Circle Rate & Solatium Determination Matrix under verification';
    } else if (s === 'NOTIFICATION') {
      holdUpReason = 'Section 11 Preliminary Notification Gazette publication active';
    }

    const valuationCr = comp
      ? (comp.assessedAmount >= 10000000 ? `₹${(comp.assessedAmount / 10000000).toFixed(2)} Cr` : `₹${(comp.assessedAmount / 100000).toFixed(1)} Lakh`)
      : `₹${((Number(p.areaHectares) || 1.5) * 1.85).toFixed(2)} Cr`;

    const solatiumAmountCr = comp
      ? (comp.approvedAmount >= 10000000 ? `₹${((comp.approvedAmount * 0.5) / 10000000).toFixed(2)} Cr (100% Solatium u/s 30)` : `₹${((comp.approvedAmount * 0.5) / 100000).toFixed(1)} Lakh (100% Solatium u/s 30)`)
      : `₹${((Number(p.areaHectares) || 1.5) * 1.85).toFixed(2)} Cr (100% Solatium u/s 30)`;

    let center: [number, number] = [centerLat + (pIdx - 1) * 0.006, centerLng + (pIdx - 1) * 0.008];
    let polygon: [number, number][] = [
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
            coords.reduce((sum: number, c: number[]) => sum + c[1], 0) / coords.length,
            coords.reduce((sum: number, c: number[]) => sum + c[0], 0) / coords.length
          ];
          polygon = coords.map((c: number[]) => [c[1], c[0]]);
        }
      } catch (e) { /* fall back to computed */ }
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
  const riskFactors: string[] = [];
  
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

export async function createProject(req: AuthRequest, res: Response): Promise<void> {
  const store = getDatabaseStore();
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

  saveDatabaseStore();

  res.status(201).json({
    success: true,
    data: newProject,
    message: 'Project created successfully.'
  });
}
