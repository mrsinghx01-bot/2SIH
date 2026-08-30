import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare function getAllDocuments(req: Request, res: Response): Promise<void>;
export declare function uploadDocument(req: AuthRequest, res: Response): Promise<void>;
export declare function streamDocumentPdf(req: Request, res: Response): Promise<void>;
