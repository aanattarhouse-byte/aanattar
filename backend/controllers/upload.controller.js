import { uploadImageToLocal } from '../services/upload.service.js';
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files?.length) throw new ApiError(400, 'No images uploaded');
  const hostUrl = `${req.protocol}://${req.get('host')}`;
  const images = await Promise.all(
    req.files.map((file) => uploadImageToLocal(file, hostUrl))
  );
  res.status(201).json({ success: true, images });
});
