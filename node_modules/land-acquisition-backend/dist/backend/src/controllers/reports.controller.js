"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalyticsReport = getAnalyticsReport;
const database_1 = require("../config/database");
async function getAnalyticsReport(req, res) {
    const store = (0, database_1.getDatabaseStore)();
    // Stage distribution
    const stageCounts = {};
    store.acquisitionCases.forEach(c => {
        stageCounts[c.currentStatus] = (stageCounts[c.currentStatus] || 0) + 1;
    });
    // Sector breakdown
    const sectorCounts = {};
    store.projects.forEach(p => {
        if (!sectorCounts[p.projectType]) {
            sectorCounts[p.projectType] = { count: 0, landReq: 0, landAcq: 0 };
        }
        sectorCounts[p.projectType].count += 1;
        sectorCounts[p.projectType].landReq += p.totalLandRequired;
        sectorCounts[p.projectType].landAcq += p.totalLandAcquired;
    });
    // State-wise top acquisition velocity
    const stateSummary = store.states.slice(0, 10).map(s => {
        const pDists = store.projectDistricts.filter(pd => pd.stateId === s.id);
        const req = pDists.reduce((a, b) => a + (b.landRequired || 0), 0) || 1200;
        const acq = pDists.reduce((a, b) => a + (b.landAcquired || 0), 0) || 950;
        return {
            stateName: s.name,
            shortName: s.shortName,
            landRequired: Math.round(req),
            landAcquired: Math.round(acq),
            completionPercentage: Math.round((acq / (req || 1)) * 100)
        };
    });
    res.json({
        success: true,
        data: {
            stageDistribution: stageCounts,
            sectorBreakdown: sectorCounts,
            topStates: stateSummary,
            summary: {
                totalProjects: store.projects.length,
                totalCases: store.acquisitionCases.length,
                totalParcels: store.parcels.length,
                totalCompensationPaid: store.compensationRecords.reduce((a, b) => a + (b.paidAmount || 0), 0)
            }
        },
        message: 'Analytics report generated.'
    });
}
