import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { requireAdminAuth } from '@/lib/adminAuth'

export async function POST(req: NextRequest) {
  try {
    const { admin, error } = await requireAdminAuth(req, 'products.update')
    if (error) return error

    const formData = await req.formData()
    const file = formData.get('file') as File
    const productId = formData.get('productId') as string
    const folder = formData.get('folder') as string || 'sdpc-print-media/products'

    if (!file) {
      return NextResponse.json(
        { ok: false, code: 'no_file', message: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size (10MB max for product images)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { ok: false, code: 'file_too_large', message: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Validate file type (only images for products)
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { ok: false, code: 'invalid_file_type', message: 'Only image files are allowed for products' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique public ID
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 15)
    const publicId = productId ? `products/${productId}_${timestamp}` : `products/${timestamp}_${randomId}`

    // Upload to Cloudinary with image optimizations
    const result = await uploadToCloudinary(buffer, {
      folder,
      resourceType: 'image',
      publicId,
      tags: ['product', 'sdpc-print-media'],
      transformation: {
        quality: 'auto',
        fetch_format: 'auto',
        width: 800,
        height: 600,
        crop: 'fit'
      }
    })

    if (!result.success) {
      return NextResponse.json(
        { ok: false, code: 'upload_failed', message: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      url: result.url,
      publicId: result.publicId,
      message: 'Product image uploaded successfully'
    })

  } catch (error) {
    console.error('Product image upload error:', error)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}