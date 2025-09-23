# Sri Datta Print Centre - CMS Backend

This is the Strapi CMS backend for Sri Datta Print Centre's digital printing platform.

## 🏗️ Architecture

- **CMS**: Strapi v5.23.6
- **Database**: Supabase PostgreSQL
- **File Storage**: Cloudinary
- **Hosting**: Strapi Cloud

## 📋 Content Types

### Core Content Types
- **Category**: Product categories (Documents, Business Cards, etc.)
- **Product**: Main products with descriptions and images
- **Product Variant**: Size/material/quantity-specific variants with pricing
- **Order**: Customer orders with payment and delivery information
- **Order File**: Uploaded design files and documents
- **Page**: CMS pages (About Us, Services, etc.)
- **Promotion**: Coupon codes and seasonal offers

### Components
- **Order Components**: Address, delivery, payment, pricing, GST
- **Product Components**: Options, pricing tiers, area pricing
- **SEO Components**: Meta tags and descriptions

## 🚀 Quick Start

### Local Development

1. **Install Dependencies**:
```bash
npm install
```

2. **Environment Setup**:
```bash
cp .env.example .env
# Edit .env with your database and Cloudinary credentials
```

3. **Start Development Server**:
```bash
npm run develop
```

4. **Access Admin Panel**: http://localhost:1337/admin

### Production Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions to Strapi Cloud.

## 🔧 Configuration

### Database (Supabase)
```env
DATABASE_CLIENT=postgres
DATABASE_HOST=aws-1-ap-south-1.pooler.supabase.com
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USERNAME=postgres.duspirkbobrnkathmjbx
DATABASE_PASSWORD=your-password
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
```

### File Storage (Cloudinary)
```env
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_KEY=your-cloudinary-key
CLOUDINARY_SECRET=your-cloudinary-secret
```

## 📊 API Endpoints

### Public Endpoints
- `GET /api/categories` - List all categories
- `GET /api/products` - List all products
- `GET /api/product-variants` - List all product variants
- `GET /api/pages` - List all pages
- `GET /api/promotions` - List active promotions

### Authenticated Endpoints
- `POST /api/orders` - Create new order
- `GET /api/orders` - List user's orders
- `POST /api/order-files` - Upload order files

## 🎯 Features

### For Staff
- **Product Management**: Add/edit products, variants, and pricing
- **Order Management**: View and update order statuses
- **Content Management**: Manage pages, promotions, and blog posts
- **File Management**: Handle customer uploads and design files

### For Customers
- **Product Catalog**: Browse categories and products
- **Dynamic Pricing**: Real-time pricing based on options
- **File Upload**: Upload design files for printing
- **Order Tracking**: Track order status and progress

## 🔐 Permissions

### Public Role
- Read access to categories, products, variants, pages, promotions

### Authenticated Role
- Create orders and upload files
- View own orders and files

### Admin Role
- Full access to all content types and settings

## 📱 Integration

### Frontend (Next.js)
- API calls to Strapi endpoints
- Real-time data fetching
- File upload integration

### Payment (Razorpay)
- Order creation and payment processing
- Webhook integration for payment confirmation

## 🛠️ Development

### Scripts
- `npm run develop` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Database Migrations
Strapi automatically handles database schema migrations when content types are modified.

## 📞 Support

For issues or questions:
- Check [Strapi Documentation](https://docs.strapi.io/)
- Review [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Contact development team

## 📄 License

Private project for Sri Datta Print Centre.