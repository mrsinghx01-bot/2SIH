import { Request, Response } from 'express';
import { getDatabaseStore } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export async function getAllNotifications(req: AuthRequest, res: Response): Promise<void> {
  const store = getDatabaseStore();
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
