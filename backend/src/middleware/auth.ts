import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedUser {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: string;
  designation: string;
  ministry: string;
  stateId?: string | null;
  districtId?: string | null;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

const JWT_SECRET = process.env.JWT_SECRET || 'government_of_india_national_land_management_secret_key_2026';

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    const roleHeader = req.headers['x-user-role'] as string;
    const stateHeader = req.headers['x-user-state'] as string;
    const districtHeader = req.headers['x-user-district'] as string;

    if (roleHeader) {
      req.user = {
        id: `user-${roleHeader.toLowerCase()}`,
        employeeId: `EMP-${roleHeader}`,
        name: `${roleHeader} User`,
        email: `user.${roleHeader.toLowerCase()}@landrecords.gov.in`,
        role: roleHeader,
        designation: 'Officer Jurisdiction Scope',
        ministry: 'Government Authority',
        stateId: stateHeader || null,
        districtId: districtHeader || null
      };
      return next();
    }

    // Default Central Admin
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
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({
      success: false,
      data: null,
      message: 'Invalid or expired authentication token.'
    });
  }
}

export function authorizeRoles(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        data: null,
        message: 'Authentication required.'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        data: null,
        message: `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`
      });
      return;
    }

    next();
  };
}

export function checkGeographicScope(req: AuthRequest, res: Response, next: NextFunction): void {
  const user = req.user;
  if (!user) {
    res.status(401).json({ success: false, data: null, message: 'Authentication required.' });
    return;
  }

  // Central Officers have national scope
  if (user.role === 'CENTRAL_ADMIN' || user.role === 'CENTRAL_OFFICER') {
    return next();
  }

  const requestedStateId = req.params.stateId || req.query.stateId as string;
  const requestedDistrictId = req.params.districtId || req.query.districtId as string;

  if (user.stateId && requestedStateId && user.stateId !== requestedStateId) {
    res.status(403).json({
      success: false,
      data: null,
      message: `Access denied. Your access is restricted to State ID: ${user.stateId}`
    });
    return;
  }

  if (user.districtId && requestedDistrictId && user.districtId !== requestedDistrictId) {
    res.status(403).json({
      success: false,
      data: null,
      message: `Access denied. Your access is restricted to District ID: ${user.districtId}`
    });
    return;
  }

  next();
}
