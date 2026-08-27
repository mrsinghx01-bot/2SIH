"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardSummary = getDashboardSummary;
const database_1 = require("../config/database");
async function getDashboardSummary(req, res) {
    const store = (0, database_1.getDatabaseStore)();
    const totalProjects = store.projects.length;
    const totalLandProposed = store.projects.reduce((acc, p) => acc + (p.totalLandRequired || 0), 0);
    const totalLandAcquired = store.projects.reduce((acc, p) => acc + (p.totalLandAcquired || 0), 0);
    const totalCompensationPaid = store.compensationRecords.reduce((acc, c) => acc + (c.paidAmount || 0), 0);
    const totalCompensationApproved = store.compensationRecords.reduce((acc, c) => acc + (c.approvedAmount || 0), 0);
    const totalAffectedFamilies = store.affectedFamilies.length;
    const totalCases = store.acquisitionCases.length;
    const pendingApprovals = store.approvals.filter(a => a.status === 'PENDING').length;
    const criticalAlerts = 12;
    // Format numbers for display
    const summary = {
        kpis: {
            totalProjects: {
                value: totalProjects,
                displayValue: totalProjects.toLocaleString('en-IN'),
                trend: '+12%',
                trendDirection: 'up',
                comparisonText: 'vs last month',
                subtitle: 'Across 36 States & UTs'
            },
            landProposed: {
                value: totalLandProposed,
                displayValue: `${Math.round(totalLandProposed).toLocaleString('en-IN')} Ha`,
                trend: '+8.4%',
                trendDirection: 'up',
                comparisonText: 'vs last month',
                subtitle: 'Statutory Requisitions'
            },
            landAcquired: {
                value: totalLandAcquired,
                displayValue: `${Math.round(totalLandAcquired).toLocaleString('en-IN')} Ha`,
                trend: '+15.2%',
                trendDirection: 'up',
                comparisonText: 'vs last month',
                subtitle: `${Math.round((totalLandAcquired / (totalLandProposed || 1)) * 100)}% Overall Completion`
            },
            compensationPaid: {
                value: totalCompensationPaid,
                displayValue: `₹ ${(totalCompensationPaid / 10000000).toFixed(1)} Cr`,
                trend: '+18.5%',
                trendDirection: 'up',
                comparisonText: 'vs last month',
                subtitle: 'Direct Benefit Transfer'
            },
            affectedFamilies: {
                value: totalAffectedFamilies,
                displayValue: totalAffectedFamilies.toLocaleString('en-IN'),
                trend: '+6.1%',
                trendDirection: 'up',
                comparisonText: 'vs last month',
                subtitle: 'R&R Entitlements Tracked'
            }
        },
        counts: {
            statesCount: store.states.length,
            districtsCount: store.districts.length,
            casesCount: totalCases,
            parcelsCount: store.parcels.length,
            documentsCount: store.documents.length,
            pendingApprovals,
            criticalAlerts
        },
        environment: {
            isDemo: true,
            dataSource: 'DEMO',
            disclaimer: 'Displaying development seed data. Sourced from State Governments, Union Territories and Department of Land Resources.',
            lastUpdated: new Date().toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        }
    };
    res.json({
        success: true,
        data: summary,
        message: 'Dashboard summary retrieved successfully.'
    });
}
