import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getDatabaseStore } from '../config/database';
import { AuthRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'government_of_india_national_land_management_secret_key_2026';

export async function login(req: Request, res: Response): Promise<void> {
  const { employeeId, password, roleOverride, stateId } = req.body;
  const store = getDatabaseStore();

  let user: any = null;

  // 1. If stateId is explicitly selected for STATE_ADMIN
  if (roleOverride === 'STATE_ADMIN' && stateId) {
    const targetState = store.states.find(s =>
      s.id === stateId ||
      s.shortName?.toLowerCase() === stateId.toLowerCase() ||
      s.lgdCode === parseInt(stateId, 10) ||
      s.name.toLowerCase() === stateId.toLowerCase()
    );

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

  // 2. Look up existing user by employeeId, email, or role
  if (!user) {
    user = store.users.find(u =>
      u.employeeId === employeeId ||
      u.email === employeeId ||
      u.id === employeeId ||
      (roleOverride && u.employeeId === roleOverride) ||
      (roleOverride && u.id === roleOverride) ||
      (roleOverride && u.role === roleOverride)
    );
  }

  if (!user) {
    // Default fallback to Central Admin
    user = store.users[0];
  }

  // Validate password (in demo mode, accept Admin@123 or any password if roleOverride is selected)
  if (password && !roleOverride) {
    const isValid = bcrypt.compareSync(password, user.passwordHash);
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

  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

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

export async function getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({
      success: false,
      data: null,
      message: 'Not authenticated.'
    });
    return;
  }

  const store = getDatabaseStore();
  const user = store.users.find(u => u.id === req.user?.id) || req.user;

  res.json({
    success: true,
    data: user,
    message: null
  });
}

export async function getDemoRoles(req: Request, res: Response): Promise<void> {
  const store = getDatabaseStore();
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
