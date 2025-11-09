import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/adminAuth'
import { generateS3Key, getCloudFrontUrl, uploadToS3 } from '@/lib/aws'

export async function POST(req: NextRequest) {
  try {
    const { admin, error } = await requireAdminAuth(req, 'products.update')
    if (error) return error

    const formData = await req.formData()
    const file = formData.get('file') as File
    const productId = formData.get('productId') as string
    const folder = (formData.get('folder') as string) || undefined

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

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const key = generateS3Key('products', file.name, folder || productId || undefined)
    const uploadResult = await uploadToS3(buffer, key, file.type || 'application/octet-stream', undefined, true)
    const url = getCloudFrontUrl(uploadResult.key)

    return NextResponse.json({
      ok: true,
      url,
      key: uploadResult.key,
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