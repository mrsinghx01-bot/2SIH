import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare function getAllNotifications(req: AuthRequest, res: Response): Promise<void>;
export declare function markNotificationAsRead(req: Request, res: Response): Promise<void>;
