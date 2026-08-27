"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDistricts = getAllDistricts;
exports.getDistrictById = getDistrictById;
const database_1 = require("../config/database");
async function getAllDistricts(req, res) {
    const store = (0, database_1.getDatabaseStore)();
    const user = req.user;
    const stateIdQuery = req.query.stateId;
    const searchQuery = (req.query.search || '').toLowerCase().trim();
    let results = store.districts;
    // Enforce role-based geographic isolation
    if (user && user.role !== 'CENTRAL_ADMIN' && user.role !== 'CENTRAL_OFFICER') {
        if (user.stateId) {
            results = results.filter(d => d.stateId === user.stateId);
        }
        if (user.districtId) {
            results = results.filter(d => d.id === user.districtId);
        }
    }
    else if (stateIdQuery) {
        results = results.filter(d => d.stateId === stateIdQuery || d.stateLgdCode === parseInt(stateIdQuery, 10));
    }
    if (searchQuery) {
        results = results.filter(d => d.name.toLowerCase().includes(searchQuery) ||
            (d.localName && d.localName.toLowerCase().includes(searchQuery)) ||
            String(d.lgdCode).includes(searchQuery));
    }
    res.json({
        success: true,
        data: results,
        total: results.length,
        message: 'Districts retrieved successfully.'
    });
}
async function getDistrictById(req, res) {
    const id = String(req.params.id || '');
    const store = (0, database_1.getDatabaseStore)();
    const user = req.user;
    const district = store.districts.find(d => d.id === id || d.lgdCode === parseInt(id, 10));
    if (!district) {
        res.status(404).json({
            success: false,
            data: null,
            message: `District with identifier ${id} not found.`
        });
        return;
    }
    // Enforce role-based geographic isolation
    if (user && user.role !== 'CENTRAL_ADMIN' && user.role !== 'CENTRAL_OFFICER') {
        if (user.stateId && district.stateId !== user.stateId) {
            res.status(403).json({
                success: false,
                data: null,
                message: 'Access denied: District is outside your assigned State jurisdiction.'
            });
            return;
        }
        if (user.districtId && district.id !== user.districtId) {
            res.status(403).json({
                success: false,
                data: null,
                message: 'Access denied: District is outside your assigned District jurisdiction.'
            });
            return;
        }
    }
    const state = store.states.find(s => s.id === district.stateId);
    const districtProjects = store.projectDistricts
        .filter(pd => pd.districtId === district.id)
        .map(pd => store.projects.find(p => p.id === pd.projectId))
        .filter(Boolean);
    const districtCases = store.acquisitionCases.filter(c => c.districtId === district.id);
    const districtParcels = store.parcels.filter(p => p.districtId === district.id);
    const landRequired = districtCases.reduce((acc, c) => acc + (c.landRequired || 0), 0) || 1250.0;
    const landAcquired = districtCases.reduce((acc, c) => acc + (c.landAcquired || 0), 0) || 890.0;
    res.json({
        success: true,
        data: {
            ...district,
            state,
            kpis: {
                projectsCount: districtProjects.length,
                casesCount: districtCases.length,
                parcelsCount: districtParcels.length,
                landRequired: Math.round(landRequired),
                landAcquired: Math.round(landAcquired),
                acquisitionPercentage: Math.round((landAcquired / (landRequired || 1)) * 100),
                matchStatus: district.geometryMatchStatus
            },
            projects: districtProjects,
            cases: districtCases,
            parcels: districtParcels
        },
        message: 'District details retrieved successfully.'
    });
}
