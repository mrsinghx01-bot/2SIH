"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllNotifications = getAllNotifications;
exports.markNotificationAsRead = markNotificationAsRead;
const database_1 = require("../config/database");
async function getAllNotifications(req, res) {
    const store = (0, database_1.getDatabaseStore)();
    const user = req.user;
    let districtId = req.query.districtId;
    let stateId = req.query.stateId;
    // Enforce role-based geographic scope
    if (user && user.role !== 'CENTRAL_ADMIN' && user.role !== 'CENTRAL_OFFICER') {
        if (user.districtId)
            districtId = user.districtId;
        if (user.stateId)
            stateId = user.stateId;
    }
    let results = store.notifications;
    if (districtId) {
        const distProjIds = new Set(store.projectDistricts.filter(pd => pd.districtId === districtId).map(pd => pd.projectId));
        results = results.filter(n => !n.entityId || distProjIds.has(n.entityId) || n.recipientRole === user?.role);
    }
    else if (stateId) {
        const stateProjIds = new Set(store.projectDistricts.filter(pd => pd.stateId === stateId).map(pd => pd.projectId));
        results = results.filter(n => !n.entityId || stateProjIds.has(n.entityId) || n.recipientRole === user?.role);
    }
    const unreadCount = results.filter(n => !n.isRead).length;
    res.json({
        success: true,
        data: {
            notifications: results,
            unreadCount
        },
        message: 'Notifications retrieved.'
    });
}
async function markNotificationAsRead(req, res) {
    const { id } = req.params;
    const store = (0, database_1.getDatabaseStore)();
    const notif = store.notifications.find(n => n.id === id);
    if (notif) {
        notif.isRead = true;
        (0, database_1.saveDatabaseStore)();
    }
    res.json({
        success: true,
        data: notif,
        message: 'Notification marked as read.'
    });
}
