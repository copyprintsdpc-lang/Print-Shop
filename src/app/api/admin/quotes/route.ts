import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import QuoteRequest from '@/models/QuoteRequest'

export const runtime = 'nodejs'

// GET /api/admin/quotes - Fetch all quotes with optional status filter
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get('status')

    // Build query
    const query: any = {}
    if (status && status !== 'all') {
      query.status = status
    }

    // Fetch quotes, sorted by newest first
    const quotes = await QuoteRequest.find(query)
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      ok: true,
      quotes: quotes.map((quote: any) => {
        const normalizedId =
          typeof quote._id === 'string'
            ? quote._id
            : typeof quote._id === 'object' && quote._id !== null && 'toString' in quote._id
              ? (quote._id as { toString: () => string }).toString()
              : ''
        return {
          ...quote,
          _id: normalizedId
        }
      })
    })

  } catch (error: any) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      {
        ok: false,
        message: error.message || 'Failed to fetch quotes'
      },
      { status: 500 }
    )
  }
}

