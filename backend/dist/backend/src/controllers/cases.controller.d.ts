import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare function getAllCases(req: AuthRequest, res: Response): Promise<void>;
export declare function getCaseById(req: AuthRequest, res: Response): Promise<void>;
export declare function updateCaseStage(req: AuthRequest, res: Response): Promise<void>;
