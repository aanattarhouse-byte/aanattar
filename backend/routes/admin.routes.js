import express from 'express';
import { getDashboardStats, getUserDetails, getUsers, updateUserStatus } from '../controllers/admin.controller.js';
import { authorize, protect } from '../middleware/auth.middleware.js';
import { getAllOrders, getOrderDetails, updateOrderStatus } from '../controllers/order.controller.js';
import validate from '../middleware/validate.middleware.js';
import { userStatusSchema } from '../validations/admin.validation.js';

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/session', (req, res) => res.json({ success: true, user: req.user }));
router.get('/dashboard', getDashboardStats);
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderDetails);
router.patch('/orders/:id/status', updateOrderStatus);
router.get('/users', getUsers);
router.get('/users/:id', getUserDetails);
router.patch('/users/:id', validate(userStatusSchema), updateUserStatus);

export default router;
