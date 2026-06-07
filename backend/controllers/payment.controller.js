import crypto from 'crypto';
import razorpay from '../config/razorpay.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const verifyRazorpaySignature = (payload, signature, secret) => {
  if (!signature || !secret) return false;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  const expectedBuffer = Buffer.from(expectedSignature);
  const signatureBuffer = Buffer.from(signature);

  return expectedBuffer.length === signatureBuffer.length
    && crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
};

const getCartSnapshot = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'name images stock'
  });
  if (!cart || cart.items.length === 0) throw new ApiError(400, 'Cart is empty');

  const products = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    image: item.product.images?.[0]?.url,
    quantity: item.quantity,
    price: item.price
  }));
  const amount = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return { cart, products, amount };
};

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = await getCartSnapshot(req.user._id);
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency: 'INR',
    receipt: `rcpt_${Date.now()}_${req.user._id}`
  });

  res.status(201).json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID,
    amount,
    razorpayOrder
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, shippingAddress } = req.body;
  if (!verifyRazorpaySignature(
    `${razorpay_order_id}|${razorpay_payment_id}`,
    razorpay_signature,
    process.env.RAZORPAY_KEY_SECRET
  )) {
    throw new ApiError(400, 'Invalid payment signature');
  }

  const payment = await razorpay.payments.fetch(razorpay_payment_id);
  if (payment.order_id !== razorpay_order_id) {
    throw new ApiError(400, 'Payment does not belong to this Razorpay order');
  }

  if (payment.status !== 'captured') {
    throw new ApiError(400, 'Payment is not captured yet');
  }

  const { cart, products, amount } = await getCartSnapshot(req.user._id);

  for (const item of products) {
    const updated = await Product.findOneAndUpdate(
      { _id: item.product, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
      { new: true }
    );
    if (!updated) throw new ApiError(400, `Insufficient stock for ${item.name}`);
  }

  const order = await Order.create({
    userId: req.user._id,
    products,
    amount,
    paymentStatus: 'Paid',
    orderStatus: 'Confirmed',
    paymentMethod: 'Razorpay',
    paymentDetails: {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      amount: payment.amount ? payment.amount / 100 : amount,
      payment_method: payment.method || 'Razorpay',
      payment_status: payment.status,
      paid_at: payment.created_at ? new Date(payment.created_at * 1000) : new Date(),
      email: payment.email,
      contact: payment.contact,
      vpa: payment.vpa,
      wallet: payment.wallet,
      bank: payment.bank,
      card_id: payment.card_id
    },
    shippingAddress,
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id
  });

  cart.items = [];
  await cart.save();

  res.status(201).json({ success: true, order });
});

export const handleRazorpayWebhook = asyncHandler(async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new ApiError(500, 'Razorpay webhook secret is not configured');
  }

  const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body || {}));
  const webhookSignature = req.get('x-razorpay-signature');

  if (!verifyRazorpaySignature(rawBody, webhookSignature, webhookSecret)) {
    throw new ApiError(400, 'Invalid Razorpay webhook signature');
  }

  const payload = JSON.parse(rawBody.toString('utf8'));
  const event = payload.event;
  const payment = payload.payload?.payment?.entity;
  const order = payload.payload?.order?.entity;
  const refund = payload.payload?.refund?.entity;
  const razorpayOrderId = payment?.order_id || order?.id;

  if (event === 'payment.captured' && razorpayOrderId) {
    await Order.findOneAndUpdate(
      { razorpayOrderId },
      {
        paymentStatus: 'Paid',
        orderStatus: 'Confirmed',
        paymentMethod: 'Razorpay',
        razorpayPaymentId: payment.id,
        $set: {
          'paymentDetails.order_id': razorpayOrderId,
          'paymentDetails.payment_id': payment.id,
          'paymentDetails.razorpayOrderId': razorpayOrderId,
          'paymentDetails.razorpayPaymentId': payment.id,
          'paymentDetails.amount': payment.amount ? payment.amount / 100 : undefined,
          'paymentDetails.payment_method': payment.method || 'Razorpay',
          'paymentDetails.payment_status': payment.status,
          'paymentDetails.paid_at': payment.created_at ? new Date(payment.created_at * 1000) : new Date(),
          'paymentDetails.email': payment.email,
          'paymentDetails.contact': payment.contact,
          'paymentDetails.vpa': payment.vpa,
          'paymentDetails.wallet': payment.wallet,
          'paymentDetails.bank': payment.bank,
          'paymentDetails.card_id': payment.card_id,
          'paymentDetails.webhook_event': event
        }
      },
      { new: true }
    );
  }

  if (event === 'payment.failed' && razorpayOrderId) {
    await Order.findOneAndUpdate(
      { razorpayOrderId, paymentStatus: 'Pending' },
      {
        orderStatus: 'Pending',
        paymentMethod: 'Razorpay',
        razorpayPaymentId: payment.id,
        $set: {
          'paymentDetails.order_id': razorpayOrderId,
          'paymentDetails.payment_id': payment.id,
          'paymentDetails.razorpayOrderId': razorpayOrderId,
          'paymentDetails.razorpayPaymentId': payment.id,
          'paymentDetails.amount': payment.amount ? payment.amount / 100 : undefined,
          'paymentDetails.payment_method': payment.method || 'Razorpay',
          'paymentDetails.payment_status': payment.status || 'failed',
          'paymentDetails.error_code': payment.error_code,
          'paymentDetails.error_description': payment.error_description,
          'paymentDetails.failed_at': payment.created_at ? new Date(payment.created_at * 1000) : new Date(),
          'paymentDetails.webhook_event': event
        }
      },
      { new: true }
    );
  }

  if (event === 'order.paid' && order?.id) {
    await Order.findOneAndUpdate(
      { razorpayOrderId: order.id },
      {
        paymentStatus: 'Paid',
        orderStatus: 'Confirmed',
        paymentMethod: 'Razorpay',
        $set: {
          'paymentDetails.order_id': order.id,
          'paymentDetails.amount': order.amount ? order.amount / 100 : undefined,
          'paymentDetails.payment_method': 'Razorpay',
          'paymentDetails.payment_status': order.status || 'paid',
          'paymentDetails.paid_at': order.created_at ? new Date(order.created_at * 1000) : new Date(),
          'paymentDetails.webhook_event': event
        }
      },
      { new: true }
    );
  }

  if (event === 'refund.created' && refund?.payment_id) {
    await Order.findOneAndUpdate(
      { razorpayPaymentId: refund.payment_id },
      {
        paymentStatus: 'Refunded',
        $set: {
          'paymentDetails.payment_id': refund.payment_id,
          'paymentDetails.refund_id': refund.id,
          'paymentDetails.refund_amount': refund.amount ? refund.amount / 100 : undefined,
          'paymentDetails.payment_status': refund.status || 'refund_created',
          'paymentDetails.refunded_at': refund.created_at ? new Date(refund.created_at * 1000) : new Date(),
          'paymentDetails.webhook_event': event
        }
      },
      { new: true }
    );
  }

  res.json({ success: true, received: true });
});
