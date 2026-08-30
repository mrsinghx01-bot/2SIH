import { Request, Response } from 'express';
import { getDatabaseStore } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import path from 'path';
import fs from 'fs';

// Ensure upload directory exists
const UPLOAD_DIR = path.join(process.cwd(), 'storage', 'surveys');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// GET /api/field-surveys — returns surveys filtered by user scope
export async function getFieldSurveys(req: AuthRequest, res: Response): Promise<void> {
  const store = getDatabaseStore();
  const { user } = req;
  const { status, stateId, districtId, projectId } = req.query;

  let surveys: any[] = store.fieldSurveys || [];

  // Scope filtering based on role
  if (user?.role === 'FIELD_OFFICER' && user.stateId) {
    surveys = surveys.filter((s: any) => s.stateId === user.stateId);
    if (user.districtId) {
      surveys = surveys.filter((s: any) => s.districtId === user.districtId);
    }
  } else if (user?.role === 'DISTRICT_ADMIN' || user?.role === 'LAND_ACQUISITION_OFFICER') {
    if (user.districtId) {
      surveys = surveys.filter((s: any) => s.districtId === user.districtId);
    } else if (user.stateId) {
      surveys = surveys.filter((s: any) => s.stateId === user.stateId);
    }
  } else if (user?.role === 'STATE_ADMIN' && user.stateId) {
    surveys = surveys.filter((s: any) => s.stateId === user.stateId);
  }

  if (status) surveys = surveys.filter((s: any) => s.status === status);
  if (stateId) surveys = surveys.filter((s: any) => s.stateId === stateId);
  if (districtId) surveys = surveys.filter((s: any) => s.districtId === districtId);
  if (projectId) surveys = surveys.filter((s: any) => s.projectId === projectId);

  surveys = [...surveys].sort((a: any, b: any) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  res.json({
    success: true,
    data: surveys,
    message: `${surveys.length} field survey(s) found.`
  });
}

// POST /api/field-surveys — submit a new field survey
export async function submitFieldSurvey(req: AuthRequest, res: Response): Promise<void> {
  const store = getDatabaseStore();
  const { user } = req;

  if (!user) {
    res.status(401).json({ success: false, data: null, message: 'Authentication required.' });
    return;
  }

  if (user.role !== 'FIELD_OFFICER') {
    res.status(403).json({ success: false, data: null, message: 'Only Field Officers can submit field surveys.' });
    return;
  }

  const {
    projectId, stateId, districtId, khasraNo, villageNameMouza,
    areaSurveyed, landCategory, soilClassification, encumbranceStatus,
    structuresPresent, treesCount, gpsLatitude, gpsLongitude, gpsAccuracy,
    landUseActual, ownerName, remarks, photoBase64, photoFilename, surveyDate
  } = req.body;

  if (!projectId || !khasraNo || !areaSurveyed || !gpsLatitude || !gpsLongitude) {
    res.status(400).json({
      success: false, data: null,
      message: 'Required fields: projectId, khasraNo, areaSurveyed, gpsLatitude, gpsLongitude.'
    });
    return;
  }

  const resolvedStateId = stateId || user.stateId;
  const resolvedDistrictId = districtId || user.districtId;

  const state = store.states.find(s => s.id === resolvedStateId);
  const district = store.districts.find(d => d.id === resolvedDistrictId);
  const project = store.projects.find(p => p.id === projectId);

  if (!project) {
    res.status(404).json({ success: false, data: null, message: `Project ${projectId} not found.` });
    return;
  }

  let photoUrl: string | null = null;
  if (photoBase64 && photoFilename) {
    try {
      const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, '');
      const safeFilename = `survey_${Date.now()}_${photoFilename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const filePath = path.join(UPLOAD_DIR, safeFilename);
      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
      photoUrl = `/storage/surveys/${safeFilename}`;
    } catch (err) {
      console.error('Photo save error:', err);
    }
  }

  const surveyId = `FS-${state?.shortName || 'XX'}-${Date.now()}`;

  const newSurvey: any = {
    id: surveyId,
    projectId,
    projectName: project.name,
    stateId: resolvedStateId,
    stateName: state?.name || 'Unknown',
    districtId: resolvedDistrictId,
    districtName: district?.name || 'Unknown',
    khasraNo,
    villageNameMouza: villageNameMouza || '',
    areaSurveyed: parseFloat(areaSurveyed),
    landCategory: landCategory || 'Unclassified',
    soilClassification: soilClassification || '',
    encumbranceStatus: encumbranceStatus || 'No Encumbrance',
    structuresPresent: !!structuresPresent,
    treesCount: parseInt(treesCount, 10) || 0,
    gpsLatitude: parseFloat(gpsLatitude),
    gpsLongitude: parseFloat(gpsLongitude),
    gpsAccuracy: gpsAccuracy || '±3m',
    landUseActual: landUseActual || '',
    ownerName: ownerName || '',
    remarks: remarks || '',
    photoUrl,
    surveyDate: surveyDate || new Date().toISOString().split('T')[0],
    submittedById: user.id,
    submittedByName: user.name,
    submittedByEmployeeId: user.employeeId,
    status: 'PENDING_REVIEW',
    reviewedById: null,
    reviewedByName: null,
    reviewedAt: null,
    reviewRemarks: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  store.fieldSurveys.push(newSurvey);

  store.auditLogs.unshift({
    id: `audit-fs-${Date.now()}`,
    userId: user.id, userEmail: user.email,
    action: 'FIELD_SURVEY_SUBMITTED',
    entityType: 'FIELD_SURVEY', entityId: surveyId,
    oldValue: null,
    newValue: `Khasra: ${khasraNo}, Area: ${areaSurveyed} Ha, Project: ${project.name}`,
    ipAddress: req.ip || '127.0.0.1',
    createdAt: new Date()
  });

  res.status(201).json({
    success: true,
    data: newSurvey,
    message: `Survey ${surveyId} submitted. Pending Collector/LAO review.`
  });
}

// PATCH /api/field-surveys/:id/review — LAO/Collector approves or rejects
export async function reviewFieldSurvey(req: AuthRequest, res: Response): Promise<void> {
  const store = getDatabaseStore();
  const { user } = req;
  const { id } = req.params;
  const { action, reviewRemarks } = req.body;

  if (!user) {
    res.status(401).json({ success: false, data: null, message: 'Authentication required.' });
    return;
  }

  const allowedReviewers = ['LAND_ACQUISITION_OFFICER', 'DISTRICT_ADMIN', 'STATE_ADMIN', 'CENTRAL_ADMIN'];
  if (!allowedReviewers.includes(user.role)) {
    res.status(403).json({ success: false, data: null, message: 'You do not have permission to review field surveys.' });
    return;
  }

  const surveyIndex = store.fieldSurveys.findIndex((s: any) => s.id === id);
  if (surveyIndex === -1) {
    res.status(404).json({ success: false, data: null, message: `Field survey ${id} not found.` });
    return;
  }

  const survey = store.fieldSurveys[surveyIndex];

  if ((user.role === 'LAND_ACQUISITION_OFFICER' || user.role === 'DISTRICT_ADMIN') && user.districtId) {
    if (survey.districtId && survey.districtId !== user.districtId) {
      res.status(403).json({
        success: false, data: null,
        message: 'You can only review surveys from your assigned district.'
      });
      return;
    }
  }

  if (!['APPROVE', 'REJECT', 'RETURN_FOR_REVISION'].includes(action)) {
    res.status(400).json({ success: false, data: null, message: 'Invalid action.' });
    return;
  }

  const statusMap: Record<string, string> = {
    APPROVE: 'APPROVED',
    REJECT: 'REJECTED',
    RETURN_FOR_REVISION: 'RETURNED'
  };

  store.fieldSurveys[surveyIndex] = {
    ...survey,
    status: statusMap[action],
    reviewedById: user.id,
    reviewedByName: user.name,
    reviewedAt: new Date(),
    reviewRemarks: reviewRemarks || '',
    updatedAt: new Date()
  };

  store.auditLogs.unshift({
    id: `audit-fsr-${Date.now()}`,
    userId: user.id, userEmail: user.email,
    action: `FIELD_SURVEY_${action}`,
    entityType: 'FIELD_SURVEY', entityId: id,
    oldValue: 'PENDING_REVIEW',
    newValue: `${statusMap[action]} by ${user.name}`,
    ipAddress: req.ip || '127.0.0.1',
    createdAt: new Date()
  });

  res.json({
    success: true,
    data: store.fieldSurveys[surveyIndex],
    message: `Survey ${id} ${statusMap[action].toLowerCase()} by ${user.name}.`
  });
}

// Public: GET /api/districts/public-by-state/:stateId — used on login page
export async function getPublicDistrictsByState(req: Request, res: Response): Promise<void> {
  const store = getDatabaseStore();
  const { stateId } = req.params;
  let districts = store.districts.filter(d => d.stateId === stateId);
  if (districts.length === 0) {
    // Try numeric lgdCode match
    const numCode = parseInt(stateId.replace('state-', ''), 10);
    if (!isNaN(numCode)) {
      districts = store.districts.filter(d => d.stateLgdCode === numCode);
    }
  }
  const sorted = [...districts].sort((a, b) => a.name.localeCompare(b.name));
  res.json({ success: true, data: sorted, message: `${sorted.length} districts.` });
}
