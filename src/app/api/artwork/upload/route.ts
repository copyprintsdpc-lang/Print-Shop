import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'sdpc-print-media'
    const type = formData.get('type') as string || 'artwork'

    if (!file) {
      return NextResponse.json(
        { ok: false, code: 'no_file', message: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { ok: false, code: 'file_too_large', message: 'File size exceeds 50MB limit' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/tiff',
      'application/pdf',
      'application/zip',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { ok: false, code: 'invalid_file_type', message: 'File type not supported' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Determine resource type
    let resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto'
    if (file.type.startsWith('image/')) {
      resourceType = 'image'
    } else if (file.type.startsWith('video/')) {
      resourceType = 'video'
    } else {
      resourceType = 'raw'
    }

    // Generate unique public ID
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 15)
    const publicId = `${type}/${timestamp}_${randomId}`

    // Upload to Cloudinary
    const result = await uploadToCloudinary(buffer, {
      folder,
      resourceType,
      publicId,
      tags: [type, 'sdpc-print-media'],
      transformation: resourceType === 'image' ? {
        quality: 'auto',
        fetch_format: 'auto'
      } : undefined
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
      message: 'File uploaded successfully'
    })

  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}