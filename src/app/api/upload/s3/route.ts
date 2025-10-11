import { NextRequest, NextResponse } from 'next/server'
import { 
  uploadToS3, 
  generatePresignedUploadUrl, 
  generateS3Key, 
  validateFile,
  S3Error,
  S3_BUCKET,
  UPLOAD_FOLDER
} from '@/lib/aws'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string || 'uploads'
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

    // Validate file
    const validation = validateFile(buffer, file.type, file.name)
    if (!validation.valid) {
      return NextResponse.json(
        { ok: false, code: 'validation_error', message: validation.error },
        { status: 400 }
      )
    }

    // Generate S3 key
    const key = generateS3Key(type as any, file.name, isPublic ? 'public' : undefined)

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
      }
    })
  } catch (error) {
    console.error('S3 Upload Error:', error)
    
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const filename = searchParams.get('filename')
    const contentType = searchParams.get('contentType')
    const type = searchParams.get('type') || 'uploads'
    const isPublic = searchParams.get('isPublic') === 'true'
    const expiresIn = parseInt(searchParams.get('expiresIn') || '3600')

    if (!filename || !contentType) {
      return NextResponse.json(
        { ok: false, code: 'missing_params', message: 'Filename and contentType are required' },
        { status: 400 }
      )
    }

    // Generate S3 key
    const key = generateS3Key(type as any, filename, isPublic ? 'public' : undefined)

    // Generate presigned URL
    const result = await generatePresignedUploadUrl(key, contentType, expiresIn, S3_BUCKET, isPublic)

    return NextResponse.json({
      ok: true,
      uploadUrl: result.uploadUrl,
      key: result.key,
      expiresAt: result.expiresAt
    })
  } catch (error) {
    console.error('Presigned URL Error:', error)
    
    if (error instanceof S3Error) {
      return NextResponse.json(
        { ok: false, code: error.code, message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { ok: false, code: 'presigned_url_error', message: 'Failed to generate presigned URL' },
      { status: 500 }
    )
  }
}
