const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Import all models
const User = require('../src/models/User').default;
const Product = require('../src/models/Product').default;
const Order = require('../src/models/Order').default;
const Admin = require('../src/models/Admin').default;
const Promotion = require('../src/models/Promotion').default;
const VerificationToken = require('../src/models/VerificationToken').default;

async function connectToDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(uri, {
      bufferCommands: false,
      maxConnecting: 10,
    });
    
    console.log('✅ Connected to MongoDB successfully!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🏠 Host:', mongoose.connection.host);
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
}

async function createAdminUser() {
  console.log('\n👤 Creating admin user...');
  
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@sdpcprint.com' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return existingAdmin;
    }

    // Create super admin
    const admin = new Admin({
      email: 'admin@sdpcprint.com',
      passwordHash: 'admin123', // Will be hashed by pre-save middleware
      name: 'Super Admin',
      role: 'super_admin',
      permissions: [
        'products.create',
        'products.read',
        'products.update',
        'products.delete',
        'orders.read',
        'orders.update',
        'promotions.create',
        'promotions.read',
        'promotions.update',
        'promotions.delete',
        'users.read',
        'analytics.read',
        'settings.update'
      ],
      isActive: true
    });

    await admin.save();
    console.log('✅ Super admin created successfully');
    console.log('   Email: admin@sdpcprint.com');
    console.log('   Password: admin123');
    
    return admin;
  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message);
    throw error;
  }
}

async function createSampleProducts() {
  console.log('\n📦 Creating sample products...');
  
  try {
    // Check if products already exist
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      console.log(`✅ ${existingProducts} products already exist`);
      return;
    }

    const sampleProducts = [
      {
        name: 'Business Cards - Standard',
        slug: 'business-cards-standard',
        description: 'Professional business cards with high-quality printing and various finishing options.',
        category: 'business-cards',
        images: ['https://res.cloudinary.com/dyz54xx10/image/upload/v1/business-cards-standard.jpg'],
        basePrice: 150,
        pricingMethod: 'tier',
        sameDayEligible: true,
        sameDayCutoff: '14:00',
        variants: [
          {
            size: '3.5" x 2"',
            material: 'Premium Cardstock',
            finish: 'Matte',
            price: 150,
            sku: 'BC-STD-MATTE',
            inStock: true,
            name: 'Standard Matte'
          },
          {
            size: '3.5" x 2"',
            material: 'Premium Cardstock',
            finish: 'Glossy',
            price: 180,
            sku: 'BC-STD-GLOSSY',
            inStock: true,
            name: 'Standard Glossy'
          },
          {
            size: '3.5" x 2"',
            material: 'Premium Cardstock',
            finish: 'Spot UV',
            price: 250,
            sku: 'BC-STD-SPOTUV',
            inStock: true,
            name: 'Standard Spot UV'
          }
        ],
        options: [
          {
            name: 'Quantity',
            type: 'select',
            required: true,
            values: [
              { value: '100', label: '100 cards', priceDelta: 0, priceDeltaType: 'flat' },
              { value: '250', label: '250 cards', priceDelta: 0, priceDeltaType: 'flat' },
              { value: '500', label: '500 cards', priceDelta: -25, priceDeltaType: 'percent' },
              { value: '1000', label: '1000 cards', priceDelta: -35, priceDeltaType: 'percent' }
            ]
          }
        ],
        pricingTiers: [
          { minQty: 100, unitPrice: 150 },
          { minQty: 250, unitPrice: 140 },
          { minQty: 500, unitPrice: 120 },
          { minQty: 1000, unitPrice: 100 }
        ],
        featured: true,
        active: true,
        tags: ['business', 'cards', 'professional', 'standard']
      },
      {
        name: 'Document Printing',
        slug: 'document-printing',
        description: 'High-quality document printing with various paper types and binding options.',
        category: 'documents',
        images: ['https://res.cloudinary.com/dyz54xx10/image/upload/v1/document-printing.jpg'],
        basePrice: 2,
        pricingMethod: 'flat',
        sameDayEligible: true,
        sameDayCutoff: '16:00',
        variants: [
          {
            size: 'A4',
            material: '80 GSM Paper',
            finish: 'Standard',
            price: 2,
            sku: 'DOC-A4-80GSM',
            inStock: true,
            name: 'A4 Standard'
          },
          {
            size: 'A4',
            material: '100 GSM Paper',
            finish: 'Standard',
            price: 3,
            sku: 'DOC-A4-100GSM',
            inStock: true,
            name: 'A4 Premium'
          }
        ],
        options: [
          {
            name: 'Paper Type',
            type: 'select',
            required: true,
            values: [
              { value: '80gsm', label: '80 GSM Standard', priceDelta: 0, priceDeltaType: 'flat' },
              { value: '100gsm', label: '100 GSM Premium', priceDelta: 1, priceDeltaType: 'flat' },
              { value: '120gsm', label: '120 GSM Heavy', priceDelta: 2, priceDeltaType: 'flat' }
            ]
          },
          {
            name: 'Binding',
            type: 'select',
            required: false,
            values: [
              { value: 'none', label: 'No Binding', priceDelta: 0, priceDeltaType: 'flat' },
              { value: 'stapled', label: 'Stapled', priceDelta: 5, priceDeltaType: 'flat' },
              { value: 'spiral', label: 'Spiral Bound', priceDelta: 15, priceDeltaType: 'flat' },
              { value: 'perfect', label: 'Perfect Bound', priceDelta: 25, priceDeltaType: 'flat' }
            ]
          }
        ],
        featured: true,
        active: true,
        tags: ['documents', 'printing', 'paper', 'binding']
      },
      {
        name: 'Posters & Banners',
        slug: 'posters-banners',
        description: 'Large format printing for posters, banners, and signage.',
        category: 'posters-banners',
        images: ['https://res.cloudinary.com/dyz54xx10/image/upload/v1/posters-banners.jpg'],
        basePrice: 50,
        pricingMethod: 'area',
        sameDayEligible: false,
        variants: [
          {
            size: 'A3',
            material: 'Matte Paper',
            finish: 'Standard',
            price: 50,
            sku: 'POSTER-A3-MATTE',
            inStock: true,
            name: 'A3 Poster'
          },
          {
            size: 'A2',
            material: 'Matte Paper',
            finish: 'Standard',
            price: 100,
            sku: 'POSTER-A2-MATTE',
            inStock: true,
            name: 'A2 Poster'
          }
        ],
        areaPricing: {
          pricePerSqFt: 25,
          minCharge: 50
        },
        featured: true,
        active: true,
        tags: ['posters', 'banners', 'large-format', 'signage']
      },
      {
        name: 'Stickers & Labels',
        slug: 'stickers-labels',
        description: 'Custom stickers and labels with various materials and finishes.',
        category: 'stickers-labels',
        images: ['https://res.cloudinary.com/dyz54xx10/image/upload/v1/stickers-labels.jpg'],
        basePrice: 5,
        pricingMethod: 'flat',
        sameDayEligible: true,
        sameDayCutoff: '15:00',
        variants: [
          {
            size: '2" x 2"',
            material: 'Vinyl',
            finish: 'Waterproof',
            price: 5,
            sku: 'STICKER-2X2-VINYL',
            inStock: true,
            name: '2x2 Vinyl Sticker'
          },
          {
            size: '3" x 3"',
            material: 'Vinyl',
            finish: 'Waterproof',
            price: 8,
            sku: 'STICKER-3X3-VINYL',
            inStock: true,
            name: '3x3 Vinyl Sticker'
          }
        ],
        featured: true,
        active: true,
        tags: ['stickers', 'labels', 'vinyl', 'custom']
      }
    ];

    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Created ${createdProducts.length} sample products`);
    
    return createdProducts;
  } catch (error) {
    console.error('❌ Failed to create sample products:', error.message);
    throw error;
  }
}

async function createSamplePromotions() {
  console.log('\n🎉 Creating sample promotions...');
  
  try {
    // Check if promotions already exist
    const existingPromotions = await Promotion.countDocuments();
    if (existingPromotions > 0) {
      console.log(`✅ ${existingPromotions} promotions already exist`);
      return;
    }

    const samplePromotions = [
      {
        title: 'New Customer Discount',
        description: 'Get 15% off your first order',
        discount: 15,
        discountType: 'percentage',
        minOrderAmount: 500,
        maxDiscountAmount: 1000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        applicableCategories: ['business-cards', 'documents', 'posters-banners'],
        isActive: true,
        usageLimit: 100
      },
      {
        title: 'Bulk Business Cards',
        description: 'Special pricing for business card orders above 500',
        discount: 25,
        discountType: 'percentage',
        minOrderAmount: 1000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        applicableCategories: ['business-cards'],
        isActive: true,
        usageLimit: 50
      }
    ];

    const createdPromotions = await Promotion.insertMany(samplePromotions);
    console.log(`✅ Created ${createdPromotions.length} sample promotions`);
    
    return createdPromotions;
  } catch (error) {
    console.error('❌ Failed to create sample promotions:', error.message);
    throw error;
  }
}

async function createSampleOrders() {
  console.log('\n📋 Creating sample orders...');
  
  try {
    // Check if orders already exist
    const existingOrders = await Order.countDocuments();
    if (existingOrders > 0) {
      console.log(`✅ ${existingOrders} orders already exist`);
      return;
    }

    // Get sample products and users
    const products = await Product.find().limit(3);
    const users = await User.find().limit(2);
    
    if (products.length === 0 || users.length === 0) {
      console.log('⚠️  No products or users found, skipping sample orders');
      return;
    }

    const sampleOrders = [
      {
        userId: users[0]._id,
        customer: {
          name: users[0].name || 'John Doe',
          email: users[0].email,
          phone: '+91 9876543210',
          company: 'ABC Company'
        },
        status: 'completed',
        items: [
          {
            productId: products[0]._id,
            productName: products[0].name,
            variant: products[0].variants[0].name,
            quantity: 100,
            specifications: {
              quantity: '100',
              paperType: '80gsm',
              binding: 'none'
            },
            unitPrice: products[0].basePrice,
            totalPrice: products[0].basePrice * 100,
            files: [
              {
                originalFile: 'https://res.cloudinary.com/dyz54xx10/image/upload/v1/sample-file.pdf',
                fileName: 'business-card-design.pdf',
                fileSize: 2048000,
                uploadedAt: new Date()
              }
            ]
          }
        ],
        artwork_files: ['https://res.cloudinary.com/dyz54xx10/image/upload/v1/sample-artwork.pdf'],
        pricing: {
          subtotal: 15000,
          taxAmount: 2700,
          shippingAmount: 100,
          discountAmount: 0,
          grandTotal: 17800,
          currency: 'INR'
        },
        delivery: {
          method: 'courier',
          address: {
            line1: '123 Main Street',
            line2: 'Building A',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            country: 'IN'
          }
        },
        payment: {
          method: 'razorpay',
          status: 'completed',
          razorpayOrderId: 'order_' + Math.random().toString(36).substr(2, 9),
          razorpayPaymentId: 'pay_' + Math.random().toString(36).substr(2, 9),
          amount: 17800
        },
        payment_status: 'paid',
        gst: {
          gstin: '27ABCDE1234F1Z5',
          cgst: 1350,
          sgst: 1350,
          igst: 0,
          totalTax: 2700
        },
        estimatedCompletion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        actualCompletion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      }
    ];

    const createdOrders = await Order.insertMany(sampleOrders);
    console.log(`✅ Created ${createdOrders.length} sample orders`);
    
    return createdOrders;
  } catch (error) {
    console.error('❌ Failed to create sample orders:', error.message);
    throw error;
  }
}

async function displayDatabaseStats() {
  console.log('\n📊 Database Statistics:');
  console.log('========================');
  
  try {
    const stats = {
      users: await User.countDocuments(),
      products: await Product.countDocuments(),
      orders: await Order.countDocuments(),
      admins: await Admin.countDocuments(),
      promotions: await Promotion.countDocuments(),
      verificationTokens: await VerificationToken.countDocuments()
    };

    console.log(`👥 Users: ${stats.users}`);
    console.log(`📦 Products: ${stats.products}`);
    console.log(`📋 Orders: ${stats.orders}`);
    console.log(`👤 Admins: ${stats.admins}`);
    console.log(`🎉 Promotions: ${stats.promotions}`);
    console.log(`🔐 Verification Tokens: ${stats.verificationTokens}`);
    
    return stats;
  } catch (error) {
    console.error('❌ Failed to get database stats:', error.message);
  }
}

async function main() {
  try {
    console.log('🚀 Setting up Print Shop Database...\n');
    
    // Connect to database
    await connectToDatabase();
    
    // Create admin user
    await createAdminUser();
    
    // Create sample products
    await createSampleProducts();
    
    // Create sample promotions
    await createSamplePromotions();
    
    // Create sample orders (if users exist)
    await createSampleOrders();
    
    // Display database statistics
    await displayDatabaseStats();
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Test authentication with admin@sdpcprint.com / admin123');
    console.log('   2. Browse products at /services');
    console.log('   3. Create orders at /quote or /order');
    console.log('   4. Test payment integration');
    
  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

main();

