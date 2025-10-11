import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import User from '@/models/User'
import { requireAdminAuth } from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  try {
    const { admin, error } = await requireAdminAuth(req, 'users.read')
    if (error) return error

    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const role = searchParams.get('role')

    const query: any = {}

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } }
      ]
    }

    if (status === 'verified') {
      query.isVerified = true
    } else if (status === 'unverified') {
      query.isVerified = false
    }

    if (role) {
      query.role = role
    }

    const skip = (page - 1) * limit
    const sort: Record<string, 1 | -1> = { createdAt: -1 }

    const [customers, total] = await Promise.all([
      User.find(query).sort(sort).skip(skip).limit(limit).lean(),
      User.countDocuments(query)
    ])

    // Get order statistics for each customer
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        // This would require an Order model - for now we'll return basic info
        return {
          ...customer,
          orderCount: 0, // Would be calculated from orders
          totalSpent: 0  // Would be calculated from orders
        }
      })
    )

    return NextResponse.json({
      ok: true,
      customers: customersWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Admin customers GET error:', error)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
