import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import path from 'path';
import s3Client from '../config/s3.js';

export const uploadImageToS3 = async (file, folder = 'products') => {
  const ext = path.extname(file.originalname);
  const key = `${folder}/${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;

  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype
  }));

  return {
    key,
    url: `${process.env.AWS_S3_PUBLIC_URL}/${key}`
  };
};

export const deleteImageFromS3 = async (key) => {
  if (!key) return;
  await s3Client.send(new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key
  }));
};
