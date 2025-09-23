// Get category by slug API route
import { NextRequest, NextResponse } from 'next/server';
import { categoryAPI } from '@/lib/strapi';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Fetch category from Strapi
    const categories = await categoryAPI.getAll();
    const category = categories.data.find(cat => cat.attributes.slug === slug);

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: category.id,
      name: category.attributes.name,
      slug: category.attributes.slug,
      description: category.attributes.description,
      image: category.attributes.image?.data ? {
        url: category.attributes.image.data.attributes.url,
        alternativeText: category.attributes.image.data.attributes.alternativeText
      } : null
    });

  } catch (error) {
    console.error('Category API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch category',
        success: false 
      },
      { status: 500 }
    );
  }
}
