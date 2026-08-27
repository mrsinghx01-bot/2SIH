"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllApprovals = getAllApprovals;
exports.processApproval = processApproval;
const database_1 = require("../config/database");
async function getAllApprovals(req, res) {
    const store = (0, database_1.getDatabaseStore)();
    const status = req.query.status;
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
async function processApproval(req, res) {
    const { id } = req.params;
    const { action, remarks } = req.body; // 'APPROVE' or 'REJECT' or 'RETURN'
    const store = (0, database_1.getDatabaseStore)();
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
    res.json({
        success: true,
        data: approval,
        message: `Approval status updated to ${approval.status}.`
    });
}
