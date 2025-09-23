// Strapi API integration for Next.js frontend

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiCollectionResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Generic API fetch function
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${STRAPI_URL}/api${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Strapi API Error:', error);
    throw error;
  }
}

// Category API
export const categoryAPI = {
  async getAll(): Promise<StrapiCollectionResponse<any>> {
    return fetchAPI('/categories?populate=*&sort=sortOrder:asc');
  },
  
  async getBySlug(slug: string): Promise<StrapiResponse<any>> {
    return fetchAPI(`/categories?filters[slug][$eq]=${slug}&populate=*`);
  },
};

// Product API
export const productAPI = {
  async getAll(): Promise<StrapiCollectionResponse<any>> {
    return fetchAPI('/products?populate=*&sort=sortOrder:asc');
  },
  
  async getByCategory(categorySlug: string): Promise<StrapiCollectionResponse<any>> {
    return fetchAPI(`/products?filters[category][slug][$eq]=${categorySlug}&populate=*&sort=sortOrder:asc`);
  },
  
  async getBySlug(slug: string): Promise<StrapiResponse<any>> {
    return fetchAPI(`/products?filters[slug][$eq]=${slug}&populate=*`);
  },
  
  async getById(id: string): Promise<StrapiResponse<any>> {
    return fetchAPI(`/products/${id}?populate=*`);
  },
};

// Product Variant API
export const variantAPI = {
  async getByProduct(productId: string): Promise<StrapiCollectionResponse<any>> {
    return fetchAPI(`/product-variants?filters[product][id][$eq]=${productId}&populate=*`);
  },
  
  async getById(id: string): Promise<StrapiResponse<any>> {
    return fetchAPI(`/product-variants/${id}?populate=*`);
  },
};

// Order API
export const orderAPI = {
  async create(orderData: any): Promise<StrapiResponse<any>> {
    return fetchAPI('/orders', {
      method: 'POST',
      body: JSON.stringify({ data: orderData }),
    });
  },
  
  async getByCustomer(customerId: string): Promise<StrapiCollectionResponse<any>> {
    return fetchAPI(`/orders?filters[customer][id][$eq]=${customerId}&populate=*&sort=createdAt:desc`);
  },
  
  async getById(id: string): Promise<StrapiResponse<any>> {
    return fetchAPI(`/orders/${id}?populate=*`);
  },
  
  async updateStatus(id: string, status: string): Promise<StrapiResponse<any>> {
    return fetchAPI(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: { status } }),
    });
  },
};

// Order File API
export const orderFileAPI = {
  async uploadFile(fileData: any): Promise<StrapiResponse<any>> {
    return fetchAPI('/order-files', {
      method: 'POST',
      body: JSON.stringify({ data: fileData }),
    });
  },
  
  async getByOrder(orderId: string): Promise<StrapiCollectionResponse<any>> {
    return fetchAPI(`/order-files?filters[order][id][$eq]=${orderId}&populate=*`);
  },
  
  async updateStatus(id: string, status: string): Promise<StrapiResponse<any>> {
    return fetchAPI(`/order-files/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: { status } }),
    });
  },
};

// Page API
export const pageAPI = {
  async getAll(): Promise<StrapiCollectionResponse<any>> {
    return fetchAPI('/pages?populate=*&sort=sortOrder:asc');
  },
  
  async getBySlug(slug: string): Promise<StrapiResponse<any>> {
    return fetchAPI(`/pages?filters[slug][$eq]=${slug}&populate=*`);
  },
  
  async getByType(type: string): Promise<StrapiCollectionResponse<any>> {
    return fetchAPI(`/pages?filters[pageType][$eq]=${type}&populate=*&sort=sortOrder:asc`);
  },
};

// Promotion API
export const promotionAPI = {
  async getAll(): Promise<StrapiCollectionResponse<any>> {
    return fetchAPI('/promotions?populate=*&filters[active][$eq]=true&sort=createdAt:desc');
  },
  
  async getByCode(code: string): Promise<StrapiResponse<any>> {
    return fetchAPI(`/promotions?filters[code][$eq]=${code}&filters[active][$eq]=true&populate=*`);
  },
  
  async validatePromo(code: string, orderValue: number): Promise<{ valid: boolean; discount?: number; message?: string }> {
    try {
      const response = await fetchAPI(`/promotions?filters[code][$eq]=${code}&filters[active][$eq]=true&populate=*`);
      
      if (!response.data || response.data.length === 0) {
        return { valid: false, message: 'Invalid promo code' };
      }
      
      const promo = response.data[0];
      const now = new Date();
      const validFrom = new Date(promo.validFrom);
      const validUntil = new Date(promo.validUntil);
      
      if (now < validFrom || now > validUntil) {
        return { valid: false, message: 'Promo code expired' };
      }
      
      if (orderValue < promo.minimumOrderValue) {
        return { valid: false, message: `Minimum order value of ₹${promo.minimumOrderValue} required` };
      }
      
      let discount = 0;
      if (promo.discountType === 'percentage') {
        discount = (orderValue * promo.discountValue) / 100;
        if (promo.maximumDiscount && discount > promo.maximumDiscount) {
          discount = promo.maximumDiscount;
        }
      } else if (promo.discountType === 'fixed') {
        discount = promo.discountValue;
      }
      
      return { valid: true, discount };
    } catch (error) {
      return { valid: false, message: 'Error validating promo code' };
    }
  },
};

// Utility functions
export const strapiUtils = {
  // Get image URL from Strapi media object
  getImageUrl(image: any, size: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium'): string {
    if (!image?.data?.attributes) return '/placeholder-image.jpg';
    
    const { url, formats } = image.data.attributes;
    
    if (formats?.[size]) {
      return `${STRAPI_URL}${formats[size].url}`;
    }
    
    return `${STRAPI_URL}${url}`;
  },
  
  // Format price for display
  formatPrice(price: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(price);
  },
  
  // Generate order number
  generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `CP${year}${month}${day}${random}`;
  },
};

export default {
  categoryAPI,
  productAPI,
  variantAPI,
  orderAPI,
  orderFileAPI,
  pageAPI,
  promotionAPI,
  strapiUtils,
};
