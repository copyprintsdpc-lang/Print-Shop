import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config()

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { ok: false, message: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { ok: false, message: 'File size exceeds 50MB limit' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
      'image/gif',
      'application/pdf',
      'application/zip'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { ok: false, message: 'File type not supported' },
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
    const publicId = `test-uploads/${timestamp}_${randomId}`

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'test-uploads',
          resource_type: resourceType,
          public_id: publicId,
          tags: ['test-upload', 'cloudinary-test'],
          transformation: resourceType === 'image' ? {
            quality: 'auto',
            fetch_format: 'auto'
          } : undefined
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    if (!result) {
      return NextResponse.json(
        { ok: false, message: 'Upload failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      url: (result as any).secure_url,
      publicId: (result as any).public_id,
      message: 'File uploaded successfully'
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { ok: false, message: 'Something went wrong' },
      { status: 500 }
    )
  }
}