import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Product from '@/models/Product'
import Promotion from '@/models/Promotion'

export const runtime = 'nodejs'

// GET /api/products/[slug] - Get single product by slug
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug

    if (!slug) {
      return NextResponse.json(
        { ok: false, code: 'bad_request', message: 'Product slug is required' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const product = await Product.findOne({ slug, active: true })
      .select('-__v')
      .lean()
    
    if (!product) {
      return NextResponse.json(
        { ok: false, code: 'not_found', message: 'Product not found' },
        { status: 404 }
      )
    }

    // Alias for typed access
    const p = product as any

    // Get applicable promotions
    const now = new Date()
    const promotions = await Promotion.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
      $or: [
        { applicableProducts: p._id },
        { applicableCategories: p.category }
      ]
    }).lean()

    // Apply best promotion
    let productWithPromotion = product
    if (promotions.length > 0) {
      const bestPromo = promotions.reduce((best, current) => 
        current.discount > best.discount ? current : best
      )
      
      let discountAmount = 0
      if (bestPromo.discountType === 'percentage') {
        discountAmount = (p.basePrice * bestPromo.discount) / 100
      } else {
        discountAmount = bestPromo.discount
      }

      productWithPromotion = {
        ...p,
        promotion: {
          title: bestPromo.title,
          discount: bestPromo.discount,
          discountType: bestPromo.discountType,
          originalPrice: p.basePrice,
          discountedPrice: Math.max(0, p.basePrice - discountAmount)
        }
      }
    }

    // Get related products
    const relatedProducts = await Product.find({
      category: p.category,
      _id: { $ne: p._id },
      active: true
    })
      .select('_id name slug images basePrice variants')
      .limit(4)
      .lean()

    return NextResponse.json({
      ok: true,
      product: productWithPromotion,
      relatedProducts
    })
  } catch (err) {
    console.error('Product GET error:', err)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

