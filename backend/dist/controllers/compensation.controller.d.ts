import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare function getAllCompensation(req: AuthRequest, res: Response): Promise<void>;
