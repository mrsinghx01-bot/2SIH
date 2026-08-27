import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare function getAllApprovals(req: Request, res: Response): Promise<void>;
export declare function processApproval(req: AuthRequest, res: Response): Promise<void>;
