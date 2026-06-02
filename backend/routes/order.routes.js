import express from 'express';
import {
  createCheckoutRazorpayOrder,
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
  verifyCheckoutRazorpayPayment
} from '../controllers/order.controller.js';
import { authorize, protect } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import {
  checkoutRazorpayCreateSchema,
  checkoutRazorpayVerifySchema,
  orderCreateSchema
} from '../validations/order.validation.js';

const router = express.Router();

router.post('/', protect, validate(orderCreateSchema), createOrder);
router.post('/payment/create', protect, validate(checkoutRazorpayCreateSchema), createCheckoutRazorpayOrder);
router.post('/payment/verify', protect, validate(checkoutRazorpayVerifySchema), verifyCheckoutRazorpayPayment);
router.get('/my', protect, getMyOrders);
router.get('/', protect, authorize('admin'), getAllOrders);
router.patch('/:id/status', protect, authorize('admin'), updateOrderStatus);

export default router;
