import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getNotifications,
  markAsRead,
  updateNotification,
  deleteNotification,
  createNotification
} from '../controllers/notifications.controller';

const router = Router();

router.get('/', authenticate, getNotifications);
router.put('/:id/read', authenticate, markAsRead);
router.put('/:id', authenticate, updateNotification);
router.delete('/:id', authenticate, deleteNotification);
router.post('/', createNotification); // For system notifications

export default router;
