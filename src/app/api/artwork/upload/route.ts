import { NextRequest, NextResponse } from 'next/server'
import { 
  uploadToS3, 
  generateS3Key, 
  validateFile, 
  S3Error,
  S3_BUCKET 
} from '@/lib/aws'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string || 'artwork'
    const isPublic = formData.get('isPublic') === 'true'

    if (!file) {
      return NextResponse.json(
        { ok: false, code: 'no_file', message: 'No file provided' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Validate file using S3 validation
    const validation = validateFile(buffer, file.type, file.name)
    if (!validation.valid) {
      return NextResponse.json(
        { ok: false, code: 'validation_error', message: validation.error },
        { status: 400 }
      )
    }

    // Generate S3 key
    const key = generateS3Key('artwork', file.name, isPublic ? 'public' : undefined)

    // Upload to S3
    const result = await uploadToS3(buffer, key, file.type, S3_BUCKET, isPublic)

    return NextResponse.json({
      ok: true,
      file: {
        url: result.url,
        key: result.key,
        size: result.size,
        hash: result.hash,
        name: file.name,
        type: file.type
      },
      message: 'File uploaded successfully'
    })

  } catch (error) {
    console.error('S3 Artwork upload error:', error)
    
    if (error instanceof S3Error) {
      return NextResponse.json(
        { ok: false, code: error.code, message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { ok: false, code: 'upload_error', message: 'Failed to upload file' },
      { status: 500 }
    )
  }
}