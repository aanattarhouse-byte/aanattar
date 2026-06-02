import Order from '../models/Order.js';
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { getPaginationMeta, getPaginationOptions } from '../utils/queryOptions.js';
import mongoose from 'mongoose';

export const getMyOrders = asyncHandler(async (req, res) => {
  const filter = { userId: req.user._id };
  const pagination = getPaginationOptions(req.query);
  const [orders, total] = await Promise.all([
    Order.find(filter)
      .select('products amount paymentStatus orderStatus shippingAddress razorpayOrderId razorpayPaymentId createdAt')
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
      .select('userId products amount paymentStatus orderStatus shippingAddress razorpayOrderId razorpayPaymentId createdAt')
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
