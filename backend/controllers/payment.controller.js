import crypto from 'crypto';
import razorpay from '../config/razorpay.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

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
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    throw new ApiError(400, 'Invalid payment signature');
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
    orderStatus: 'Processing',
    shippingAddress,
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id
  });

  cart.items = [];
  await cart.save();

  res.status(201).json({ success: true, order });
});
