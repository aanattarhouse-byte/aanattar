import Product from '../models/Product.js';
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { getPaginationMeta, getPaginationOptions } from '../utils/queryOptions.js';
import mongoose from 'mongoose';

export const getProducts = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.category) query.category = req.query.category;
  if (req.query.featured) query.featured = req.query.featured === 'true';
  if (req.query.search) query.name = new RegExp(req.query.search, 'i');

  const pagination = getPaginationOptions(req.query, { defaultLimit: 50, maxLimit: 100 });
  const [products, total] = await Promise.all([
    Product.find(query)
      .select('name slug description category price discountPrice images stock featured createdAt')
      .sort('-createdAt')
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    Product.countDocuments(query)
  ]);

  res.json({ success: true, products, pagination: getPaginationMeta(total, pagination) });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = mongoose.isValidObjectId(req.params.slug)
    ? await Product.findById(req.params.slug).lean()
    : await Product.findOne({ slug: req.params.slug }).lean();
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true });
});
