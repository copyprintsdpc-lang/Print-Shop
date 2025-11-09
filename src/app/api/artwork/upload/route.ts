import { NextRequest, NextResponse } from 'next/server'

import { generatePresignedDownloadUrl, generateS3Key, generateSignedCloudFrontUrl, uploadToS3, getCloudFrontUrl } from '@/lib/aws'

export const runtime = 'nodejs'

const MAX_UPLOAD_SIZE = 100 * 1024 * 1024 // 100MB

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
])

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const type = (formData.get('type') as string) || 'uploads'
    const subfolder = formData.get('subfolder') as string | null

    if (!file) {
      return NextResponse.json(
        { ok: false, code: 'no_file', message: 'No file provided' },
        { status: 400 }
      )
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json(
        { ok: false, code: 'file_too_large', message: 'File size exceeds 100MB limit' },
        { status: 400 }
      )
    }

    if (file.type && !ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { ok: false, code: 'unsupported_type', message: `File type ${file.type} is not supported` },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const folderMap = {
      quotes: 'quotes',
      artwork: 'artwork',
      products: 'products',
      uploads: 'uploads',
      public: 'public',
      admin: 'admin'
    } as const

    const targetFolder = folderMap[type as keyof typeof folderMap] ?? 'uploads'
    const key = generateS3Key(targetFolder, file.name, subfolder || undefined)

    const uploadResult = await uploadToS3(
      buffer,
      key,
      file.type || 'application/octet-stream',
      undefined,
      false
    )

    let signedUrl: string | null = null
    try {
      signedUrl = generateSignedCloudFrontUrl(uploadResult.key, 60 * 60) // 1 hour
    } catch (error) {
      console.warn('Failed to generate CloudFront signed URL, falling back to S3 presigned URL.', error)
      const presigned = await generatePresignedDownloadUrl(uploadResult.key, 60 * 60)
      signedUrl = presigned.downloadUrl
    }

    const permanentUrl = getCloudFrontUrl(uploadResult.key)

    return NextResponse.json({
      ok: true,
      file: {
        key: uploadResult.key,
        url: permanentUrl,
        previewUrl: signedUrl,
        name: file.name,
        type: file.type,
        size: file.size,
        hash: uploadResult.hash
      },
      key: uploadResult.key,
      url: permanentUrl,
      previewUrl: signedUrl,
      message: 'File uploaded successfully'
    })
  } catch (error) {
    console.error('S3 upload error:', error)
    return NextResponse.json(
      { ok: false, code: 'upload_error', message: 'Failed to upload file' },
      { status: 500 }
    )
  }
}