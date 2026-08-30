import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare function getAllRR(req: AuthRequest, res: Response): Promise<void>;
