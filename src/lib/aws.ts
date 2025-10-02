import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// AWS S3 Configuration
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

export const S3_BUCKET = process.env.AWS_S3_BUCKET || 'sdpc-print-media'
export const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN || 'cdn.sdpcprint.com'

// Upload file to S3
export async function uploadToS3(
  file: Buffer,
  key: string,
  contentType: string,
  bucket: string = S3_BUCKET
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: 'public-read', // Make publicly accessible
  })

  await s3Client.send(command)
  return `https://${CLOUDFRONT_DOMAIN}/${key}`
}

// Delete file from S3
export async function deleteFromS3(key: string, bucket: string = S3_BUCKET): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  })

  await s3Client.send(command)
}

// Generate presigned URL for uploads (for client-side uploads)
export async function generatePresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600,
  bucket: string = S3_BUCKET
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  })

  return await getSignedUrl(s3Client, command, { expiresIn })
}

// Generate presigned URL for downloads (for private files)
export async function generatePresignedDownloadUrl(
  key: string,
  expiresIn: number = 3600,
  bucket: string = S3_BUCKET
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  })

  return await getSignedUrl(s3Client, command, { expiresIn })
}

// Utility function to generate S3 key paths
export function generateS3Key(type: 'products' | 'artwork' | 'admin', filename: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = filename.split('.').pop()
  const baseName = filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_')
  
  return `${type}/${timestamp}_${randomString}_${baseName}.${extension}`
}

// Get CloudFront URL for public files
export function getCloudFrontUrl(key: string): string {
  return `https://${CLOUDFRONT_DOMAIN}/${key}`
}

