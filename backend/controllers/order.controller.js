import crypto from 'crypto';
import Order from '../models/Order.js';
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { getPaginationMeta, getPaginationOptions } from '../utils/queryOptions.js';
import mongoose from 'mongoose';
import razorpay from '../config/razorpay.js';

const mapOrderProducts = (products) =>
  products.map((item) => {
    const mappedItem = {
      productId: item.id,
      slug: item.slug,
      name: item.name,
      image: item.image,
      variant: item.variant,
      size: item.size || item.variant,
      volume: item.volume,
      quantity: item.quantity,
      price: item.price
    };

    if (mongoose.Types.ObjectId.isValid(item.id)) {
      mappedItem.product = item.id;
    }

    return mappedItem;
  });

const isValidRazorpaySignature = (orderId, paymentId, signature) => {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const expectedBuffer = Buffer.from(expectedSignature);
  const signatureBuffer = Buffer.from(signature || '');

  return expectedBuffer.length === signatureBuffer.length
    && crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
};

export const createOrder = asyncHandler(async (req, res) => {
  const products = mapOrderProducts(req.body.products);

  const order = await Order.create({
    userId: req.user._id,
    products,
    amount: req.body.amount,
    paymentStatus: req.body.paymentStatus || 'Pending',
    orderStatus: 'Pending',
    paymentMethod: req.body.paymentMethod || 'COD',
    paymentDetails: req.body.paymentDetails,
    shippingAddress: req.body.shippingAddress
  });

  res.status(201).json({ success: true, order });
});

export const createCheckoutRazorpayOrder = asyncHandler(async (req, res) => {
  const products = mapOrderProducts(req.body.products);
  const shippingAddress = req.body.shippingAddress;
  const amount = req.body.amount;
  const amountInPaise = Math.round(amount * 100);
  const localOrderId = req.body.localOrderId;

  let order;
  if (localOrderId) {
    if (!mongoose.Types.ObjectId.isValid(localOrderId)) {
      throw new ApiError(400, 'Invalid order id');
    }

    order = await Order.findOne({
      _id: localOrderId,
      userId: req.user._id,
      paymentMethod: 'Razorpay',
      paymentStatus: 'Pending'
    });

    if (!order) {
      throw new ApiError(404, 'Pending Razorpay order not found');
    }

    order.products = products;
    order.amount = amount;
    order.shippingAddress = shippingAddress;
  } else {
    order = new Order({
      userId: req.user._id,
      products,
      amount,
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      paymentMethod: 'Razorpay',
      shippingAddress,
      paymentDetails: {
        payment_status: 'created',
        amount
      }
    });
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt: `order_${order._id || Date.now()}`,
    notes: {
      localOrderId: String(order._id || ''),
      userId: String(req.user._id)
    }
  });

  order.razorpayOrderId = razorpayOrder.id;
  order.paymentDetails = {
    ...(order.paymentDetails || {}),
    order_id: razorpayOrder.id,
    amount,
    payment_method: 'Razorpay',
    payment_status: 'created',
    razorpayOrder
  };
  await order.save();

  res.status(201).json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID,
    order,
    razorpayOrder
  });
});

export const verifyCheckoutRazorpayPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  if (!isValidRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    throw new ApiError(400, 'Invalid payment signature');
  }

  const payment = await razorpay.payments.fetch(razorpay_payment_id);
  if (payment.order_id !== razorpay_order_id) {
    throw new ApiError(400, 'Payment does not belong to this Razorpay order');
  }

  if (payment.status !== 'captured') {
    throw new ApiError(400, 'Payment is not captured yet');
  }

  const update = {
    products: mapOrderProducts(req.body.products),
    amount: req.body.amount,
    shippingAddress: req.body.shippingAddress,
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    paymentMethod: 'Razorpay',
    paymentDetails: {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      amount: payment.amount ? payment.amount / 100 : req.body.amount,
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
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id
  };

  let order = await Order.findOneAndUpdate({
    userId: req.user._id,
    razorpayOrderId: razorpay_order_id
  }, update, {
    new: true,
    runValidators: true
  });

  if (!order) {
    order = await Order.create({
      userId: req.user._id,
      ...update
    });
  }

  res.status(201).json({ success: true, order });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const filter = { userId: req.user._id };
  const pagination = getPaginationOptions(req.query);
  const [orders, total] = await Promise.all([
    Order.find(filter)
      .select('products amount paymentStatus orderStatus paymentMethod paymentDetails shippingAddress razorpayOrderId razorpayPaymentId createdAt')
      .sort('-createdAt')
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    Order.countDocuments(filter)
  ]);

  res.json({ success: true, orders, pagination: getPaginationMeta(total, pagination) });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.orderStatus = req.query.status;
  if (req.query.search) filter._id = req.query.search;

  const pagination = getPaginationOptions(req.query);
  const [orders, total] = await Promise.all([
    Order.find(filter)
      .select('userId products amount paymentStatus orderStatus paymentMethod paymentDetails shippingAddress razorpayOrderId razorpayPaymentId createdAt')
      .populate({ path: 'userId', select: 'name phone email', options: { lean: true } })
      .sort('-createdAt')
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    Order.countDocuments(filter)
  ]);

  res.json({ success: true, orders, pagination: getPaginationMeta(total, pagination) });
});

export const getOrderDetails = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw new ApiError(404, 'Order not found');

  const order = await Order.findById(req.params.id).populate('userId', 'name phone email addresses createdAt').lean();
  if (!order) throw new ApiError(404, 'Order not found');
  res.json({ success: true, order });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw new ApiError(404, 'Order not found');

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { orderStatus: req.body.orderStatus },
    { new: true, runValidators: true }
  ).populate('userId', 'name phone email addresses createdAt').lean();
  if (!order) throw new ApiError(404, 'Order not found');
  res.json({ success: true, order });
});
