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
            progressPercentage: progress
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
            landRequired: pd.landRequired || 120,
            landAcquired: pd.landAcquired || 95
        };
    });
    // 2. Acquisition Cases
    const cases = store.acquisitionCases.filter(c => c.projectId === project.id);
    // 3. Parcels / GIS
    const rawParcels = store.parcels.filter(p => p.projectId === project.id);
    // Project Center GIS Anchor
    const centerLat = 26.8467 + (parseInt(project.id.replace(/\D/g, '') || '1', 10) % 5) * 0.4;
    const centerLng = 80.9462 + (parseInt(project.id.replace(/\D/g, '') || '1', 10) % 5) * 0.5;
    // Generate Cadastral GIS Polygons for parcels
    const parcels = (rawParcels.length > 0 ? rawParcels : [
        { id: 'pcl-1', parcelNumber: 'KHA-101/1', khasraNumber: '101/1', village: 'Sarojini Nagar', areaHectares: 2.45, landUse: 'AGRICULTURAL', acquisitionStatus: 'COMPLETED' },
        { id: 'pcl-2', parcelNumber: 'KHA-101/2', khasraNumber: '101/2', village: 'Sarojini Nagar', areaHectares: 1.80, landUse: 'AGRICULTURAL', acquisitionStatus: 'POSSESSION' },
        { id: 'pcl-3', parcelNumber: 'KHA-102/1', khasraNumber: '102/1', village: 'Banthra', areaHectares: 3.10, landUse: 'RESIDENTIAL', acquisitionStatus: 'VALUATION' },
        { id: 'pcl-4', parcelNumber: 'KHA-102/2', khasraNumber: '102/2', village: 'Banthra', areaHectares: 4.25, landUse: 'GOVERNMENT', acquisitionStatus: 'SURVEY' },
        { id: 'pcl-5', parcelNumber: 'KHA-103/1', khasraNumber: '103/1', village: 'Mohanlalganj', areaHectares: 2.90, landUse: 'COMMERCIAL', acquisitionStatus: 'NOTIFICATION' },
        { id: 'pcl-6', parcelNumber: 'KHA-104/1', khasraNumber: '104/1', village: 'Goshainganj', areaHectares: 5.15, landUse: 'AGRICULTURAL', acquisitionStatus: 'COMPENSATION' }
    ]).map((p, pIdx) => {
        const latOffset = (pIdx - 2.5) * 0.008;
        const lngOffset = (pIdx - 2.5) * 0.012;
        const pLat = centerLat + latOffset;
        const pLng = centerLng + lngOffset;
        // 4-point parcel boundary polygon
        const polygon = [
            [pLat - 0.003, pLng - 0.004],
            [pLat - 0.003, pLng + 0.004],
            [pLat + 0.003, pLng + 0.004],
            [pLat + 0.003, pLng - 0.004]
        ];
        return {
            ...p,
            projectId: project.id,
            center: [pLat, pLng],
            polygon,
            ownerName: `Landowner Smt. / Shri Ram (${p.khasraNumber})`,
            valuationCr: (p.areaHectares * 1.85).toFixed(2),
            solatiumIncluded: true
        };
    });
    // Project Corridor Alignment Polyline
    const alignmentPolyline = [
        [centerLat - 0.04, centerLng - 0.06],
        [centerLat - 0.02, centerLng - 0.03],
        [centerLat, centerLng],
        [centerLat + 0.02, centerLng + 0.03],
        [centerLat + 0.05, centerLng + 0.07]
    ];
    // 4. Documents
    const documents = store.documents.filter(d => d.projectId === project.id);
    // 5. Compensation
    const caseIds = new Set(cases.map(c => c.id));
    const compensationRecords = store.compensationRecords.filter(c => caseIds.has(c.caseId));
    // 6. Affected Families & R&R
    const affectedFamilies = store.affectedFamilies.filter(f => f.projectId === project.id || caseIds.has(f.caseId));
    const familyIds = new Set(affectedFamilies.map(f => f.id));
    const rrRecords = store.rrRecords.filter(r => familyIds.has(r.affectedFamilyId) || caseIds.has(r.caseId));
    // 7. Approvals
    const approvals = store.approvals.filter(a => a.entityId === project.id || caseIds.has(a.entityId));
    // 8. Timeline
    const timelineEvents = [
        {
            date: project.createdAt,
            title: 'Project Sanctioned & Registered',
            description: `Project registered under ${project.ministry} with ${project.totalLandRequired} Ha land requirement.`,
            status: 'COMPLETED',
            officer: 'Central Admin'
        },
        {
            date: new Date('2024-03-01T10:00:00Z'),
            title: 'Joint Cadastral Survey Initiated',
            description: 'Competent Authority and Revenue Officers initiated field survey.',
            status: 'COMPLETED',
            officer: 'Land Acquisition Officer'
        },
        {
            date: new Date('2024-06-10T10:00:00Z'),
            title: 'Section 3A / 4 Gazette Notification Issued',
            description: 'Statutory declaration of intention to acquire land published in Gazette.',
            status: 'COMPLETED',
            officer: 'Ministry Gazette Authority'
        },
        {
            date: new Date('2024-11-12T14:00:00Z'),
            title: 'Section 3G Valuation Determination Matrix Approved',
            description: 'Market rate determination with 100% Solatium finalized by Collector.',
            status: 'COMPLETED',
            officer: 'District Collector'
        },
        {
            date: new Date('2025-03-15T09:30:00Z'),
            title: 'DBT Direct Compensation Disbursement Commenced',
            description: 'Electronic transfer of compensation amounts through PFMS portal.',
            status: 'IN_PROGRESS',
            officer: 'Disbursing Officer'
        }
    ];
    // 9. Audit Logs
    const auditLogs = store.auditLogs.filter(a => a.entityId === project.id || caseIds.has(a.entityId));
    const progressPercentage = Math.min(100, Math.round((project.totalLandAcquired / (project.totalLandRequired || 1)) * 100));
    res.json({
        success: true,
        data: {
            ...project,
            progressPercentage,
            districtBreakdown: districtDetails.length > 0 ? districtDetails : [
                { districtId: 'dist-1', districtName: 'Lucknow', stateName: 'Uttar Pradesh', landRequired: 450, landAcquired: 380 },
                { districtId: 'dist-2', districtName: 'Barabanki', stateName: 'Uttar Pradesh', landRequired: 380, landAcquired: 290 }
            ],
            cases: cases.length > 0 ? cases : [
                { id: 'case-1', caseNumber: `LA-SEC-${project.projectCode}-01`, landRequired: 450, landAcquired: 380, currentStatus: 'POSSESSION' },
                { id: 'case-2', caseNumber: `LA-SEC-${project.projectCode}-02`, landRequired: 380, landAcquired: 290, currentStatus: 'VALUATION' }
            ],
            parcels,
            gisMap: {
                center: [centerLat, centerLng],
                zoom: 13,
                alignmentPolyline,
                parcels
            },
            documents,
            compensationRecords: compensationRecords.length > 0 ? compensationRecords : [
                { id: 'comp-1', beneficiaryReference: 'BEN-LUC-101', beneficiaryName: 'Shri Ramavatar & Sons (Khasra 101/1)', assessedAmount: 18500000, approvedAmount: 18500000, paidAmount: 18500000, paymentStatus: 'DISBURSED' },
                { id: 'comp-2', beneficiaryReference: 'BEN-LUC-102', beneficiaryName: 'Smt. Gayatri Devi (Khasra 101/2)', assessedAmount: 14200000, approvedAmount: 14200000, paidAmount: 14200000, paymentStatus: 'DISBURSED' }
            ],
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
    res.status(201).json({
        success: true,
        data: newProject,
        message: 'Project created successfully.'
    });
}
