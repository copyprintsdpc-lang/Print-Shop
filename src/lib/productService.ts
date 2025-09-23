// Product service that integrates with Strapi API
// Falls back to hardcoded data if Strapi is unavailable

import { productAPI, categoryAPI, variantAPI, strapiUtils } from './strapi';
import { products, Product, getProductBySlug, getProductsByCategory, getAllProducts } from './products';

// Transform Strapi product data to match our Product interface
function transformStrapiProduct(strapiProduct: any): Product {
  return {
    id: strapiProduct.id.toString(),
    name: strapiProduct.attributes.name,
    slug: strapiProduct.attributes.slug,
    description: strapiProduct.attributes.description,
    category: strapiProduct.attributes.category?.data?.attributes?.slug || 'custom',
    images: strapiProduct.attributes.images?.data?.map((img: any) => 
      strapiUtils.getImageUrl({ data: img })
    ) || ['/placeholder-image.jpg'],
    basePrice: strapiProduct.attributes.basePrice || 0,
    pricingMethod: strapiProduct.attributes.pricingMethod || 'flat',
    sameDayEligible: strapiProduct.attributes.sameDayEligible || false,
    sameDayCutoff: strapiProduct.attributes.sameDayCutoff || '17:00',
    options: strapiProduct.attributes.options || [],
    pricingTiers: strapiProduct.attributes.pricingTiers || [],
    areaPricing: strapiProduct.attributes.areaPricing,
    active: strapiProduct.attributes.active !== false,
  };
}

// Transform Strapi category data
function transformStrapiCategory(strapiCategory: any) {
  return {
    id: strapiCategory.id.toString(),
    name: strapiCategory.attributes.name,
    slug: strapiCategory.attributes.slug,
    description: strapiCategory.attributes.description,
    image: strapiCategory.attributes.image?.data ? 
      strapiUtils.getImageUrl({ data: strapiCategory.attributes.image.data }) : 
      '/placeholder-image.jpg',
    sortOrder: strapiCategory.attributes.sortOrder || 0,
    active: strapiCategory.attributes.active !== false,
  };
}

// Product service with Strapi integration
export const productService = {
  // Get all products (Strapi first, fallback to hardcoded)
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await productAPI.getAll();
      if (response.data && response.data.length > 0) {
        return response.data.map(transformStrapiProduct);
      }
    } catch (error) {
      console.warn('Strapi API unavailable, using fallback data:', error);
    }
    
    // Fallback to hardcoded data
    return getAllProducts();
  },

  // Get products by category
  async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    try {
      const response = await productAPI.getByCategory(categorySlug);
      if (response.data && response.data.length > 0) {
        return response.data.map(transformStrapiProduct);
      }
    } catch (error) {
      console.warn('Strapi API unavailable, using fallback data:', error);
    }
    
    // Fallback to hardcoded data
    return getProductsByCategory(categorySlug);
  },

  // Get product by slug
  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const response = await productAPI.getBySlug(slug);
      if (response.data && response.data.length > 0) {
        return transformStrapiProduct(response.data[0]);
      }
    } catch (error) {
      console.warn('Strapi API unavailable, using fallback data:', error);
    }
    
    // Fallback to hardcoded data
    return getProductBySlug(slug) || null;
  },

  // Get product by ID
  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await productAPI.getById(id);
      if (response.data) {
        return transformStrapiProduct(response.data);
      }
    } catch (error) {
      console.warn('Strapi API unavailable, using fallback data:', error);
    }
    
    // Fallback to hardcoded data
    return products.find(p => p.id === id) || null;
  },

  // Get all categories
  async getAllCategories() {
    try {
      const response = await categoryAPI.getAll();
      if (response.data && response.data.length > 0) {
        return response.data.map(transformStrapiCategory);
      }
    } catch (error) {
      console.warn('Strapi API unavailable, using fallback categories:', error);
    }
    
    // Fallback categories
    return [
      { id: '1', name: 'Documents', slug: 'documents', description: 'Document printing services', image: '/images/documents-hero.svg', sortOrder: 1, active: true },
      { id: '2', name: 'Business Cards', slug: 'business-cards', description: 'Professional business cards', image: '/images/doc-card-1.svg', sortOrder: 2, active: true },
      { id: '3', name: 'Banners & Posters', slug: 'posters-banners', description: 'Large format printing', image: '/images/banners.jpg', sortOrder: 3, active: true },
      { id: '4', name: 'Stickers & Labels', slug: 'stickers-labels', description: 'Custom stickers and labels', image: '/images/stickers.jpg', sortOrder: 4, active: true },
    ];
  },

  // Get product variants (from Strapi)
  async getProductVariants(productId: string) {
    try {
      const response = await variantAPI.getByProduct(productId);
      return response.data || [];
    } catch (error) {
      console.warn('Strapi API unavailable for variants:', error);
      return [];
    }
  },

  // Check if Strapi is available
  async isStrapiAvailable(): Promise<boolean> {
    try {
      await productAPI.getAll();
      return true;
    } catch (error) {
      return false;
    }
  },
};

export default productService;
