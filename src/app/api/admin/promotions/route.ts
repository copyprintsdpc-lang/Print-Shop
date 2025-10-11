import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Promotion from '@/models/Promotion'
import { requireAdminAuth } from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  try {
    const { admin, error } = await requireAdminAuth(req, 'promotions.read')
    if (error) return error

    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const query: any = {}

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    const skip = (page - 1) * limit
    const sort: Record<string, 1 | -1> = { createdAt: -1 }

    const [promotions, total] = await Promise.all([
      Promotion.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Promotion.countDocuments(query)
    ])

    return NextResponse.json({
      ok: true,
      promotions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Admin promotions GET error:', error)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { admin, error } = await requireAdminAuth(req, 'promotions.create')
    if (error) return error

    const body = await req.json()
    const {
      title,
      description,
      discount,
      discountType,
      startDate,
      endDate,
      applicableProducts,
      applicableCategories,
      minOrderAmount,
      maxDiscountAmount,
      usageLimit,
      isActive
    } = body

    if (!title || !discount || !startDate || !endDate) {
      return NextResponse.json(
        { ok: false, code: 'missing_fields', message: 'Required fields are missing' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const promotion = new Promotion({
      title,
      description,
      discount,
      discountType: discountType || 'percentage',
      start_date: new Date(startDate),
      end_date: new Date(endDate),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      applicableProducts: applicableProducts || [],
      applicableCategories: applicableCategories || [],
      minOrderAmount,
      maxDiscountAmount,
      usageLimit,
      isActive: isActive !== undefined ? isActive : true,
      usedCount: 0
    })

    await promotion.save()

    return NextResponse.json({
      ok: true,
      promotion,
      message: 'Promotion created successfully'
    })
  } catch (error) {
    console.error('Admin promotions POST error:', error)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}