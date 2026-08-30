import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare function getAnalyticsReport(req: AuthRequest, res: Response): Promise<void>;
