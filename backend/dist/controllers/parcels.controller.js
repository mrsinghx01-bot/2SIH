"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllParcels = getAllParcels;
exports.getParcelById = getParcelById;
const database_1 = require("../config/database");
async function getAllParcels(req, res) {
    const store = (0, database_1.getDatabaseStore)();
    const user = req.user;
    let districtId = req.query.districtId;
    let stateId = req.query.stateId;
    const projectId = req.query.projectId;
    const caseId = req.query.caseId;
    const status = req.query.status;
    const landUse = req.query.landUse;
    const searchQuery = (req.query.search || '').toLowerCase().trim();
    // Enforce role-based geographic scope
    if (user && user.role !== 'CENTRAL_ADMIN' && user.role !== 'CENTRAL_OFFICER') {
        if (user.districtId)
            districtId = user.districtId;
        if (user.stateId)
            stateId = user.stateId;
    }
    let results = store.parcels;
    if (districtId) {
        results = results.filter(p => p.districtId === districtId);
    }
    else if (stateId) {
        const matchingDistIds = new Set(store.districts.filter(d => d.stateId === stateId).map(d => d.id));
        const matchingProjIds = new Set(store.projectDistricts.filter(pd => pd.stateId === stateId).map(pd => pd.projectId));
        results = results.filter(p => matchingDistIds.has(p.districtId) || matchingProjIds.has(p.projectId));
    }
    if (projectId) {
        results = results.filter(p => p.projectId === projectId);
    }
    if (caseId) {
        results = results.filter(p => p.caseId === caseId);
    }
    if (status) {
        results = results.filter(p => p.acquisitionStatus === status);
    }
    if (landUse) {
        results = results.filter(p => p.landUse === landUse);
    }
    if (searchQuery) {
        results = results.filter(p => p.parcelNumber.toLowerCase().includes(searchQuery) ||
            p.village.toLowerCase().includes(searchQuery) ||
            (p.khasraNumber && p.khasraNumber.toLowerCase().includes(searchQuery)));
    }
    const enriched = results.map(p => {
        const dist = store.districts.find(d => d.id === p.districtId);
        const proj = store.projects.find(prj => prj.id === p.projectId);
        return {
            ...p,
            districtName: dist ? dist.name : 'Unknown',
            projectName: proj ? proj.name : 'Unassigned'
        };
    });
    res.json({
        success: true,
        data: enriched,
        total: enriched.length,
        message: 'Parcels retrieved successfully.'
    });
}
async function getParcelById(req, res) {
    const { id } = req.params;
    const store = (0, database_1.getDatabaseStore)();
    const parcel = store.parcels.find(p => p.id === id);
    if (!parcel) {
        res.status(404).json({ success: false, data: null, message: 'Parcel not found.' });
        return;
    }
    const dist = store.districts.find(d => d.id === parcel.districtId);
    const proj = store.projects.find(p => p.id === parcel.projectId);
    res.json({
        success: true,
        data: {
            ...parcel,
            districtName: dist ? dist.name : 'Unknown',
            projectName: proj ? proj.name : 'Unassigned'
        },
        message: 'Parcel details retrieved.'
    });
}
