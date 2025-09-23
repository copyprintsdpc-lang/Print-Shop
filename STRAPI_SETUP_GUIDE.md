# Strapi CMS Setup Guide for Sri Datta Print Center

## 🚀 Current Status

✅ **Completed:**
- Strapi CMS project created with MongoDB configuration
- Content types defined (Category, Product, Product Variant, Order)
- Component schemas created for complex data structures
- Cloudinary integration configured for media uploads
- API controllers, services, and routes generated

## 📋 Next Steps

### 1. Start Strapi CMS
```bash
cd strapi-cms
npm run develop
```

### 2. Access Strapi Admin
- Open: http://localhost:1337/admin
- Create admin account
- Configure permissions for public access

### 3. Configure Permissions
In Strapi Admin → Settings → Users & Permissions Plugin → Roles:

**Public Role:**
- Categories: `find`, `findOne`
- Products: `find`, `findOne`
- Product Variants: `find`, `findOne`

**Authenticated Role:**
- Orders: `create`, `find`, `findOne` (own orders only)

### 4. Populate Initial Data
Create sample data through Strapi Admin:

**Categories:**
- Documents
- Business Cards
- Banners & Posters
- Stickers & Labels

**Products:**
- Black & White Documents
- Color Documents
- Business Cards
- Banners & Posters

### 5. Update Next.js Frontend
Modify the existing Next.js app to fetch data from Strapi API:

```javascript
// Example API call
const response = await fetch('http://localhost:1337/api/products?populate=*');
const products = await response.json();
```

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   Strapi CMS    │    │   MongoDB       │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
│                 │    │                 │    │                 │
│ - Product Pages │    │ - Content Types │    │ - Collections   │
│ - Cart/Checkout │    │ - API Endpoints │    │ - Documents     │
│ - User Auth     │    │ - Admin Panel   │    │ - Relations     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Content Types Structure

### Category
- name, slug, description
- image, icon
- sortOrder, active
- products (relation)

### Product
- name, slug, description
- category (relation)
- images, basePrice
- pricingMethod, sameDayEligible
- options (component), pricingTiers (component)
- variants (relation)

### Product Variant
- name, product (relation)
- price, size, material, finish
- quantity, sku, stock
- options (json)

### Order
- orderNumber, customer (relation)
- status, items (component)
- pricing, delivery, payment (components)
- gst, notes, estimatedCompletion

## 🔧 Environment Variables

Create `.env` in strapi-cms directory:
```env
# Database
DATABASE_CLIENT=mongodb
DATABASE_URL=mongodb+srv://sdpcdb:Vamsi%4054312@cluster0.wjswahh.mongodb.net/
DATABASE_NAME=copyprint

# Server
HOST=0.0.0.0
PORT=1337
APP_KEYS=your_app_keys_here
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
TRANSFER_TOKEN_SALT=your_transfer_token_salt
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
```

## 🎯 Benefits of This Setup

1. **Staff-Friendly**: Non-technical staff can manage products, prices, and content
2. **Scalable**: Easy to add new product types and features
3. **Flexible**: Component-based architecture allows complex product configurations
4. **API-First**: Frontend can be easily updated or replaced
5. **Media Management**: Cloudinary integration for professional image handling

## 🚀 Deployment Considerations

- **Strapi**: Deploy on Railway, Render, or DigitalOcean
- **Next.js**: Deploy on Vercel
- **MongoDB**: Keep existing Atlas cluster
- **Cloudinary**: Configure for production environment

## 📞 Support

For any issues or questions about the Strapi setup, refer to:
- [Strapi Documentation](https://docs.strapi.io/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
