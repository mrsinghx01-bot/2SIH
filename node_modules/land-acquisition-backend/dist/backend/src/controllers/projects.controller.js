"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProjects = getAllProjects;
exports.getProjectById = getProjectById;
exports.createProject = createProject;
const database_1 = require("../config/database");
async function getAllProjects(req, res) {
    const store = (0, database_1.getDatabaseStore)();
    const stateId = req.query.stateId;
    const districtId = req.query.districtId;
    const projectType = req.query.projectType;
    const status = req.query.status;
    const searchQuery = (req.query.search || '').toLowerCase().trim();
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
    const districtDetails = pDists.map(pd => {
        const dist = store.districts.find(d => d.id === pd.districtId);
        const st = store.states.find(s => s.id === pd.stateId);
        return {
            districtId: pd.districtId,
            districtName: dist ? dist.name : 'Unknown District',
            stateName: st ? st.name : 'Unknown State',
            landRequired: pd.landRequired,
            landAcquired: pd.landAcquired
        };
    });
    // 2. Acquisition Cases
    const cases = store.acquisitionCases.filter(c => c.projectId === project.id);
    // 3. Parcels / GIS
    const parcels = store.parcels.filter(p => p.projectId === project.id);
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
    // 8. Timeline (Chronological aggregate)
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
            districtBreakdown: districtDetails,
            cases,
            parcels,
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
    res.status(201).json({
        success: true,
        data: newProject,
        message: 'Project created successfully.'
    });
}
