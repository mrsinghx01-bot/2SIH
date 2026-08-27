import { Request, Response } from 'express';
import { getDatabaseStore } from '../config/database';

export async function getAllAuditLogs(req: Request, res: Response): Promise<void> {
  const store = getDatabaseStore();
  const entityType = req.query.entityType as string;
  const action = req.query.action as string;
  const searchQuery = (req.query.search as string || '').toLowerCase().trim();

  let results = store.auditLogs;

  if (entityType) {
    results = results.filter(a => a.entityType === entityType);
  }

  if (action) {
    results = results.filter(a => a.action === action);
  }

  if (searchQuery) {
    results = results.filter(a =>
      a.action.toLowerCase().includes(searchQuery) ||
      (a.userEmail && a.userEmail.toLowerCase().includes(searchQuery)) ||
      (a.entityId && a.entityId.toLowerCase().includes(searchQuery))
    );
  }

  res.json({
    success: true,
    data: results,
    total: results.length,
    message: 'Audit logs retrieved.'
  });
}
