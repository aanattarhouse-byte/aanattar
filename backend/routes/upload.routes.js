import express from 'express';
import { uploadImages } from '../controllers/upload.controller.js';
import { authorize, protect } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/products', protect, authorize('admin'), upload.array('images', 6), uploadImages);

export default router;
