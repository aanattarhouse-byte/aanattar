import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const getVolumePrice = (volume, pricePerMl) => {
  const volumeMl = Number(String(volume || '').replace(/ml/i, ''));
  return volumeMl > 0 ? volumeMl * pricePerMl : null;
};

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, volume } = req.body;
  const product = await Product.findById(productId).select('price discountPrice stock');
  if (!product) throw new ApiError(404, 'Product not found');
  if (product.stock < quantity) throw new ApiError(400, 'Insufficient stock');

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const existing = cart.items.find(
    (item) => item.product.toString() === productId && item.volume === volume
  );
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({
      product: product._id,
      volume,
      quantity,
      price: getVolumePrice(volume, product.discountPrice ?? product.price) ?? product.discountPrice ?? product.price
    });
  }

  await cart.save();
  await cart.populate({ path: 'items.product', select: 'name slug price discountPrice images stock' });
  res.json({ success: true, cart });
});

export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
    .populate({ path: 'items.product', select: 'name slug price discountPrice images stock' })
    .lean();
  res.json({ success: true, cart: cart || { items: [] } });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId, volume } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.json({ success: true, cart: { items: [] } });

  cart.items = cart.items.filter((item) => {
    if (item.product.toString() !== productId) return true;
    return volume ? item.volume !== volume : false;
  });
  await cart.save();
  await cart.populate({ path: 'items.product', select: 'name slug price discountPrice images stock' });
  res.json({ success: true, cart });
});
