import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare function getAllParcels(req: AuthRequest, res: Response): Promise<void>;
export declare function getParcelById(req: AuthRequest, res: Response): Promise<void>;
