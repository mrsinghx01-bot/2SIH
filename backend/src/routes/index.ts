import { Router } from 'express';
import { login, getCurrentUser, getDemoRoles } from '../controllers/auth.controller';
import { getDashboardSummary } from '../controllers/dashboard.controller';
import { getAllStates, getStateById, getPublicStatesMaster } from '../controllers/states.controller';
import { getAllDistricts, getDistrictById } from '../controllers/districts.controller';
import { getAllProjects, getProjectById, createProject } from '../controllers/projects.controller';
import { getAllCases, getCaseById, updateCaseStage } from '../controllers/cases.controller';
import { getAllParcels, getParcelById } from '../controllers/parcels.controller';
import { getAllCompensation } from '../controllers/compensation.controller';
import { getAllRR } from '../controllers/rr.controller';
import { getAllDocuments, uploadDocument, streamDocumentPdf } from '../controllers/documents.controller';
import { getAllApprovals, processApproval } from '../controllers/approvals.controller';
import { getAllNotifications, markNotificationAsRead } from '../controllers/notifications.controller';
import { getAllAuditLogs } from '../controllers/audit.controller';
import { getAnalyticsReport } from '../controllers/reports.controller';
import { authenticateToken, authorizeRoles, checkGeographicScope } from '../middleware/auth';
import { getFieldSurveys, submitFieldSurvey, reviewFieldSurvey, getPublicDistrictsByState } from '../controllers/field-surveys.controller';

const router = Router();

// Auth & Public routes (no token required)
router.post('/auth/login', login);
router.get('/auth/me', authenticateToken, getCurrentUser);
router.get('/auth/demo-roles', getDemoRoles);
router.get('/states/public-master', getPublicStatesMaster); // Public master directory of all 36 States & UTs for login
router.get('/districts/public-by-state/:stateId', getPublicDistrictsByState); // Public districts for login page (LAO selector)

// All data routes below use authenticateToken so we can enforce geographic scope
// Dashboard routes
router.get('/dashboard/summary', authenticateToken, getDashboardSummary);

// States routes — getAllStates now filters by user scope in the controller
router.get('/states', authenticateToken, getAllStates);
router.get('/states/:id', authenticateToken, checkGeographicScope, getStateById);

// Districts routes
router.get('/districts', authenticateToken, getAllDistricts);
router.get('/districts/:id', authenticateToken, checkGeographicScope, getDistrictById);

// Projects routes
router.get('/projects', authenticateToken, getAllProjects);
router.get('/projects/:id', authenticateToken, getProjectById);
router.post('/projects', authenticateToken, createProject);

// Acquisition Cases routes
router.get('/acquisition-cases', authenticateToken, getAllCases);
router.get('/acquisition-cases/:id', authenticateToken, getCaseById);
router.patch('/acquisition-cases/:id/stage', authenticateToken, updateCaseStage);

// Parcels routes
router.get('/parcels', authenticateToken, getAllParcels);
router.get('/parcels/:id', authenticateToken, getParcelById);

// Compensation routes
router.get('/compensation', authenticateToken, getAllCompensation);

// R&R routes
router.get('/rr', authenticateToken, getAllRR);

// Documents routes
router.get('/documents', authenticateToken, getAllDocuments);
router.get('/documents/:id/pdf', streamDocumentPdf);
router.get('/documents/:id/download', streamDocumentPdf);
router.post('/documents', authenticateToken, uploadDocument);

// Approvals routes
router.get('/approvals', authenticateToken, getAllApprovals);
router.post('/approvals/:id/process', authenticateToken, processApproval);

// Notifications routes
router.get('/notifications', authenticateToken, getAllNotifications);
router.patch('/notifications/:id/read', authenticateToken, markNotificationAsRead);

// Audit routes
router.get('/audit-logs', authenticateToken, getAllAuditLogs);

// Reports routes
router.get('/reports/analytics', authenticateToken, getAnalyticsReport);

// Field Survey routes
router.get('/field-surveys', authenticateToken, getFieldSurveys);
router.post('/field-surveys', authenticateToken, submitFieldSurvey);
router.patch('/field-surveys/:id/review', authenticateToken, reviewFieldSurvey);

export default router;
