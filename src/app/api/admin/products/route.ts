import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Product from '@/models/Product'
import { requireAdminAuth } from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  try {
    const { admin, error } = await requireAdminAuth(req, 'products.read')
    if (error) return error

    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const status = searchParams.get('status')

    const query: any = {}

    if (category) {
      query.category = category
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    if (status === 'active') {
      query.active = true
    } else if (status === 'inactive') {
      query.active = false
    } else if (status === 'featured') {
      query.featured = true
    }

    const skip = (page - 1) * limit
    const sort = { createdAt: -1 }

    const [products, total] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Product.countDocuments(query)
    ])

    return NextResponse.json({
      ok: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Admin products GET error:', error)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { admin, error } = await requireAdminAuth(req, 'products.create')
    if (error) return error

    const body = await req.json()
    const {
      name,
      description,
      category,
      basePrice,
      sameDayEligible,
      sameDayCutoff,
      featured,
      active,
      variants,
      metaTitle,
      metaDescription,
      tags,
      weight,
      dimensions
    } = body

    if (!name || !description || !category || basePrice === undefined) {
      return NextResponse.json(
        { ok: false, code: 'missing_fields', message: 'Required fields are missing' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')

    // Check if slug already exists
    let finalSlug = slug
    let counter = 1
    while (await Product.findOne({ slug: finalSlug })) {
      finalSlug = `${slug}-${counter}`
      counter++
    }

    const product = new Product({
      name,
      slug: finalSlug,
      description,
      category,
      images: [], // Will be updated when images are uploaded
      basePrice,
      pricingMethod: 'flat',
      sameDayEligible: sameDayEligible || false,
      sameDayCutoff: sameDayCutoff || '12:00',
      variants: variants || [],
      options: [],
      pricingTiers: [],
      featured: featured || false,
      active: active !== undefined ? active : true,
      metaTitle,
      metaDescription,
      tags: tags || [],
      weight: weight || 0,
      dimensions: dimensions || { length: 0, width: 0, height: 0 }
    })

    await product.save()

    return NextResponse.json({
      ok: true,
      product,
      message: 'Product created successfully'
    })
  } catch (error) {
    console.error('Admin products POST error:', error)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}