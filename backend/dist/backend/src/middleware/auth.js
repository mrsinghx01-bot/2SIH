"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
exports.authorizeRoles = authorizeRoles;
exports.checkGeographicScope = checkGeographicScope;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'government_of_india_national_land_management_secret_key_2026';
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        // If no token in development mode, provide default Central Admin user context
        req.user = {
            id: 'user-central-admin',
            employeeId: 'GOI-CAD-001',
            name: 'Central Admin',
            email: 'central.admin@landrecords.gov.in',
            role: 'CENTRAL_ADMIN',
            designation: 'Joint Secretary (Land Resources)',
            ministry: 'Ministry of Rural Development'
        };
        return next();
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(403).json({
            success: false,
            data: null,
            message: 'Invalid or expired authentication token.'
        });
    }
}
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                data: null,
                message: 'Authentication required.'
            });
            return;
        }
        if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                data: null,
                message: `Access denied. Role ${req.user.role} does not have required permissions.`
            });
            return;
        }
        next();
    };
}
function checkGeographicScope(req, res, next) {
    if (!req.user)
        return next();
    // Central roles have full national scope
    if (req.user.role === 'CENTRAL_ADMIN' || req.user.role === 'CENTRAL_OFFICER') {
        return next();
    }
    const requestedStateId = req.params.stateId || req.query.stateId;
    const requestedDistrictId = req.params.districtId || req.query.districtId;
    if (requestedStateId && req.user.stateId && req.user.stateId !== requestedStateId) {
        res.status(403).json({
            success: false,
            data: null,
            message: 'Access restricted: You do not have permission to access data outside your assigned State.'
        });
        return;
    }
    if (requestedDistrictId && req.user.districtId && req.user.districtId !== requestedDistrictId) {
        res.status(403).json({
            success: false,
            data: null,
            message: 'Access restricted: You do not have permission to access data outside your assigned District.'
        });
        return;
    }
    next();
}
