import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare function getDashboardSummary(req: AuthRequest, res: Response): Promise<void>;
