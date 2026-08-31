import { Request, Response } from 'express';
import { getDatabaseStore, saveDatabaseStore } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export async function getAllCases(req: AuthRequest, res: Response): Promise<void> {
  const store = getDatabaseStore();
  const user = req.user;
  const projectId = req.query.projectId as string;
  let stateId = req.query.stateId as string;
  let districtId = req.query.districtId as string;
  const status = req.query.status as string;
  const searchQuery = (req.query.search as string || '').toLowerCase().trim();

  // Enforce role-based geographic scope
  if (user && user.role !== 'CENTRAL_ADMIN' && user.role !== 'CENTRAL_OFFICER') {
    if (user.stateId) stateId = user.stateId;
    if (user.districtId) districtId = user.districtId;
  }

  let results = store.acquisitionCases;

  if (projectId) {
    results = results.filter(c => c.projectId === projectId);
  }

  if (stateId) {
    results = results.filter(c => c.stateId === stateId);
  }

  if (districtId) {
    results = results.filter(c => c.districtId === districtId);
  }

  if (status) {
    results = results.filter(c => c.currentStatus === status);
  }

  if (searchQuery) {
    results = results.filter(c =>
      c.caseNumber.toLowerCase().includes(searchQuery)
    );
  }

  const enriched = results.map(c => {
    const project = store.projects.find(p => p.id === c.projectId);
    const state = store.states.find(s => s.id === c.stateId);
    const district = store.districts.find(d => d.id === c.districtId);

    return {
      ...c,
      projectName: project ? project.name : 'Unknown Project',
      projectCode: project ? project.projectCode : '',
      stateName: state ? state.name : '',
      districtName: district ? district.name : ''
    };
  });

  res.json({
    success: true,
    data: enriched,
    total: enriched.length,
    message: 'Acquisition cases retrieved successfully.'
  });
}

export async function getCaseById(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const store = getDatabaseStore();
  const user = req.user;

  const acquisitionCase = store.acquisitionCases.find(c => c.id === id || c.caseNumber === id);

  if (!acquisitionCase) {
    res.status(404).json({
      success: false,
      data: null,
      message: `Acquisition case with identifier ${id} not found.`
    });
    return;
  }

  // Enforce role-based geographic scope
  if (user && user.role !== 'CENTRAL_ADMIN' && user.role !== 'CENTRAL_OFFICER') {
    if (user.stateId && acquisitionCase.stateId !== user.stateId) {
      res.status(403).json({
        success: false,
        data: null,
        message: 'Access denied: Case is outside your assigned State jurisdiction.'
      });
      return;
    }
  }

  const project = store.projects.find(p => p.id === acquisitionCase.projectId);
  const state = store.states.find(s => s.id === acquisitionCase.stateId);
  const district = store.districts.find(d => d.id === acquisitionCase.districtId);
  const history = store.caseStatusHistory.filter(h => h.caseId === acquisitionCase.id);
  const parcels = store.parcels.filter(p => p.caseId === acquisitionCase.id);
  const compensation = store.compensationRecords.filter(c => c.caseId === acquisitionCase.id);
  const families = store.affectedFamilies.filter(f => f.caseId === acquisitionCase.id);
  const documents = store.documents.filter(d => d.caseId === acquisitionCase.id);

  res.json({
    success: true,
    data: {
      ...acquisitionCase,
      project,
      state,
      district,
      history,
      parcels,
      compensation,
      affectedFamilies: families,
      documents
    },
    message: 'Acquisition case retrieved successfully.'
  });
}

export async function updateCaseStage(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const { newStage, remarks } = req.body;
  const store = getDatabaseStore();

  const acquisitionCase = store.acquisitionCases.find(c => c.id === id || c.caseNumber === id);

  if (!acquisitionCase) {
    res.status(404).json({
      success: false,
      data: null,
      message: `Acquisition case with identifier ${id} not found.`
    });
    return;
  }

  const oldStage = acquisitionCase.currentStatus;
  acquisitionCase.currentStatus = newStage;
  acquisitionCase.updatedAt = new Date();

  // Record in case status history
  const historyEntry = {
    id: `csh-${acquisitionCase.id}-${Date.now()}`,
    caseId: acquisitionCase.id,
    oldStatus: oldStage,
    newStatus: newStage,
    changedBy: req.user?.id || 'user-lao-01',
    remarks: remarks || `Status transition from ${oldStage} to ${newStage}`,
    changedAt: new Date()
  };
  store.caseStatusHistory.push(historyEntry);

  // Record audit log
  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    userId: req.user?.id || 'user-lao-01',
    userEmail: req.user?.email || 'officer@gov.in',
    action: 'STAGE_TRANSITION',
    entityType: 'ACQUISITION_CASE',
    entityId: acquisitionCase.id,
    oldValue: oldStage,
    newValue: newStage,
    ipAddress: req.ip || '127.0.0.1',
    createdAt: new Date()
  });

  saveDatabaseStore();

  res.json({
    success: true,
    data: acquisitionCase,
    message: `Case status updated from ${oldStage} to ${newStage}.`
  });
}
