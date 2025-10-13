"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const notifications_controller_1 = require("../controllers/notifications.controller");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, notifications_controller_1.getNotifications);
router.put('/:id/read', auth_1.authenticate, notifications_controller_1.markAsRead);
router.put('/:id', auth_1.authenticate, notifications_controller_1.updateNotification);
router.delete('/:id', auth_1.authenticate, notifications_controller_1.deleteNotification);
router.post('/', notifications_controller_1.createNotification); // For system notifications
exports.default = router;
//# sourceMappingURL=notifications.js.map