import { uploadImageToS3 } from '../services/s3.service.js';
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files?.length) throw new ApiError(400, 'No images uploaded');
  const images = await Promise.all(req.files.map((file) => uploadImageToS3(file)));
  res.status(201).json({ success: true, images });
});
