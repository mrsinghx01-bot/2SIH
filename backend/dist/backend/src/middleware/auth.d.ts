import { Request, Response, NextFunction } from 'express';
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
export declare function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void;
export declare function authorizeRoles(...allowedRoles: string[]): (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare function checkGeographicScope(req: AuthRequest, res: Response, next: NextFunction): void;
