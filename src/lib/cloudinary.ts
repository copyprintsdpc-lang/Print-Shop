// Cloudinary integration for image handling
// Handles product images, customer uploads, and file management

const CLOUDINARY_URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL || 'https://res.cloudinary.com/your-cloud-name'
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your-cloud-name'

export interface CloudinaryImage {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  tags: string[]
}

export interface CloudinaryUploadResponse {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  resource_type: string
  bytes: number
  created_at: string
  tags: string[]
}

// Generate optimized image URL with transformations
export function getOptimizedImageUrl(
  publicId: string,
  transformations: {
    width?: number
    height?: number
    quality?: 'auto' | number
    format?: 'auto' | 'webp' | 'jpg' | 'png'
    crop?: 'fill' | 'fit' | 'scale' | 'crop'
    gravity?: 'auto' | 'center' | 'face' | 'faces'
  } = {}
): string {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto'
  } = transformations

  let url = `${CLOUDINARY_URL}/image/upload/`
  
  // Add transformations
  const transforms = []
  if (width) transforms.push(`w_${width}`)
  if (height) transforms.push(`h_${height}`)
  transforms.push(`c_${crop}`)
  transforms.push(`g_${gravity}`)
  transforms.push(`q_${quality}`)
  transforms.push(`f_${format}`)
  
  if (transforms.length > 0) {
    url += transforms.join(',') + '/'
  }
  
  url += publicId
  
  return url
}

// Generate responsive image URLs for different screen sizes
export function getResponsiveImageUrls(publicId: string) {
  return {
    thumbnail: getOptimizedImageUrl(publicId, { width: 150, height: 150, crop: 'fill' }),
    small: getOptimizedImageUrl(publicId, { width: 300, height: 300, crop: 'fill' }),
    medium: getOptimizedImageUrl(publicId, { width: 600, height: 600, crop: 'fill' }),
    large: getOptimizedImageUrl(publicId, { width: 1200, height: 1200, crop: 'fill' }),
    original: getOptimizedImageUrl(publicId)
  }
}

// Generate product image URLs with specific dimensions
export function getProductImageUrls(publicId: string, productType: 'business-card' | 'flyer' | 'banner' | 'document' = 'business-card') {
  const dimensions = {
    'business-card': { width: 400, height: 250, crop: 'fill' as const },
    'flyer': { width: 300, height: 400, crop: 'fill' as const },
    'banner': { width: 800, height: 400, crop: 'fill' as const },
    'document': { width: 300, height: 400, crop: 'fill' as const }
  }

  const { width, height, crop } = dimensions[productType]

  return {
    thumbnail: getOptimizedImageUrl(publicId, { width: width * 0.5, height: height * 0.5, crop }),
    card: getOptimizedImageUrl(publicId, { width, height, crop }),
    gallery: getOptimizedImageUrl(publicId, { width: width * 1.5, height: height * 1.5, crop }),
    original: getOptimizedImageUrl(publicId)
  }
}

// Upload file to Cloudinary (for customer artwork uploads)
export async function uploadToCloudinary(
  file: File,
  folder: string = 'customer-uploads',
  tags: string[] = []
): Promise<CloudinaryUploadResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'your-upload-preset')
  formData.append('folder', folder)
  formData.append('tags', tags.join(','))

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    throw new Error('Failed to upload file to Cloudinary')
  }

  return await response.json()
}

// Delete file from Cloudinary
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/cloudinary/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ publicId })
    })

    return response.ok
  } catch (error) {
    console.error('Failed to delete file from Cloudinary:', error)
    return false
  }
}

// Generate placeholder image URL
export function getPlaceholderImageUrl(
  width: number = 400,
  height: number = 300,
  text: string = 'No Image'
): string {
  const encodedText = encodeURIComponent(text)
  return `https://via.placeholder.com/${width}x${height}/1f2937/ffffff?text=${encodedText}`
}

// Check if URL is a Cloudinary image
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com')
}

// Extract public ID from Cloudinary URL
export function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:[^\/]+\/)?(.+?)(?:\.[^.]+)?$/)
  return match ? match[1] : null
}

export default {
  getOptimizedImageUrl,
  getResponsiveImageUrls,
  getProductImageUrls,
  uploadToCloudinary,
  deleteFromCloudinary,
  getPlaceholderImageUrl,
  isCloudinaryUrl,
  extractPublicId
}
