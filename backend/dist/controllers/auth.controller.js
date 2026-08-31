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
    const { employeeId, password, roleOverride, stateId, districtId } = req.body;
    const store = (0, database_1.getDatabaseStore)();
    let user = null;
    // 1. If stateId is explicitly selected for STATE_ADMIN
    if (roleOverride === 'STATE_ADMIN' && stateId) {
        const targetState = store.states.find(s => s.id === stateId ||
            s.shortName?.toLowerCase() === stateId.toLowerCase() ||
            s.lgdCode === parseInt(stateId, 10) ||
            s.name.toLowerCase() === stateId.toLowerCase());
        if (targetState) {
            user = store.users.find(u => u.role === 'STATE_ADMIN' && u.stateId === targetState.id);
            if (!user) {
                user = {
                    id: `user-state-admin-${targetState.shortName.toLowerCase()}`,
                    employeeId: `${targetState.shortName}-SAD-101`,
                    name: `${targetState.name} State Admin`,
                    email: `secy.revenue@${targetState.shortName.toLowerCase()}.gov.in`,
                    passwordHash: store.users[0]?.passwordHash || '',
                    role: 'STATE_ADMIN',
                    designation: `Principal Secretary (Revenue & Land Records)`,
                    ministry: `Department of Revenue, ${targetState.name}`,
                    stateId: targetState.id,
                    districtId: null,
                    isActive: true
                };
                store.users.push(user);
            }
        }
    }
    // 1b. If districtId selected for LAND_ACQUISITION_OFFICER
    if (!user && roleOverride === 'LAND_ACQUISITION_OFFICER' && (districtId || stateId)) {
        const targetState = stateId ? store.states.find(s => s.id === stateId || s.shortName?.toLowerCase() === stateId.toLowerCase()) : null;
        const targetDistrict = districtId ? store.districts.find(d => d.id === districtId) : null;
        const resolvedState = targetState || (targetDistrict ? store.states.find(s => s.id === targetDistrict.stateId) : null);
        const resolvedDistrict = targetDistrict;
        // Find existing LAO user for this district, or auto-create one
        user = store.users.find(u => u.role === 'LAND_ACQUISITION_OFFICER' && u.districtId === (resolvedDistrict?.id || null));
        if (!user) {
            const shortName = resolvedState?.shortName || 'GOI';
            const distName = resolvedDistrict?.name || 'District';
            user = {
                id: `user-lao-${(resolvedDistrict?.id || districtId || 'gen').replace(/[^a-z0-9]/gi, '-')}`,
                employeeId: `LAO-${shortName.toUpperCase()}-${distName.replace(/[^A-Z]/gi, '').substring(0, 3).toUpperCase()}-301`,
                name: `LAO / Competent Authority (${distName})`,
                email: `lao.${distName.toLowerCase().replace(/[^a-z0-9]/g, '')}@${shortName.toLowerCase()}.gov.in`,
                passwordHash: store.users[0]?.passwordHash || '',
                role: 'LAND_ACQUISITION_OFFICER',
                designation: 'Land Acquisition Officer (Competent Authority)',
                ministry: `Collectorate, ${distName}`,
                stateId: resolvedState?.id || stateId || null,
                districtId: resolvedDistrict?.id || districtId || null,
                isActive: true
            };
            store.users.push(user);
        }
    }
    // 1c. If stateId or districtId selected for FIELD_OFFICER
    if (!user && roleOverride === 'FIELD_OFFICER' && (stateId || districtId)) {
        const targetState = stateId ? store.states.find(s => s.id === stateId ||
            s.shortName?.toLowerCase() === stateId.toLowerCase() ||
            s.lgdCode === parseInt(stateId, 10) ||
            s.name.toLowerCase() === stateId.toLowerCase()) : null;
        const targetDistrict = districtId ? store.districts.find(d => d.id === districtId) : (targetState ? store.districts.find(d => d.stateId === targetState.id) : null);
        const resolvedState = targetState || (targetDistrict ? store.states.find(s => s.id === targetDistrict.stateId) : null);
        const resolvedDistrict = targetDistrict;
        const shortName = resolvedState?.shortName || 'IN';
        const stateName = resolvedState?.name || 'State';
        const distName = resolvedDistrict?.name || 'District';
        user = store.users.find(u => u.role === 'FIELD_OFFICER' && u.stateId === (resolvedState?.id || null));
        if (!user) {
            user = {
                id: `user-fo-${(resolvedState?.id || stateId || 'gen').replace(/[^a-z0-9]/gi, '-')}`,
                employeeId: `FO-${shortName.toUpperCase()}-501`,
                name: `Field Officer (${distName}, ${shortName})`,
                email: `survey.${distName.toLowerCase().replace(/[^a-z0-9]/g, '')}@${shortName.toLowerCase()}.gov.in`,
                passwordHash: store.users[0]?.passwordHash || '',
                role: 'FIELD_OFFICER',
                designation: 'Tehsildar (Land Records & Cadastral Survey)',
                ministry: `Department of Revenue, ${stateName}`,
                stateId: resolvedState?.id || stateId || null,
                districtId: resolvedDistrict?.id || districtId || null,
                isActive: true
            };
            store.users.push(user);
        }
    }
    // 2. Look up existing user by employeeId, email, or role
    if (!user) {
        user = store.users.find(u => u.employeeId === employeeId ||
            u.email === employeeId ||
            u.id === employeeId ||
            (roleOverride && u.employeeId === roleOverride) ||
            (roleOverride && u.id === roleOverride) ||
            (roleOverride && u.role === roleOverride));
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
        newValue: `Role: ${user.role}, Scope: ${user.stateId || 'NATIONAL'}`,
        ipAddress: req.ip || '127.0.0.1',
        createdAt: new Date()
    });
    res.json({
        success: true,
        data: {
            token,
            user: tokenPayload
        },
        message: `Logged in successfully as ${user.name} (${user.role}).`
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
