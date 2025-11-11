import { readFileSync } from 'fs'
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getSignedUrl as getSignedCloudFrontUrl } from '@aws-sdk/cloudfront-signer'
import { createHash } from 'crypto'

// AWS S3 Configuration
const REGION =
  process.env.SDPC_AWS_REGION ||
  process.env.AWS_REGION ||
  'us-east-1'

// Ensure standard AWS_* variables exist for SDK default provider chain
if (!process.env.AWS_ACCESS_KEY_ID && process.env.SDPC_AWS_ACCESS_KEY_ID) {
  process.env.AWS_ACCESS_KEY_ID = process.env.SDPC_AWS_ACCESS_KEY_ID
}

if (!process.env.AWS_SECRET_ACCESS_KEY && process.env.SDPC_AWS_SECRET_ACCESS_KEY) {
  process.env.AWS_SECRET_ACCESS_KEY = process.env.SDPC_AWS_SECRET_ACCESS_KEY
}

if (!process.env.AWS_REGION && process.env.SDPC_AWS_REGION) {
  process.env.AWS_REGION = process.env.SDPC_AWS_REGION
}

const ACCESS_KEY_ID =
  process.env.SDPC_AWS_ACCESS_KEY_ID ||
  process.env.AWS_ACCESS_KEY_ID ||
  ''

const SECRET_ACCESS_KEY =
  process.env.SDPC_AWS_SECRET_ACCESS_KEY ||
  process.env.AWS_SECRET_ACCESS_KEY ||
  ''

if (!ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
  console.error('AWS credentials missing in environment', {
    hasSdpcAccessKey: Boolean(process.env.SDPC_AWS_ACCESS_KEY_ID),
    hasSdpcSecretKey: Boolean(process.env.SDPC_AWS_SECRET_ACCESS_KEY),
    hasAwsAccessKey: Boolean(process.env.AWS_ACCESS_KEY_ID),
    hasAwsSecretKey: Boolean(process.env.AWS_SECRET_ACCESS_KEY),
  })
}

const inferredCredentials =
  ACCESS_KEY_ID && SECRET_ACCESS_KEY
    ? { accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY }
    : undefined

export const S3_BUCKET =
  process.env.S3_BUCKET_NAME ||
  process.env.SDPC_S3_BUCKET_NAME ||
  'sdpcbucket'

export const S3_BUCKET_REGION =
  process.env.S3_BUCKET_REGION ||
  process.env.SDPC_S3_BUCKET_REGION ||
  REGION

export const CLOUDFRONT_DOMAIN =
  process.env.CLOUDFRONT_DOMAIN ||
  process.env.SDPC_CLOUDFRONT_DOMAIN ||
  ''

export const CLOUDFRONT_DISTRIBUTION_ID =
  process.env.CLOUDFRONT_DISTRIBUTION_ID ||
  process.env.SDPC_CLOUDFRONT_DISTRIBUTION_ID ||
  ''

const CLOUDFRONT_KEY_PAIR_ID =
  process.env.CLOUDFRONT_KEY_PAIR_ID ||
  process.env.SDPC_CLOUDFRONT_KEY_PAIR_ID ||
  ''

const CLOUDFRONT_PRIVATE_KEY_ENV =
  process.env.CLOUDFRONT_PRIVATE_KEY ||
  process.env.SDPC_CLOUDFRONT_PRIVATE_KEY ||
  ''

const CLOUDFRONT_PRIVATE_KEY_PATH =
  process.env.CLOUDFRONT_PRIVATE_KEY_PATH ||
  process.env.SDPC_CLOUDFRONT_PRIVATE_KEY_PATH ||
  ''

export const s3Client = new S3Client({
  region: REGION,
  ...(inferredCredentials ? { credentials: inferredCredentials } : {}),
})

// File upload configuration
export const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '209715200') // 200MB
export const ALLOWED_FILE_TYPES = (process.env.ALLOWED_FILE_TYPES || 'pdf,jpg,jpeg,png,ai,psd,docx').split(',')
export const UPLOAD_FOLDER = process.env.UPLOAD_FOLDER || 'uploads'
export const PUBLIC_FOLDER = process.env.PUBLIC_FOLDER || 'public'

// File type validation
export const FILE_TYPE_MAP = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'application/postscript': 'ai',
  'image/vnd.adobe.photoshop': 'psd',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
}

// Error types
export class S3Error extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'S3Error'
  }
}

// Validate file type and size
export function validateFile(file: Buffer, contentType: string, filename: string): { valid: boolean; error?: string } {
  // Check file size
  if (file.length > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB` }
  }

  // Check file type
  const fileExtension = filename.split('.').pop()?.toLowerCase()
  const mimeType = contentType.toLowerCase()
  
  if (!fileExtension || !ALLOWED_FILE_TYPES.includes(fileExtension)) {
    return { valid: false, error: `File type .${fileExtension} is not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}` }
  }

  // Check MIME type matches extension
  const expectedMimeType = Object.keys(FILE_TYPE_MAP).find(key => FILE_TYPE_MAP[key as keyof typeof FILE_TYPE_MAP] === fileExtension)
  if (expectedMimeType && mimeType !== expectedMimeType) {
    return { valid: false, error: 'File type does not match file extension' }
  }

  return { valid: true }
}

// Generate file hash for deduplication
export function generateFileHash(file: Buffer): string {
  return createHash('md5').update(file).digest('hex')
}

// Upload file to S3 with enhanced error handling
export async function uploadToS3(
  file: Buffer,
  key: string,
  contentType: string,
  bucket: string = S3_BUCKET,
  isPublic: boolean = false
): Promise<{ url: string; key: string; size: number; hash: string }> {
  try {
    // Validate file
    const validation = validateFile(file, contentType, key)
    if (!validation.valid) {
      throw new S3Error(validation.error!, 'VALIDATION_ERROR')
    }

    // Generate file hash
    const hash = generateFileHash(file)

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: contentType,
      ACL: isPublic ? 'public-read' : 'private',
      Metadata: {
        'file-hash': hash,
        'upload-timestamp': Date.now().toString(),
        'original-filename': key.split('/').pop() || key
      }
    })

    await s3Client.send(command)
    
    const url = CLOUDFRONT_DOMAIN 
      ? `https://${CLOUDFRONT_DOMAIN}/${key}`
      : `https://${bucket}.s3.${S3_BUCKET_REGION}.amazonaws.com/${key}`

    return {
      url,
      key,
      size: file.length,
      hash
    }
  } catch (error) {
    console.error('S3 Upload Error:', error)
    throw new S3Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`, 'UPLOAD_ERROR')
  }
}

// Delete file from S3
export async function deleteFromS3(key: string, bucket: string = S3_BUCKET): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })

    await s3Client.send(command)
  } catch (error) {
    console.error('S3 Delete Error:', error)
    throw new S3Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`, 'DELETE_ERROR')
  }
}

// Check if file exists in S3
export async function fileExists(key: string, bucket: string = S3_BUCKET): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    })

    await s3Client.send(command)
    return true
  } catch (error) {
    return false
  }
}

// Get file metadata
export async function getFileMetadata(key: string, bucket: string = S3_BUCKET): Promise<any> {
  try {
    const command = new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    })

    const response = await s3Client.send(command)
    return {
      size: response.ContentLength,
      contentType: response.ContentType,
      lastModified: response.LastModified,
      metadata: response.Metadata,
      etag: response.ETag
    }
  } catch (error) {
    throw new S3Error(`Failed to get file metadata: ${error instanceof Error ? error.message : 'Unknown error'}`, 'METADATA_ERROR')
  }
}

// Generate presigned URL for uploads (for client-side uploads)
export async function generatePresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600,
  bucket: string = S3_BUCKET,
  isPublic: boolean = false
): Promise<{ uploadUrl: string; key: string; expiresAt: number }> {
  try {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      ACL: isPublic ? 'public-read' : 'private',
      Metadata: {
        'upload-timestamp': Date.now().toString(),
        'original-filename': key.split('/').pop() || key
      }
    })

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn })
    
    return {
      uploadUrl,
      key,
      expiresAt: Date.now() + (expiresIn * 1000)
    }
  } catch (error) {
    throw new S3Error(`Failed to generate presigned URL: ${error instanceof Error ? error.message : 'Unknown error'}`, 'PRESIGNED_URL_ERROR')
  }
}

// Generate presigned URL for downloads (for private files)
export async function generatePresignedDownloadUrl(
  key: string,
  expiresIn: number = 3600,
  bucket: string = S3_BUCKET
): Promise<{ downloadUrl: string; expiresAt: number }> {
  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })

    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn })
    
    return {
      downloadUrl,
      expiresAt: Date.now() + (expiresIn * 1000)
    }
  } catch (error) {
    throw new S3Error(`Failed to generate download URL: ${error instanceof Error ? error.message : 'Unknown error'}`, 'DOWNLOAD_URL_ERROR')
  }
}

// List files in a folder
export async function listFiles(
  prefix: string,
  bucket: string = S3_BUCKET,
  maxKeys: number = 1000
): Promise<Array<{ key: string; size: number; lastModified: Date; etag: string }>> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      MaxKeys: maxKeys
    })

    const response = await s3Client.send(command)
    
    return (response.Contents || []).map(obj => ({
      key: obj.Key || '',
      size: obj.Size || 0,
      lastModified: obj.LastModified || new Date(),
      etag: obj.ETag || ''
    }))
  } catch (error) {
    throw new S3Error(`Failed to list files: ${error instanceof Error ? error.message : 'Unknown error'}`, 'LIST_ERROR')
  }
}

// Utility function to generate S3 key paths
export function generateS3Key(
  type: 'products' | 'artwork' | 'admin' | 'uploads' | 'public' | 'quotes',
  filename: string,
  subfolder?: string
): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = filename.split('.').pop()
  const baseName = filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_')
  
  const folder = subfolder ? `${type}/${subfolder}` : type
  return `${folder}/${timestamp}_${randomString}_${baseName}.${extension}`
}

// Get CloudFront URL for public files
export function getCloudFrontUrl(key: string): string {
  if (CLOUDFRONT_DOMAIN) {
    return `https://${CLOUDFRONT_DOMAIN}/${key}`
  }
  return `https://${S3_BUCKET}.s3.${S3_BUCKET_REGION}.amazonaws.com/${key}`
}

let cachedCloudFrontPrivateKey: string | null = null

function resolveCloudFrontPrivateKey(): string {
  if (cachedCloudFrontPrivateKey) {
    return cachedCloudFrontPrivateKey
  }

  let privateKey = ''

  if (CLOUDFRONT_PRIVATE_KEY_ENV) {
    privateKey = CLOUDFRONT_PRIVATE_KEY_ENV.includes('-----BEGIN')
      ? CLOUDFRONT_PRIVATE_KEY_ENV
      : CLOUDFRONT_PRIVATE_KEY_ENV.replace(/\\n/g, '\n')
  } else if (CLOUDFRONT_PRIVATE_KEY_PATH) {
    privateKey = readFileSync(CLOUDFRONT_PRIVATE_KEY_PATH, 'utf8')
  }

  if (!privateKey) {
    throw new Error('CloudFront private key is not configured. Set CLOUDFRONT_PRIVATE_KEY or CLOUDFRONT_PRIVATE_KEY_PATH.')
  }

  cachedCloudFrontPrivateKey = privateKey
  return cachedCloudFrontPrivateKey
}

export function generateSignedCloudFrontUrl(
  key: string,
  expiresInSeconds: number = 48 * 60 * 60
): string {
  if (!CLOUDFRONT_DOMAIN) {
    throw new Error('CloudFront domain is not configured. Set CLOUDFRONT_DOMAIN to generate signed URLs.')
  }

  if (!CLOUDFRONT_KEY_PAIR_ID) {
    throw new Error('CloudFront key pair ID is not configured. Set CLOUDFRONT_KEY_PAIR_ID to generate signed URLs.')
  }

  const privateKey = resolveCloudFrontPrivateKey()
  const url = `https://${CLOUDFRONT_DOMAIN}/${key}`
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds

  return getSignedCloudFrontUrl({
    url,
    keyPairId: CLOUDFRONT_KEY_PAIR_ID,
    privateKey,
    dateLessThan: new Date(expiresAt * 1000)
  })
}

// Get S3 URL (direct S3 access)
export function getS3Url(key: string): string {
  return `https://${S3_BUCKET}.s3.${S3_BUCKET_REGION}.amazonaws.com/${key}`
}

// Generate thumbnail key for images
export function generateThumbnailKey(originalKey: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
  const parts = originalKey.split('.')
  const extension = parts.pop()
  const baseName = parts.join('.')
  
  return `${baseName}_thumb_${size}.${extension}`
}

// Check if file is an image
export function isImageFile(contentType: string): boolean {
  return contentType.startsWith('image/')
}

// Get file size in human readable format
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

