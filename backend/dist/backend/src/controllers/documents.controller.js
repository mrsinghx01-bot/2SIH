"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDocuments = getAllDocuments;
exports.uploadDocument = uploadDocument;
const database_1 = require("../config/database");
async function getAllDocuments(req, res) {
    const store = (0, database_1.getDatabaseStore)();
    const projectId = req.query.projectId;
    const caseId = req.query.caseId;
    const type = req.query.type;
    const searchQuery = (req.query.search || '').toLowerCase().trim();
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
        results = results.filter(d => d.title.toLowerCase().includes(searchQuery) ||
            d.fileName.toLowerCase().includes(searchQuery));
    }
    res.json({
        success: true,
        data: results,
        total: results.length,
        message: 'Documents retrieved.'
    });
}
async function uploadDocument(req, res) {
    const store = (0, database_1.getDatabaseStore)();
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
