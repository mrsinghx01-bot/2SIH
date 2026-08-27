import { Request, Response } from 'express';
import { getDatabaseStore } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export async function getAllDocuments(req: Request, res: Response): Promise<void> {
  const store = getDatabaseStore();
  const projectId = req.query.projectId as string;
  const caseId = req.query.caseId as string;
  const type = req.query.type as string;
  const searchQuery = (req.query.search as string || '').toLowerCase().trim();

  let results = store.documents;

  if (projectId) {
    results = results.filter(d => d.projectId === projectId);
  }

  if (caseId) {
    results = results.filter(d => d.caseId === caseId);
  }

  if (type) {
    results = results.filter(d => d.documentType === type);
  }

  if (searchQuery) {
    results = results.filter(d =>
      d.title.toLowerCase().includes(searchQuery) ||
      d.fileName.toLowerCase().includes(searchQuery)
    );
  }

  res.json({
    success: true,
    data: results,
    total: results.length,
    message: 'Documents retrieved.'
  });
}

export async function uploadDocument(req: AuthRequest, res: Response): Promise<void> {
  const store = getDatabaseStore();
  const { projectId, caseId, documentType, title, fileName } = req.body;

  const doc = {
    id: `doc-${Date.now()}`,
    projectId: projectId || null,
    caseId: caseId || null,
    documentType: documentType || 'OTHER',
    title: title || 'Uploaded Document',
    fileName: fileName || `doc_${Date.now()}.pdf`,
    filePath: `/storage/documents/${fileName || 'doc.pdf'}`,
    fileSize: 1024 * 1024 * 2,
    mimeType: 'application/pdf',
    version: '1.0',
    uploadedBy: req.user?.name || 'Officer',
    dataSource: 'DEMO',
    createdAt: new Date()
  };

  store.documents.unshift(doc);

  // Record audit log
  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    userId: req.user?.id || 'user-central-admin',
    userEmail: req.user?.email || 'officer@gov.in',
    action: 'UPLOAD_DOCUMENT',
    entityType: 'DOCUMENT',
    entityId: doc.id,
    oldValue: null,
    newValue: doc.title,
    ipAddress: req.ip || '127.0.0.1',
    createdAt: new Date()
  });

  res.status(201).json({
    success: true,
    data: doc,
    message: 'Document uploaded successfully.'
  });
}
