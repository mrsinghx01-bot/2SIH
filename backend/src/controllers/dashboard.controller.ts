import { Response } from 'express';
import { getDatabaseStore } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export async function getDashboardSummary(req: AuthRequest, res: Response): Promise<void> {
  const store = getDatabaseStore();
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
  const totalLandProposed = scopedProjectDistricts.reduce((acc, p) => acc + (p.landRequired || 0), 0) || (isCentral ? 842000 : 45000);
  const totalLandAcquired = scopedProjectDistricts.reduce((acc, p) => acc + (p.landAcquired || 0), 0) || (isCentral ? 671000 : 34500);

  const totalCompensationPaid = scopedCompensation.reduce((acc, c) => acc + (c.paidAmount || 0), 0) || (isCentral ? 1265400000000 : 425800000);
  const totalAffectedFamilies = scopedFamilies.length || (isCentral ? 48200 : 1850);
  const totalCases = scopedCases.length;
  const pendingApprovals = scopedApprovals.filter(a => a.status === 'PENDING').length;
  const criticalAlerts = isCentral ? 12 : 3;

  const currentAssignedState = (!isCentral && user?.stateId) ? store.states.find(s => s.id === user.stateId) : null;

  // Format numbers for display
  const summary = {
    userScope: {
      isCentral,
      role: user?.role || 'CENTRAL_ADMIN',
      stateId: user?.stateId || null,
      stateName: currentAssignedState?.name || null,
      stateShortName: currentAssignedState?.shortName || null,
      districtId: user?.districtId || null
    },
    kpis: {
      totalProjects: {
        value: totalProjects,
        displayValue: totalProjects.toLocaleString('en-IN'),
        trend: '+12%',
        trendDirection: 'up',
        comparisonText: 'vs last month',
        subtitle: isCentral ? 'Across 36 States & UTs' : `${currentAssignedState?.name || 'State'} Jurisdiction`
      },
      landProposed: {
        value: totalLandProposed,
        displayValue: isCentral ? '8.42 Lakh Ha' : `${Math.round(totalLandProposed).toLocaleString('en-IN')} Ha`,
        trend: '+8.4%',
        trendDirection: 'up',
        comparisonText: 'vs last month',
        subtitle: isCentral ? 'National Statutory Requisitions' : `${currentAssignedState?.name || 'State'} Requisitions`
      },
      landAcquired: {
        value: totalLandAcquired,
        displayValue: isCentral ? '6.71 Lakh Ha' : `${Math.round(totalLandAcquired).toLocaleString('en-IN')} Ha`,
        trend: '+15.2%',
        trendDirection: 'up',
        comparisonText: 'vs last month',
        subtitle: `${Math.round((totalLandAcquired / (totalLandProposed || 1)) * 100)}% Acquisition Rate`
      },
      compensationPaid: {
        value: totalCompensationPaid,
        displayValue: isCentral ? '₹ 1,26,540 Cr' : `₹ ${(totalCompensationPaid / 10000000).toFixed(1)} Cr`,
        trend: '+18.5%',
        trendDirection: 'up',
        comparisonText: 'vs last month',
        subtitle: 'Direct Benefit Transfer (PFMS)'
      },
      affectedFamilies: {
        value: totalAffectedFamilies,
        displayValue: isCentral ? '4.82 Lakh' : `${totalAffectedFamilies.toLocaleString('en-IN')} Families`,
        trend: '+6.1%',
        trendDirection: 'up',
        comparisonText: 'vs last month',
        subtitle: 'R&R Entitlements Tracked'
      }
    },
    counts: {
      statesCount: scopedStates.length,
      districtsCount: scopedDistricts.length,
      casesCount: totalCases,
      parcelsCount: scopedParcels.length,
      documentsCount: store.documents.length,
      pendingApprovals,
      criticalAlerts
    },
    environment: {
      isDemo: true,
      dataSource: 'DEMO',
      disclaimer: isCentral
        ? 'National Scope: Sourced from all State Governments, Union Territories and Department of Land Resources.'
        : `State Scope (${currentAssignedState?.name || 'State'}): Restricted to assigned state revenue jurisdiction.`,
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
