"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRR = getAllRR;
const database_1 = require("../config/database");
async function getAllRR(req, res) {
    const store = (0, database_1.getDatabaseStore)();
    const user = req.user;
    let districtId = req.query.districtId;
    let stateId = req.query.stateId;
    const projectId = req.query.projectId;
    const status = req.query.status;
    const searchQuery = (req.query.search || '').toLowerCase().trim();
    // Enforce role-based geographic scope
    if (user && user.role !== 'CENTRAL_ADMIN' && user.role !== 'CENTRAL_OFFICER') {
        if (user.districtId)
            districtId = user.districtId;
        if (user.stateId)
            stateId = user.stateId;
    }
    let results = store.affectedFamilies;
    if (districtId) {
        results = results.filter(f => f.districtId === districtId);
    }
    else if (stateId) {
        const matchingDistIds = new Set(store.districts.filter(d => d.stateId === stateId).map(d => d.id));
        const matchingProjIds = new Set(store.projectDistricts.filter(pd => pd.stateId === stateId).map(pd => pd.projectId));
        results = results.filter(f => matchingDistIds.has(f.districtId) || matchingProjIds.has(f.projectId));
    }
    if (projectId) {
        results = results.filter(f => f.projectId === projectId);
    }
    if (status) {
        results = results.filter(f => f.rrStatus === status);
    }
    if (searchQuery) {
        results = results.filter(f => f.headOfFamily.toLowerCase().includes(searchQuery) ||
            f.familyReference.toLowerCase().includes(searchQuery));
    }
    const enriched = results.map(f => {
        const rr = store.rrRecords.find(r => r.affectedFamilyId === f.id);
        const proj = store.projects.find(p => p.id === f.projectId);
        const dist = store.districts.find(d => d.id === f.districtId);
        return {
            ...f,
            rrRecord: rr,
            projectName: proj ? proj.name : 'Unknown',
            districtName: dist ? dist.name : 'Unknown'
        };
    });
    res.json({
        success: true,
        data: enriched,
        total: enriched.length,
        message: 'Rehabilitation & Resettlement records retrieved.'
    });
}
