// Get product by slug API route
import { NextRequest, NextResponse } from 'next/server';
import { productAPI } from '@/lib/strapi';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Fetch products from Strapi
    const products = await productAPI.getAll();
    
    // Find product by slug
    const product = products.data.find(prod => prod.attributes.slug === slug);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Transform product for frontend
    const transformedProduct = {
      id: product.id,
      name: product.attributes.name,
      slug: product.attributes.slug,
      description: product.attributes.description,
      base_price: product.attributes.base_price,
      category: product.attributes.category?.data ? {
        name: product.attributes.category.data.attributes.name,
        slug: product.attributes.category.data.attributes.slug
      } : null,
      images: product.attributes.images?.data ? product.attributes.images.data.map(img => ({
        id: img.id,
        url: img.attributes.url,
        alternativeText: img.attributes.alternativeText
      })) : [],
      variants: product.attributes.variants?.data ? product.attributes.variants.data.map(variant => ({
        id: variant.id,
        size: variant.attributes.size,
        material: variant.attributes.material,
        finish: variant.attributes.finish,
        price: variant.attributes.price
      })) : [],
      featured: product.attributes.featured || false,
      popular: product.attributes.popular || false,
      specifications: product.attributes.specifications || [],
      features: product.attributes.features || []
    };

    return NextResponse.json(transformedProduct);

  } catch (error) {
    console.error('Product API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch product',
        success: false 
      },
      { status: 500 }
    );
  }
}
