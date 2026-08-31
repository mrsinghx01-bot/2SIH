import { Request, Response } from 'express';
import { getDatabaseStore, saveDatabaseStore } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export async function getAllApprovals(req: Request, res: Response): Promise<void> {
  const store = getDatabaseStore();
  const status = req.query.status as string;

  let results = store.approvals;
  if (status) {
    results = results.filter(a => a.status === status);
  }

  res.json({
    success: true,
    data: results,
    total: results.length,
    message: 'Approvals retrieved.'
  });
}

export async function processApproval(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const { action, remarks } = req.body; // 'APPROVE' or 'REJECT' or 'RETURN'
  const store = getDatabaseStore();

  const approval = store.approvals.find(a => a.id === id);
  if (!approval) {
    res.status(404).json({
      success: false,
      data: null,
      message: 'Approval request not found.'
    });
    return;
  }

  const oldStatus = approval.status;
  approval.status = action === 'APPROVE' ? 'APPROVED' : action === 'REJECT' ? 'REJECTED' : 'RETURNED';
  approval.remarks = remarks || approval.remarks;
  approval.approvedAt = new Date();

  // Audit
  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    userId: req.user?.id || 'user-central-admin',
    userEmail: req.user?.email || 'admin@gov.in',
    action: `APPROVAL_${action}`,
    entityType: 'APPROVAL',
    entityId: approval.id,
    oldValue: oldStatus,
    newValue: approval.status,
    ipAddress: req.ip || '127.0.0.1',
    createdAt: new Date()
  });

  saveDatabaseStore();

  res.json({
    success: true,
    data: approval,
    message: `Approval status updated to ${approval.status}.`
  });
}

