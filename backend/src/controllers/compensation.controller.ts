import { Response } from 'express';
import { getDatabaseStore } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export async function getAllCompensation(req: AuthRequest, res: Response): Promise<void> {
  const store = getDatabaseStore();
  const user = req.user;
  let districtId = req.query.districtId as string;
  let stateId = req.query.stateId as string;
  const caseId = req.query.caseId as string;
  const status = req.query.status as string;
  const searchQuery = (req.query.search as string || '').toLowerCase().trim();

  // Enforce role-based geographic scope
  if (user && user.role !== 'CENTRAL_ADMIN' && user.role !== 'CENTRAL_OFFICER') {
    if (user.districtId) districtId = user.districtId;
    if (user.stateId) stateId = user.stateId;
  }

  let results = store.compensationRecords;

  if (districtId) {
    const matchingCaseIds = new Set(store.acquisitionCases.filter(c => c.districtId === districtId).map(c => c.id));
    const matchingParcelIds = new Set(store.parcels.filter(p => p.districtId === districtId).map(p => p.id));
    results = results.filter(c => matchingCaseIds.has(c.caseId) || matchingParcelIds.has(c.parcelId));
  } else if (stateId) {
    const matchingDistIds = new Set(store.districts.filter(d => d.stateId === stateId).map(d => d.id));
    const matchingCaseIds = new Set(store.acquisitionCases.filter(c => matchingDistIds.has(c.districtId)).map(c => c.id));
    const matchingParcelIds = new Set(store.parcels.filter(p => matchingDistIds.has(p.districtId)).map(p => p.id));
    results = results.filter(c => matchingCaseIds.has(c.caseId) || matchingParcelIds.has(c.parcelId));
  }

  if (caseId) {
    results = results.filter(c => c.caseId === caseId);
  }

  if (status) {
    results = results.filter(c => c.paymentStatus === status);
  }

  if (searchQuery) {
    results = results.filter(c =>
      c.beneficiaryName.toLowerCase().includes(searchQuery) ||
      c.beneficiaryReference.toLowerCase().includes(searchQuery) ||
      (c.transactionRef && c.transactionRef.toLowerCase().includes(searchQuery))
    );
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
