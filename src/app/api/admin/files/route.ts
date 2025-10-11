import { NextRequest, NextResponse } from 'next/server'
import { 
  listFiles, 
  deleteFromS3, 
  getFileMetadata, 
  fileExists,
  S3Error 
} from '@/lib/aws'
import { requireAdminAuth } from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  try {
    const { admin, error } = await requireAdminAuth(req, 'files.read')
    if (error) return error

    const { searchParams } = new URL(req.url)
    const prefix = searchParams.get('prefix') || ''
    const maxKeys = parseInt(searchParams.get('maxKeys') || '100')

    const files = await listFiles(prefix, undefined, maxKeys)

    return NextResponse.json({
      ok: true,
      files: files.map(file => ({
        key: file.key,
        size: file.size,
        lastModified: file.lastModified,
        etag: file.etag,
        url: `https://${process.env.CLOUDFRONT_DOMAIN || process.env.S3_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${file.key}`
      }))
    })
  } catch (error) {
    console.error('Admin files list error:', error)
    
    if (error instanceof S3Error) {
      return NextResponse.json(
        { ok: false, code: error.code, message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { ok: false, code: 'list_error', message: 'Failed to list files' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { admin, error } = await requireAdminAuth(req, 'files.delete')
    if (error) return error

    const { searchParams } = new URL(req.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json(
        { ok: false, code: 'missing_key', message: 'File key is required' },
        { status: 400 }
      )
    }

    // Check if file exists
    const exists = await fileExists(key)
    if (!exists) {
      return NextResponse.json(
        { ok: false, code: 'file_not_found', message: 'File not found' },
        { status: 404 }
      )
    }

    await deleteFromS3(key)

    return NextResponse.json({
      ok: true,
      message: 'File deleted successfully'
    })
  } catch (error) {
    console.error('Admin file delete error:', error)
    
    if (error instanceof S3Error) {
      return NextResponse.json(
        { ok: false, code: error.code, message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { ok: false, code: 'delete_error', message: 'Failed to delete file' },
      { status: 500 }
    )
  }
}
