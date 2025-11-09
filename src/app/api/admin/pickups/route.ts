import { NextRequest, NextResponse } from 'next/server'

import { connectToDatabase } from '@/lib/db'
import PickupRequest from '@/models/PickupRequest'
import { requireAdminAuth } from '@/lib/adminAuth'
import { generateSignedCloudFrontUrl, getCloudFrontUrl, generatePresignedDownloadUrl } from '@/lib/aws'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const authResult = await requireAdminAuth(req, 'orders.read')
  if (authResult.error) return authResult.error

  try {
    await connectToDatabase()

    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get('status')

    const query: Record<string, any> = {}
    if (status && ['new', 'printed', 'collected'].includes(status)) {
      query.status = status
    }

    const pickups = await PickupRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()

    const hydrated = await Promise.all(
      pickups.map(async (pickup: any) => {
        const files = await Promise.all(
          (pickup.files || []).map(async (file: any) => {
            let downloadUrl = file.url || (file.key ? getCloudFrontUrl(file.key) : null)

            if (file.key) {
              try {
                downloadUrl = generateSignedCloudFrontUrl(file.key, 60 * 60)
              } catch (error) {
                console.warn('Failed to generate CloudFront URL for pickup list, attempting S3 presign', error)
                const presigned = await generatePresignedDownloadUrl(file.key, 60 * 60)
                downloadUrl = presigned.downloadUrl
              }
            }

            return {
              ...file,
              downloadUrl,
            }
          })
        )

        return {
          ...pickup,
          _id: pickup._id.toString(),
          files,
        }
      })
    )

    return NextResponse.json({
      ok: true,
      pickups: hydrated,
    })
  } catch (error: any) {
    console.error('Failed to list pickups:', error)
    return NextResponse.json(
      { ok: false, message: error.message || 'Failed to load pickup requests' },
      { status: 500 }
    )
  }
}

