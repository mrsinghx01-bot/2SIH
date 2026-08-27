import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare function getAllCases(req: Request, res: Response): Promise<void>;
export declare function getCaseById(req: Request, res: Response): Promise<void>;
export declare function updateCaseStage(req: AuthRequest, res: Response): Promise<void>;
