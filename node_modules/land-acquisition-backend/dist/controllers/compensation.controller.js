"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCompensation = getAllCompensation;
const database_1 = require("../config/database");
async function getAllCompensation(req, res) {
    const store = (0, database_1.getDatabaseStore)();
    const caseId = req.query.caseId;
    const status = req.query.status;
    const searchQuery = (req.query.search || '').toLowerCase().trim();
    let results = store.compensationRecords;
    if (caseId) {
        results = results.filter(c => c.caseId === caseId);
    }
    if (status) {
        results = results.filter(c => c.paymentStatus === status);
    }
    if (searchQuery) {
        results = results.filter(c => c.beneficiaryName.toLowerCase().includes(searchQuery) ||
            c.beneficiaryReference.toLowerCase().includes(searchQuery) ||
            (c.transactionRef && c.transactionRef.toLowerCase().includes(searchQuery)));
    }
    const enriched = results.map(c => {
        const acCase = store.acquisitionCases.find(ac => ac.id === c.caseId);
        const proj = acCase ? store.projects.find(p => p.id === acCase.projectId) : null;
        const dist = acCase ? store.districts.find(d => d.id === acCase.districtId) : null;
        return {
            ...c,
            caseNumber: acCase ? acCase.caseNumber : 'Unknown',
            projectName: proj ? proj.name : 'Unknown',
            districtName: dist ? dist.name : 'Unknown'
        };
    });
    const totalAssessed = results.reduce((acc, c) => acc + (c.assessedAmount || 0), 0);
    const totalApproved = results.reduce((acc, c) => acc + (c.approvedAmount || 0), 0);
    const totalPaid = results.reduce((acc, c) => acc + (c.paidAmount || 0), 0);
    res.json({
        success: true,
        data: enriched,
        summary: {
            totalRecords: results.length,
            totalAssessed,
            totalApproved,
            totalPaid,
            totalPending: totalApproved - totalPaid
        },
        message: 'Compensation records retrieved.'
    });
}
