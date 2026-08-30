import { Request, Response } from 'express';
import { getDatabaseStore } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export async function getAllNotifications(req: AuthRequest, res: Response): Promise<void> {
  const store = getDatabaseStore();
  const user = req.user;
  let districtId = req.query.districtId as string;
  let stateId = req.query.stateId as string;

  // Enforce role-based geographic scope
  if (user && user.role !== 'CENTRAL_ADMIN' && user.role !== 'CENTRAL_OFFICER') {
    if (user.districtId) districtId = user.districtId;
    if (user.stateId) stateId = user.stateId;
  }

  let results = store.notifications;

  if (districtId) {
    const distProjIds = new Set(store.projectDistricts.filter(pd => pd.districtId === districtId).map(pd => pd.projectId));
    results = results.filter(n => !n.entityId || distProjIds.has(n.entityId) || n.recipientRole === user?.role);
  } else if (stateId) {
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

export async function markNotificationAsRead(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const store = getDatabaseStore();

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
