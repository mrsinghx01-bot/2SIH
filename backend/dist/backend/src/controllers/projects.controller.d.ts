import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare function getAllProjects(req: Request, res: Response): Promise<void>;
export declare function getProjectById(req: Request, res: Response): Promise<void>;
export declare function createProject(req: AuthRequest, res: Response): Promise<void>;
