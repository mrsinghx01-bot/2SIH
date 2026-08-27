import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare function getAllDistricts(req: AuthRequest, res: Response): Promise<void>;
export declare function getDistrictById(req: AuthRequest, res: Response): Promise<void>;
