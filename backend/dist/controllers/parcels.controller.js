"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllParcels = getAllParcels;
exports.getParcelById = getParcelById;
const database_1 = require("../config/database");
async function getAllParcels(req, res) {
    const store = (0, database_1.getDatabaseStore)();
    const districtId = req.query.districtId;
    const projectId = req.query.projectId;
    const caseId = req.query.caseId;
    const status = req.query.status;
    const landUse = req.query.landUse;
    const searchQuery = (req.query.search || '').toLowerCase().trim();
    let results = store.parcels;
    if (districtId) {
        results = results.filter(p => p.districtId === districtId);
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
    const parcel = store.parcels.find(p => p.id === id || p.parcelNumber === id);
    if (!parcel) {
        res.status(404).json({
            success: false,
            data: null,
            message: `Parcel ${id} not found.`
        });
        return;
    }
    const district = store.districts.find(d => d.id === parcel.districtId);
    const project = store.projects.find(p => p.id === parcel.projectId);
    const acquisitionCase = store.acquisitionCases.find(c => c.id === parcel.caseId);
    const compensation = store.compensationRecords.filter(c => c.parcelId === parcel.id);
    res.json({
        success: true,
        data: {
            ...parcel,
            district,
            project,
            acquisitionCase,
            compensation
        },
        message: 'Parcel details retrieved.'
    });
}
