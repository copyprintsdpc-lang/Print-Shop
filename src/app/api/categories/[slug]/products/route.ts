// Get products for category API route
import { NextRequest, NextResponse } from 'next/server';
import { productAPI } from '@/lib/strapi';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Fetch products from Strapi with category filter
    const products = await productAPI.getAll();
    
    // Filter products by category slug
    const categoryProducts = products.data.filter(product => 
      product.attributes.category?.data?.attributes?.slug === slug
    );

    // Transform products for frontend
    const transformedProducts = categoryProducts.map(product => ({
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
      popular: product.attributes.popular || false
    }));

    return NextResponse.json(transformedProducts);

  } catch (error) {
    console.error('Category products API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch category products',
        success: false 
      },
      { status: 500 }
    );
  }
}
