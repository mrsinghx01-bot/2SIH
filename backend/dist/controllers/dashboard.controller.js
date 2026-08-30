"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardSummary = getDashboardSummary;
const database_1 = require("../config/database");
const govDataService_1 = require("../services/govDataService");
async function getDashboardSummary(req, res) {
    const store = (0, database_1.getDatabaseStore)();
    const user = req.user;
    const isCentral = !user || user.role === 'CENTRAL_ADMIN' || user.role === 'CENTRAL_OFFICER';
    // Determine scoped entities
    let scopedStates = store.states;
    let scopedDistricts = store.districts;
    let scopedProjectDistricts = store.projectDistricts;
    let scopedCases = store.acquisitionCases;
    let scopedCompensation = store.compensationRecords;
    let scopedFamilies = store.affectedFamilies;
    let scopedParcels = store.parcels;
    let scopedApprovals = store.approvals;
    if (!isCentral && user?.stateId) {
        scopedStates = store.states.filter(s => s.id === user.stateId);
        scopedDistricts = store.districts.filter(d => d.stateId === user.stateId);
        scopedProjectDistricts = store.projectDistricts.filter(pd => pd.stateId === user.stateId);
        const projectIds = new Set(scopedProjectDistricts.map(pd => pd.projectId));
        scopedCases = store.acquisitionCases.filter(c => c.stateId === user.stateId || projectIds.has(c.projectId));
        const caseIds = new Set(scopedCases.map(c => c.id));
        scopedCompensation = store.compensationRecords.filter(cr => caseIds.has(cr.caseId));
        scopedFamilies = store.affectedFamilies.filter(f => caseIds.has(f.caseId) || projectIds.has(f.projectId));
        scopedParcels = store.parcels.filter(p => projectIds.has(p.projectId) || caseIds.has(p.caseId));
        scopedApprovals = store.approvals.filter(a => projectIds.has(a.entityId) || caseIds.has(a.entityId));
    }
    const projectIds = new Set(scopedProjectDistricts.map(pd => pd.projectId));
    const scopedProjects = isCentral ? store.projects : store.projects.filter(p => projectIds.has(p.id));
    const totalProjects = scopedProjects.length;
    // Compute KPIs from ACTUAL database records — no hardcoded fallbacks
    const totalLandProposed = scopedProjects.reduce((acc, p) => acc + (p.totalLandRequired || 0), 0);
    const totalLandAcquired = scopedProjects.reduce((acc, p) => acc + (p.totalLandAcquired || 0), 0);
    const totalCompensationPaid = scopedCompensation.reduce((acc, c) => acc + (c.paidAmount || 0), 0);
    const totalAffectedFamilies = scopedFamilies.length;
    const totalCases = scopedCases.length;
    const pendingApprovals = scopedApprovals.filter(a => a.status === 'PENDING').length;
    // Format large numbers for display
    const formatLandDisplay = (ha) => {
        if (ha >= 100000)
            return `${(ha / 100000).toFixed(2)} Lakh Ha`;
        if (ha >= 1000)
            return `${(ha / 1000).toFixed(1)}K Ha`;
        return `${Math.round(ha).toLocaleString('en-IN')} Ha`;
    };
    const formatCompensationDisplay = (amount) => {
        if (amount >= 10000000000)
            return `₹ ${(amount / 10000000).toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr`;
        if (amount >= 10000000)
            return `₹ ${(amount / 10000000).toFixed(1)} Cr`;
        if (amount >= 100000)
            return `₹ ${(amount / 100000).toFixed(1)} Lakh`;
        return `₹ ${amount.toLocaleString('en-IN')}`;
    };
    const formatFamilyDisplay = (count) => {
        if (count >= 100000)
            return `${(count / 100000).toFixed(2)} Lakh`;
        if (count >= 1000)
            return `${(count / 1000).toFixed(1)}K`;
        return count.toLocaleString('en-IN');
    };
    const acquisitionRate = totalLandProposed > 0 ? Math.round((totalLandAcquired / totalLandProposed) * 100) : 0;
    const currentAssignedState = (!isCentral && user?.stateId) ? store.states.find(s => s.id === user.stateId) : null;
    const realStateInfo = user?.stateId ? (0, govDataService_1.getStateData)(user.stateId) : null;
    // Real National Data from govDataService
    const realNationalKPIs = (0, govDataService_1.getNationalKPIs)();
    const dilrmpAgg = (0, govDataService_1.computeNationalDilrmpAggregate)();
    const worldBankData = isCentral ? await (0, govDataService_1.fetchWorldBankIndiaData)() : null;
    const summary = {
        userScope: {
            isCentral,
            role: user?.role || 'CENTRAL_ADMIN',
            stateId: user?.stateId || null,
            stateName: currentAssignedState?.name || null,
            stateShortName: currentAssignedState?.shortName || null,
            districtId: user?.districtId || null,
            realGovStateMeta: realStateInfo || null
        },
        kpis: {
            totalProjects: {
                value: totalProjects,
                displayValue: totalProjects.toLocaleString('en-IN'),
                comparisonText: 'from seeded project records',
                subtitle: isCentral ? `Across ${scopedStates.length} States & UTs` : `${currentAssignedState?.name || 'State'} Jurisdiction`
            },
            landProposed: {
                value: totalLandProposed,
                displayValue: formatLandDisplay(totalLandProposed),
                comparisonText: 'total statutory requisitions',
                subtitle: isCentral ? 'National Statutory Requisitions' : `${currentAssignedState?.name || 'State'} Requisitions`
            },
            landAcquired: {
                value: totalLandAcquired,
                displayValue: formatLandDisplay(totalLandAcquired),
                comparisonText: `${acquisitionRate}% acquisition rate`,
                subtitle: `${acquisitionRate}% Acquisition Rate`
            },
            compensationPaid: {
                value: totalCompensationPaid,
                displayValue: formatCompensationDisplay(totalCompensationPaid),
                comparisonText: 'total disbursed via PFMS',
                subtitle: 'Direct Benefit Transfer (PFMS)'
            },
            affectedFamilies: {
                value: totalAffectedFamilies,
                displayValue: formatFamilyDisplay(totalAffectedFamilies),
                comparisonText: 'families identified for R&R',
                subtitle: 'R&R Entitlements Tracked'
            }
        },
        dilrmpGovProgress: {
            rorComputerizedPct: realStateInfo ? realStateInfo.dilrmp.rorComputerizedPct : dilrmpAgg.avgRorComputerizedPct,
            cadastralMapDigitizedPct: realStateInfo ? realStateInfo.dilrmp.cadastralMapDigitizedPct : dilrmpAgg.avgCadastralMapDigitizedPct,
            ulpinStatus: realStateInfo ? (realStateInfo.dilrmp.ulpinImplemented ? 'Active (Bhu-Aadhaar Assigned)' : 'In Progress') : `${dilrmpAgg.ulpinImplementedCount} / 36 States & UTs Active`,
            sroComputerizedPct: realStateInfo ? realStateInfo.dilrmp.sroComputerizedPct : dilrmpAgg.avgSroComputerizedPct
        },
        nationalGovMasterData: isCentral ? {
            censusPopulation2011: realNationalKPIs.totalPopulationCensus2011.toLocaleString('en-IN'),
            totalDistrictsMHA: realNationalKPIs.totalDistricts,
            totalVillagesDoLR: realNationalKPIs.totalVillages.toLocaleString('en-IN'),
            totalAreaKm2: realNationalKPIs.totalAreaKm2.toLocaleString('en-IN'),
            worldBankIndiaPopulation: worldBankData?.population ? Math.round(worldBankData.population / 100000000) / 10 + ' Billion' : '1.43 Billion',
            worldBankIndiaGDP: worldBankData?.gdpCurrentUsd ? '$' + (worldBankData.gdpCurrentUsd / 1000000000000).toFixed(2) + ' Trillion' : '$3.75 Trillion',
        } : null,
        counts: {
            statesCount: scopedStates.length,
            districtsCount: scopedDistricts.length,
            casesCount: totalCases,
            parcelsCount: scopedParcels.length,
            documentsCount: store.documents.length,
            pendingApprovals,
            criticalAlerts: pendingApprovals > 0 ? pendingApprovals : 0
        },
        environment: {
            isDemo: false,
            dataSource: 'OPEN_GOV_DATA_INDIA',
            disclaimer: isCentral
                ? 'Data Sources: Project details from NHAI, MoRTH, NHSRCL, NWDA public records. Geographic data from LGD (lgdirectory.gov.in). DILRMP metrics from DoLR, MoRD. Population from Census of India 2011.'
                : `State Scope (${currentAssignedState?.name || 'State'}): Integrated with official state land records & DILRMP metrics.`,
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
        message: 'Dashboard summary computed from database records.'
    });
}
