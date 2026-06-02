import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { getPaginationMeta, getPaginationOptions } from '../utils/queryOptions.js';

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const [totalOrders, revenueSummary, totalUsers, pendingOrders, totalProducts, recentOrders, statusSummary] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
    ]),
    User.countDocuments(),
    Order.countDocuments({ orderStatus: 'Pending' }),
    Product.countDocuments(),
    Order.find()
      .select('userId amount paymentStatus orderStatus createdAt')
      .populate({ path: 'userId', select: 'name phone', options: { lean: true } })
      .sort('-createdAt')
      .limit(6)
      .lean(),
    Order.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }])
  ]);

  const totalRevenue = revenueSummary[0]?.totalRevenue || 0;
  const revenueChart = await Order.aggregate([
    { $match: { paymentStatus: 'Paid' } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$amount' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    { $limit: 14 }
  ]);

  res.json({
    success: true,
    stats: { totalOrders, totalRevenue, totalUsers, pendingOrders, totalProducts },
    recentOrders,
    revenueChart,
    statusSummary
  });
});

export const getUsers = asyncHandler(async (req, res) => {
  const search = req.query.search;
  const filter = search
    ? { $or: [
      { phone: new RegExp(search, 'i') },
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') }
    ] }
    : {};

  const pagination = getPaginationOptions(req.query);
  const [users, total] = await Promise.all([
    User.find(filter)
      .select('name phone email avatar role blocked addresses createdAt')
      .sort('-createdAt')
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    User.countDocuments(filter)
  ]);

  res.json({ success: true, users, pagination: getPaginationMeta(total, pagination) });
});

export const getUserDetails = asyncHandler(async (req, res) => {
  const [user, orders] = await Promise.all([
    User.findById(req.params.id).lean(),
    Order.find({ userId: req.params.id })
      .select('products amount paymentStatus orderStatus shippingAddress razorpayOrderId razorpayPaymentId createdAt')
      .sort('-createdAt')
      .limit(50)
      .lean()
  ]);

  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  res.json({ success: true, user, orders });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { blocked: Boolean(req.body.blocked) },
    { new: true }
  ).lean();

  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  res.json({ success: true, user });
});
