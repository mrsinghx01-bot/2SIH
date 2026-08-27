"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAuditLogs = getAllAuditLogs;
const database_1 = require("../config/database");
async function getAllAuditLogs(req, res) {
    const store = (0, database_1.getDatabaseStore)();
    const entityType = req.query.entityType;
    const action = req.query.action;
    const searchQuery = (req.query.search || '').toLowerCase().trim();
    let results = store.auditLogs;
    if (entityType) {
        results = results.filter(a => a.entityType === entityType);
    }
    if (action) {
        results = results.filter(a => a.action === action);
    }
    if (searchQuery) {
        results = results.filter(a => a.action.toLowerCase().includes(searchQuery) ||
            (a.userEmail && a.userEmail.toLowerCase().includes(searchQuery)) ||
            (a.entityId && a.entityId.toLowerCase().includes(searchQuery)));
    }
    res.json({
        success: true,
        data: results,
        total: results.length,
        message: 'Audit logs retrieved.'
    });
}
