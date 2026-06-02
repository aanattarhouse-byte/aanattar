import express from 'express';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct
} from '../controllers/product.controller.js';
import { authorize, protect } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { productSchema } from '../validations/product.validation.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:slug', getProduct);
router.post('/', protect, authorize('admin'), validate(productSchema), createProduct);
router.put('/:id', protect, authorize('admin'), validate(productSchema), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;
