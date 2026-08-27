"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllNotifications = getAllNotifications;
exports.markNotificationAsRead = markNotificationAsRead;
const database_1 = require("../config/database");
async function getAllNotifications(req, res) {
    const store = (0, database_1.getDatabaseStore)();
    const results = store.notifications;
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
    }
    res.json({
        success: true,
        data: notif,
        message: 'Notification marked as read.'
    });
}
