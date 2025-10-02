import { v2 as cloudinary } from 'cloudinary'
import { config } from './config'

// Configure Cloudinary
if (config.cloudinary.url) {
  // Use CLOUDINARY_URL if available (recommended)
  cloudinary.config()
} else {
  // Fallback to individual credentials
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure: config.cloudinary.secure,
  })
}

export interface UploadResult {
  success: boolean
  url?: string
  publicId?: string
  error?: string
}

export interface UploadOptions {
  folder?: string
  resourceType?: 'image' | 'video' | 'raw' | 'auto'
  transformation?: any
  tags?: string[]
  publicId?: string
}

/**
 * Upload a file to Cloudinary
 */
export async function uploadToCloudinary(
  file: Buffer | string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  try {
    const {
      folder = 'sdpc-print-media',
      resourceType = 'auto',
      transformation,
      tags = [],
      publicId
    } = options

    const uploadOptions: any = {
      folder,
      resource_type: resourceType,
      tags,
      overwrite: true,
      invalidate: true,
    }

    if (transformation) {
      uploadOptions.transformation = transformation
    }

    if (publicId) {
      uploadOptions.public_id = publicId
    }

    let result
    if (typeof file === 'string') {
      // Upload from URL
      result = await cloudinary.uploader.upload(file, uploadOptions)
    } else {
      // Upload from buffer
      result = await cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) throw error
        return result
      }).end(file)
    }

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

/**
 * Delete a file from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    
    if (result.result === 'ok') {
      return { success: true }
    } else {
      return {
        success: false,
        error: `Failed to delete: ${result.result}`
      }
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed'
    }
  }
}

/**
 * Generate a signed upload URL for client-side uploads
 */
export function generateSignedUploadUrl(options: UploadOptions = {}): string {
  const {
    folder = 'sdpc-print-media',
    resourceType = 'auto',
    tags = [],
    publicId
  } = options

  const uploadOptions: any = {
    folder,
    resource_type: resourceType,
    tags,
    overwrite: true,
  }

  if (publicId) {
    uploadOptions.public_id = publicId
  }

  return cloudinary.utils.api_sign_request(
    uploadOptions,
    config.cloudinary.apiSecret
  )
}

/**
 * Generate optimized image URL with transformations
 */
export function getOptimizedImageUrl(
  publicId: string,
  transformations: any = {}
): string {
  const defaultTransformations = {
    quality: 'auto',
    fetch_format: 'auto',
    ...transformations
  }

  return cloudinary.url(publicId, {
    ...defaultTransformations,
    secure: true
  })
}

/**
 * Generate Cloudinary upload widget configuration
 */
export function getUploadWidgetConfig(options: {
  folder?: string
  resourceType?: 'image' | 'video' | 'raw' | 'auto'
  maxFiles?: number
  maxFileSize?: number
  allowedFormats?: string[]
  onUploadSuccess?: (result: any) => void
  onUploadError?: (error: any) => void
}) {
  const {
    folder = 'sdpc-print-media',
    resourceType = 'auto',
    maxFiles = 10,
    maxFileSize = 50000000, // 50MB
    allowedFormats = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'zip'],
    onUploadSuccess,
    onUploadError
  } = options

  return {
    cloudName: config.cloudinary.cloudName,
    uploadPreset: config.cloudinary.uploadPreset,
    folder,
    resourceType,
    maxFiles,
    maxFileSize,
    allowedFormats,
    cropping: false,
    showAdvancedOptions: false,
    showSkipButton: false,
    showPoweredBy: false,
    theme: 'minimal',
    styles: {
      palette: {
        window: '#F16E02',
        windowBorder: '#F16E02',
        tabIcon: '#FFFFFF',
        menuIcons: '#F16E02',
        textDark: '#000000',
        textLight: '#FFFFFF',
        link: '#F16E02',
        action: '#F16E02',
        inactiveTabIcon: '#F16E02',
        error: '#F16E02',
        inProgress: '#F16E02',
        complete: '#F16E02',
        sourceBg: '#F16E02'
      },
      fonts: {
        default: null,
        "'Inter', sans-serif": {
          url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
          active: true
        }
      }
    },
    onUploadSuccess,
    onUploadError
  }
}

export default cloudinary
