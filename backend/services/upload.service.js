import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadImageToLocal = async (file, hostUrl, folder = 'products') => {
  const ext = path.extname(file.originalname);
  const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
  
  // The service is in backend/services/
  // uploads folder is in backend/uploads/
  // So we go up one level
  const targetDir = path.join(__dirname, '..', 'uploads', folder);
  
  // Ensure the directory exists
  await fs.mkdir(targetDir, { recursive: true });
  
  const filePath = path.join(targetDir, filename);
  await fs.writeFile(filePath, file.buffer);
  
  const key = `${folder}/${filename}`;
  const url = `${hostUrl}/uploads/${key}`;
  
  return {
    key,
    url
  };
};

export const deleteImageFromLocal = async (key) => {
  if (!key) return;
  try {
    const filePath = path.join(__dirname, '..', 'uploads', key);
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Failed to delete local file: ${key}`, error);
  }
};
