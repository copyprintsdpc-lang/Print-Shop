import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Product from '@/models/Product'
import { requireAdminAuth } from '@/lib/adminAuth'
import mongoose from 'mongoose'

export const runtime = 'nodejs'

// GET /api/admin/products/[id] - Get single product
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { admin, error } = await requireAdminAuth(req, 'products.read')
    if (error) return error

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { ok: false, code: 'bad_request', message: 'Invalid product ID' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const product = await Product.findById(params.id)
    if (!product) {
      return NextResponse.json(
        { ok: false, code: 'not_found', message: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ok: true,
      product
    })
  } catch (err) {
    console.error('Admin product GET error:', err)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/products/[id] - Update product
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { admin, error } = await requireAdminAuth(req, 'products.update')
    if (error) return error

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { ok: false, code: 'bad_request', message: 'Invalid product ID' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const {
      name,
      description,
      category,
      images,
      basePrice,
      pricingMethod,
      variants,
      options,
      pricingTiers,
      areaPricing,
      sameDayEligible,
      sameDayCutoff,
      featured,
      active,
      metaTitle,
      metaDescription,
      promotion
    } = body

    await connectToDatabase()

    const product = await Product.findById(params.id)
    if (!product) {
      return NextResponse.json(
        { ok: false, code: 'not_found', message: 'Product not found' },
        { status: 404 }
      )
    }

    // Update slug if name changed
    let slug = product.slug
    if (name && name !== product.name) {
      slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      
      // Check if new slug already exists
      const existingProduct = await Product.findOne({ slug, _id: { $ne: params.id } })
      if (existingProduct) {
        return NextResponse.json(
          { ok: false, code: 'conflict', message: 'Product with this name already exists' },
          { status: 409 }
        )
      }
    }

    // Update fields
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (category !== undefined) updateData.category = category
    if (images !== undefined) updateData.images = images
    if (basePrice !== undefined) updateData.basePrice = basePrice
    if (pricingMethod !== undefined) updateData.pricingMethod = pricingMethod
    if (variants !== undefined) updateData.variants = variants
    if (options !== undefined) updateData.options = options
    if (pricingTiers !== undefined) updateData.pricingTiers = pricingTiers
    if (areaPricing !== undefined) updateData.areaPricing = areaPricing
    if (sameDayEligible !== undefined) updateData.sameDayEligible = sameDayEligible
    if (sameDayCutoff !== undefined) updateData.sameDayCutoff = sameDayCutoff
    if (featured !== undefined) updateData.featured = featured
    if (active !== undefined) updateData.active = active
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription
    if (promotion !== undefined) updateData.promotion = promotion
    if (slug !== product.slug) updateData.slug = slug

    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    )

    return NextResponse.json({
      ok: true,
      product: updatedProduct,
      message: 'Product updated successfully'
    })
  } catch (err) {
    console.error('Admin product PUT error:', err)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/products/[id] - Delete product
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { admin, error } = await requireAdminAuth(req, 'products.delete')
    if (error) return error

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { ok: false, code: 'bad_request', message: 'Invalid product ID' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const product = await Product.findById(params.id)
    if (!product) {
      return NextResponse.json(
        { ok: false, code: 'not_found', message: 'Product not found' },
        { status: 404 }
      )
    }

    await Product.findByIdAndDelete(params.id)

    return NextResponse.json({
      ok: true,
      message: 'Product deleted successfully'
    })
  } catch (err) {
    console.error('Admin product DELETE error:', err)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

