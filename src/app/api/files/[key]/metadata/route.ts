import { NextRequest, NextResponse } from 'next/server'
import { getFileMetadata, S3Error } from '@/lib/aws'

export async function GET(
  req: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const key = decodeURIComponent(params.key)
    
    const metadata = await getFileMetadata(key)

    return NextResponse.json({
      ok: true,
      metadata: {
        key,
        size: metadata.size,
        contentType: metadata.contentType,
        lastModified: metadata.lastModified,
        etag: metadata.etag,
        metadata: metadata.metadata
      }
    })
  } catch (error) {
    console.error('File metadata error:', error)
    
    if (error instanceof S3Error) {
      return NextResponse.json(
        { ok: false, code: error.code, message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { ok: false, code: 'metadata_error', message: 'Failed to get file metadata' },
      { status: 500 }
    )
  }
}
