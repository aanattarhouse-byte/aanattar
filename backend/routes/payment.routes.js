import express from 'express';
import { createRazorpayOrder, verifyPayment } from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { paymentCreateSchema, paymentVerifySchema } from '../validations/order.validation.js';

const router = express.Router();

router.post('/create-order', protect, validate(paymentCreateSchema), createRazorpayOrder);
router.post('/verify', protect, validate(paymentVerifySchema), verifyPayment);

export default router;
