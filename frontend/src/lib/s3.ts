import { PutObjectCommand } from '@aws-sdk/client-s3';
import { S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

export async function uploadFileToS3(file: File, folder = 'products') {
  const bytes = Buffer.from(await file.arrayBuffer());
  const extension = file.name.split('.').pop() || 'jpg';
  const key = `${folder}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  await s3.send(new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: bytes,
    ContentType: file.type
  }));

  return {
    key,
    url: `${process.env.AWS_S3_PUBLIC_URL}/${key}`
  };
}
