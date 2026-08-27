import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare function getPublicStatesMaster(req: Request, res: Response): Promise<void>;
export declare function getAllStates(req: AuthRequest, res: Response): Promise<void>;
export declare function getStateById(req: AuthRequest, res: Response): Promise<void>;
