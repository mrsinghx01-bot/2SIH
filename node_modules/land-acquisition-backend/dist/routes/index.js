"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const states_controller_1 = require("../controllers/states.controller");
const districts_controller_1 = require("../controllers/districts.controller");
const projects_controller_1 = require("../controllers/projects.controller");
const cases_controller_1 = require("../controllers/cases.controller");
const parcels_controller_1 = require("../controllers/parcels.controller");
const compensation_controller_1 = require("../controllers/compensation.controller");
const rr_controller_1 = require("../controllers/rr.controller");
const documents_controller_1 = require("../controllers/documents.controller");
const approvals_controller_1 = require("../controllers/approvals.controller");
const notifications_controller_1 = require("../controllers/notifications.controller");
const audit_controller_1 = require("../controllers/audit.controller");
const reports_controller_1 = require("../controllers/reports.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Auth routes
router.post('/auth/login', auth_controller_1.login);
router.get('/auth/me', auth_1.authenticateToken, auth_controller_1.getCurrentUser);
router.get('/auth/demo-roles', auth_controller_1.getDemoRoles);
// Dashboard routes
router.get('/dashboard/summary', dashboard_controller_1.getDashboardSummary);
// States routes
router.get('/states', states_controller_1.getAllStates);
router.get('/states/:id', auth_1.checkGeographicScope, states_controller_1.getStateById);
// Districts routes
router.get('/districts', districts_controller_1.getAllDistricts);
router.get('/districts/:id', auth_1.checkGeographicScope, districts_controller_1.getDistrictById);
// Projects routes
router.get('/projects', projects_controller_1.getAllProjects);
router.get('/projects/:id', projects_controller_1.getProjectById);
router.post('/projects', auth_1.authenticateToken, projects_controller_1.createProject);
// Acquisition Cases routes
router.get('/acquisition-cases', cases_controller_1.getAllCases);
router.get('/acquisition-cases/:id', cases_controller_1.getCaseById);
router.patch('/acquisition-cases/:id/stage', auth_1.authenticateToken, cases_controller_1.updateCaseStage);
// Parcels routes
router.get('/parcels', parcels_controller_1.getAllParcels);
router.get('/parcels/:id', parcels_controller_1.getParcelById);
// Compensation routes
router.get('/compensation', compensation_controller_1.getAllCompensation);
// R&R routes
router.get('/rr', rr_controller_1.getAllRR);
// Documents routes
router.get('/documents', documents_controller_1.getAllDocuments);
router.post('/documents', auth_1.authenticateToken, documents_controller_1.uploadDocument);
// Approvals routes
router.get('/approvals', approvals_controller_1.getAllApprovals);
router.post('/approvals/:id/process', auth_1.authenticateToken, approvals_controller_1.processApproval);
// Notifications routes
router.get('/notifications', auth_1.authenticateToken, notifications_controller_1.getAllNotifications);
router.patch('/notifications/:id/read', auth_1.authenticateToken, notifications_controller_1.markNotificationAsRead);
// Audit routes
router.get('/audit-logs', audit_controller_1.getAllAuditLogs);
// Reports routes
router.get('/reports/analytics', reports_controller_1.getAnalyticsReport);
exports.default = router;
