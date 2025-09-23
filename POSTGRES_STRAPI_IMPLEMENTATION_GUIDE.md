# Sri Datta Print Centre - PostgreSQL + Strapi Implementation Guide

## 🎯 Architecture Overview

Following the official guide with PostgreSQL + Supabase, Strapi CMS, Next.js storefront, Cloudinary/S3 file storage, and Razorpay payments.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   Strapi CMS    │    │   Supabase      │
│   (Storefront)  │◄──►│   (Backend)     │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ - Product Pages │    │ - Content Types │    │ - Relational    │
│ - Cart/Checkout │    │ - API Endpoints │    │ - JSONB Fields  │
│ - User Auth     │    │ - Admin Panel   │    │ - File URLs     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Cloudinary    │
                       │   (File Storage)│
                       │                 │
                       │ - Artwork Files │
                       │ - Product Images│
                       │ - Order Files   │
                       └─────────────────┘
```

## 📋 Phase 1 - Foundation ✅

### ✅ Completed:
1. **Strapi CMS Setup with PostgreSQL**
   - Configured for Supabase PostgreSQL
   - Content types defined (Category, Product, Product Variant, Order, Order File)
   - Components for complex data structures
   - JSONB fields for unstructured data (custom print options)

2. **Content Types Structure:**
   - **Category**: Product categories with sorting
   - **Product**: Full catalog with pricing methods
   - **Product Variant**: Variant-level pricing (size/material/quantity)
   - **Order**: Complete order management with components
   - **Order File**: File storage for artwork/uploads
   - **Page**: CMS pages (About Us, Services, etc.)
   - **Promotion**: Coupon codes and seasonal offers

3. **Media Configuration**
   - Cloudinary integration configured
   - File upload handling for artwork and designs

## 🚀 Next Steps - Phase 2: Storefront

### 1. Set up Supabase Database
```bash
# Create Supabase project at https://supabase.com
# Get connection details and update strapi-cms/.env
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

### 2. Start Strapi CMS
```bash
cd strapi-cms
npm run develop
# Access admin at http://localhost:1337/admin
```

### 3. Configure Permissions
In Strapi Admin → Settings → Users & Permissions Plugin → Roles:

**Public Role:**
- Categories: `find`, `findOne`
- Products: `find`, `findOne`
- Product Variants: `find`, `findOne`
- Pages: `find`, `findOne`
- Promotions: `find`, `findOne`

**Authenticated Role:**
- Orders: `create`, `find`, `findOne` (own orders only)
- Order Files: `create`, `find`, `findOne` (own files only)

### 4. Update Next.js Frontend
Replace hardcoded product data with Strapi API calls:

```javascript
// src/lib/strapi.ts - API integration
import { productAPI, categoryAPI } from '@/lib/strapi';

// Fetch products from Strapi
const products = await productAPI.getAll();
```

## 🏗️ Data Structure Examples

### Product Variant with JSONB (Unstructured Data)
```json
{
  "name": "Business Card Premium",
  "price": 0.8,
  "size": "3.5x2",
  "material": "300gsm",
  "customOptions": {
    "paper": "300gsm matte",
    "finish": "spot UV on logo", 
    "cut": "rounded corners",
    "bleed": "3mm all sides"
  },
  "metadata": {
    "productionTime": "24-48 hours",
    "minQuantity": 100,
    "maxQuantity": 10000
  }
}
```

### Order with Components
```json
{
  "orderNumber": "CP241201001",
  "status": "placed",
  "items": [
    {
      "product": "Business Cards",
      "variant": "Premium",
      "quantity": 500,
      "specifications": {
        "size": "3.5x2",
        "paper": "300gsm matte",
        "finish": "spot UV"
      }
    }
  ],
  "pricing": {
    "subtotal": 400.00,
    "taxAmount": 72.00,
    "shippingAmount": 50.00,
    "grandTotal": 522.00
  }
}
```

## 🔧 Environment Configuration

### Strapi (.env)
```env
# Database (Supabase PostgreSQL)
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
DATABASE_SSL=true

# Server
HOST=0.0.0.0
PORT=1337
APP_KEYS=your_app_keys_here
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
```

### Next.js (.env.local)
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_api_token
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

## 📊 Phase 3: Admin/Operations

### Staff Workflows:
1. **Product Management**
   - Navigate to Product Variants
   - Filter by product type
   - Update prices and quantities
   - Save & Publish changes

2. **Order Management**
   - View incoming orders
   - Update order status (pending → printing → shipped → completed)
   - Manage file uploads and approvals

3. **Content Management**
   - Update About Us, Services pages
   - Manage seasonal promotions
   - Create coupon codes

## 🚀 Phase 4: Enhancements

### Planned Features:
- **Bulk Price Updates**: CSV import for variant prices
- **Email/SMS Notifications**: Order confirmations and updates
- **Delivery Integration**: Shiprocket/DTDC API
- **Analytics Dashboard**: Sales trends and top products

## 🎯 Phase 5: Differentiators

### Advanced Features:
- **Design Upload Tool**: Customer artwork upload
- **Online Editor**: Simple design customizer
- **B2B Features**: Corporate accounts and GST invoices
- **Loyalty Program**: Points system for repeat customers

## 🚀 Deployment Strategy

### Production Setup:
- **Strapi**: Deploy on Render/DigitalOcean
- **Next.js**: Deploy on Vercel
- **Database**: Supabase (PostgreSQL with backups)
- **File Storage**: Cloudinary production account
- **Domain**: 
  - Storefront: `sdpcprint.com`
  - Admin: `cms.sdpcprint.com`

## 📞 Daily Operations Guide

### For Staff:
1. Login to Strapi Admin (`cms.sdpcprint.com`)
2. Navigate to Product Variants
3. Filter by product (e.g., "Business Cards")
4. Update Price and Quantity fields
5. Save & Publish
6. Verify changes on storefront (`sdpcprint.com`)

## ✅ Benefits of This Architecture

1. **Staff-Friendly**: Non-technical staff can manage products independently
2. **Scalable**: PostgreSQL handles complex relationships and JSONB data
3. **Cost-Effective**: Supabase free tier + Vercel free hosting
4. **Flexible**: JSONB fields for custom print options
5. **Professional**: Cloudinary for media management
6. **Secure**: Role-based access control in Strapi

## 🔄 Migration from Current System

1. **Data Migration**: Export existing MongoDB data to CSV
2. **Import to Strapi**: Use Strapi admin to create products
3. **Update Frontend**: Replace hardcoded data with API calls
4. **Test & Deploy**: Verify functionality before going live

This implementation follows the guide exactly and provides a robust, scalable solution for Sri Datta Print Centre's digital transformation.
