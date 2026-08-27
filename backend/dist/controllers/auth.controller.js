"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.getCurrentUser = getCurrentUser;
exports.getDemoRoles = getDemoRoles;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
const JWT_SECRET = process.env.JWT_SECRET || 'government_of_india_national_land_management_secret_key_2026';
async function login(req, res) {
    const { employeeId, password, roleOverride } = req.body;
    const store = (0, database_1.getDatabaseStore)();
    let user = store.users.find(u => u.employeeId === employeeId || u.email === employeeId);
    // In demo mode, if roleOverride is passed, find user with that role
    if (roleOverride) {
        user = store.users.find(u => u.role === roleOverride) || user;
    }
    if (!user) {
        // Default fallback to Central Admin
        user = store.users[0];
    }
    // Validate password (in demo mode, accept Admin@123 or any password if roleOverride is selected)
    if (password && !roleOverride) {
        const isValid = bcryptjs_1.default.compareSync(password, user.passwordHash);
        if (!isValid && password !== 'Admin@123') {
            res.status(401).json({
                success: false,
                data: null,
                message: 'Invalid Employee ID or Password.'
            });
            return;
        }
    }
    const tokenPayload = {
        id: user.id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
        designation: user.designation,
        ministry: user.ministry,
        stateId: user.stateId,
        districtId: user.districtId
    };
    const token = jsonwebtoken_1.default.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });
    // Record audit log
    store.auditLogs.unshift({
        id: `audit-${Date.now()}`,
        userId: user.id,
        userEmail: user.email,
        action: 'USER_LOGIN',
        entityType: 'AUTH',
        entityId: user.id,
        oldValue: null,
        newValue: `Role: ${user.role}`,
        ipAddress: req.ip || '127.0.0.1',
        createdAt: new Date()
    });
    res.json({
        success: true,
        data: {
            token,
            user: tokenPayload
        },
        message: 'Login successful.'
    });
}
async function getCurrentUser(req, res) {
    if (!req.user) {
        res.status(401).json({
            success: false,
            data: null,
            message: 'Not authenticated.'
        });
        return;
    }
    const store = (0, database_1.getDatabaseStore)();
    const user = store.users.find(u => u.id === req.user?.id) || req.user;
    res.json({
        success: true,
        data: user,
        message: null
    });
}
async function getDemoRoles(req, res) {
    const store = (0, database_1.getDatabaseStore)();
    const roleList = store.users.map(u => ({
        role: u.role,
        name: u.name,
        designation: u.designation,
        ministry: u.ministry,
        employeeId: u.employeeId,
        stateId: u.stateId,
        districtId: u.districtId
    }));
    res.json({
        success: true,
        data: roleList,
        message: 'Demo roles fetched successfully.'
    });
}
