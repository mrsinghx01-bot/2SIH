import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare function login(req: Request, res: Response): Promise<void>;
export declare function getCurrentUser(req: AuthRequest, res: Response): Promise<void>;
export declare function getDemoRoles(req: Request, res: Response): Promise<void>;
