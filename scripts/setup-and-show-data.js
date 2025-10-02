const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function connectToDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(uri, {
      bufferCommands: false,
      maxConnecting: 10,
    });
    
    console.log('✅ Connected to MongoDB Atlas successfully!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🏠 Host:', mongoose.connection.host);
    
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    console.error('Please check:');
    console.error('1. MongoDB Atlas cluster is running');
    console.error('2. Your IP address is whitelisted in MongoDB Atlas');
    console.error('3. Database credentials are correct');
    console.error('4. Network connectivity to MongoDB Atlas');
    throw error;
  }
}

async function setupDatabase() {
  console.log('\n📋 Setting up database collections and sample data...');
  
  try {
    const db = mongoose.connection.db;

    // Create collections with proper indexes
    const collections = [
      'users',
      'products', 
      'orders',
      'admins',
      'promotions',
      'verificationtokens',
      'otpchallenges'
    ];

    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName);
        console.log(`✅ Created collection: ${collectionName}`);
      } catch (error) {
        if (error.code === 48) { // Collection already exists
          console.log(`✅ Collection already exists: ${collectionName}`);
        } else {
          console.log(`⚠️  Collection ${collectionName}: ${error.message}`);
        }
      }
    }

    // Create indexes for better performance
    console.log('\n🔍 Creating database indexes...');
    
    try {
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      await db.collection('users').createIndex({ mobile: 1 }, { unique: true, sparse: true });
      await db.collection('products').createIndex({ slug: 1 }, { unique: true });
      await db.collection('products').createIndex({ category: 1 });
      await db.collection('products').createIndex({ active: 1 });
      await db.collection('orders').createIndex({ orderNumber: 1 }, { unique: true });
      await db.collection('orders').createIndex({ userId: 1 });
      await db.collection('orders').createIndex({ status: 1 });
      await db.collection('orders').createIndex({ createdAt: 1 });
      await db.collection('verificationtokens').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
      await db.collection('verificationtokens').createIndex({ userId: 1 });
      await db.collection('verificationtokens').createIndex({ tokenHash: 1 });
      console.log('✅ All indexes created successfully');
    } catch (error) {
      console.log('⚠️  Index creation:', error.message);
    }

    // Check if sample data already exists
    const userCount = await db.collection('users').countDocuments();
    const productCount = await db.collection('products').countDocuments();
    
    if (userCount > 0 && productCount > 0) {
      console.log(`✅ Sample data already exists (${userCount} users, ${productCount} products)`);
      return;
    }

    console.log('\n📦 Creating sample data...');

    // Create sample admin user
    const bcrypt = require('bcryptjs');
    const adminPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = {
      email: 'admin@sdpcprint.com',
      passwordHash: adminPassword,
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
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('admins').insertOne(adminUser);
    console.log('✅ Admin user created: admin@sdpcprint.com / admin123');

    // Create sample products
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
        tags: ['business', 'cards', 'professional', 'standard'],
        createdAt: new Date(),
        updatedAt: new Date()
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
        tags: ['documents', 'printing', 'paper', 'binding'],
        createdAt: new Date(),
        updatedAt: new Date()
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
        tags: ['posters', 'banners', 'large-format', 'signage'],
        createdAt: new Date(),
        updatedAt: new Date()
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
        tags: ['stickers', 'labels', 'vinyl', 'custom'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.collection('products').insertMany(sampleProducts);
    console.log(`✅ Created ${sampleProducts.length} sample products`);

    // Create sample promotions
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
        usageLimit: 100,
        usedCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
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
        usageLimit: 50,
        usedCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.collection('promotions').insertMany(samplePromotions);
    console.log(`✅ Created ${samplePromotions.length} sample promotions`);

  } catch (error) {
    console.error('❌ Failed to setup database:', error.message);
    throw error;
  }
}

async function displayAllData() {
  console.log('\n📊 DATABASE DATA:');
  console.log('==================');
  
  try {
    const db = mongoose.connection.db;
    
    // Get statistics
    const stats = {
      users: await db.collection('users').countDocuments(),
      products: await db.collection('products').countDocuments(),
      orders: await db.collection('orders').countDocuments(),
      admins: await db.collection('admins').countDocuments(),
      promotions: await db.collection('promotions').countDocuments(),
      verificationTokens: await db.collection('verificationtokens').countDocuments()
    };

    console.log(`👥 Users: ${stats.users}`);
    console.log(`📦 Products: ${stats.products}`);
    console.log(`📋 Orders: ${stats.orders}`);
    console.log(`👤 Admins: ${stats.admins}`);
    console.log(`🎉 Promotions: ${stats.promotions}`);
    console.log(`🔐 Verification Tokens: ${stats.verificationTokens}`);

    // Display Admins
    console.log('\n👤 ADMINS:');
    console.log('===========');
    const admins = await db.collection('admins').find({}).toArray();
    admins.forEach((admin, index) => {
      console.log(`\n${index + 1}. Admin ID: ${admin._id}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Name: ${admin.name}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Active: ${admin.isActive}`);
      console.log(`   Permissions: ${admin.permissions?.join(', ') || 'None'}`);
      console.log(`   Created: ${admin.createdAt}`);
    });

    // Display Products
    console.log('\n📦 PRODUCTS:');
    console.log('=============');
    const products = await db.collection('products').find({}).toArray();
    products.forEach((product, index) => {
      console.log(`\n${index + 1}. Product ID: ${product._id}`);
      console.log(`   Name: ${product.name}`);
      console.log(`   Slug: ${product.slug}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Base Price: ₹${product.basePrice}`);
      console.log(`   Pricing Method: ${product.pricingMethod}`);
      console.log(`   Same Day Eligible: ${product.sameDayEligible}`);
      console.log(`   Active: ${product.active}`);
      console.log(`   Featured: ${product.featured}`);
      console.log(`   Variants: ${product.variants?.length || 0}`);
      console.log(`   Options: ${product.options?.length || 0}`);
      console.log(`   Tags: ${product.tags?.join(', ') || 'None'}`);
      console.log(`   Created: ${product.createdAt}`);
      
      // Show variants
      if (product.variants && product.variants.length > 0) {
        console.log('   Variants:');
        product.variants.forEach((variant, vIndex) => {
          console.log(`     ${vIndex + 1}. ${variant.name} - ₹${variant.price} (${variant.size}, ${variant.material}, ${variant.finish})`);
        });
      }
    });

    // Display Promotions
    console.log('\n🎉 PROMOTIONS:');
    console.log('==============');
    const promotions = await db.collection('promotions').find({}).toArray();
    promotions.forEach((promotion, index) => {
      console.log(`\n${index + 1}. Promotion ID: ${promotion._id}`);
      console.log(`   Title: ${promotion.title}`);
      console.log(`   Description: ${promotion.description || 'None'}`);
      console.log(`   Discount: ${promotion.discount}${promotion.discountType === 'percentage' ? '%' : '₹'}`);
      console.log(`   Min Order Amount: ₹${promotion.minOrderAmount || 0}`);
      console.log(`   Max Discount Amount: ₹${promotion.maxDiscountAmount || 'No limit'}`);
      console.log(`   Start Date: ${promotion.startDate}`);
      console.log(`   End Date: ${promotion.endDate}`);
      console.log(`   Active: ${promotion.isActive}`);
      console.log(`   Usage Limit: ${promotion.usageLimit || 'No limit'}`);
      console.log(`   Used Count: ${promotion.usedCount}`);
      console.log(`   Applicable Categories: ${promotion.applicableCategories?.join(', ') || 'All'}`);
      console.log(`   Created: ${promotion.createdAt}`);
    });

    // Display Users
    console.log('\n👥 USERS:');
    console.log('==========');
    const users = await db.collection('users').find({}).toArray();
    if (users.length === 0) {
      console.log('No users found');
    } else {
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. User ID: ${user._id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.name || 'Not set'}`);
        console.log(`   Mobile: ${user.mobile || 'Not set'}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Verified: ${user.verified}`);
        console.log(`   Created: ${user.createdAt}`);
      });
    }

    // Display Orders
    console.log('\n📋 ORDERS:');
    console.log('===========');
    const orders = await db.collection('orders').find({}).toArray();
    if (orders.length === 0) {
      console.log('No orders found');
    } else {
      orders.forEach((order, index) => {
        console.log(`\n${index + 1}. Order ID: ${order._id}`);
        console.log(`   Order Number: ${order.orderNumber}`);
        console.log(`   Customer: ${order.customer?.name} (${order.customer?.email})`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Payment Status: ${order.payment_status}`);
        console.log(`   Grand Total: ₹${order.pricing?.grandTotal || 0}`);
        console.log(`   Created: ${order.createdAt}`);
      });
    }

    // Display Verification Tokens
    console.log('\n🔐 VERIFICATION TOKENS:');
    console.log('=======================');
    const tokens = await db.collection('verificationtokens').find({}).toArray();
    if (tokens.length === 0) {
      console.log('No verification tokens found');
    } else {
      tokens.forEach((token, index) => {
        console.log(`\n${index + 1}. Token ID: ${token._id}`);
        console.log(`   User ID: ${token.userId}`);
        console.log(`   Token Hash: ${token.tokenHash?.substring(0, 20)}...`);
        console.log(`   Expires At: ${token.expiresAt}`);
        console.log(`   Created: ${token.createdAt}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Failed to display data:', error.message);
  }
}

async function main() {
  try {
    console.log('🚀 Setting up and displaying Print Shop Database...\n');
    
    // Connect to database
    await connectToDatabase();
    
    // Setup database with sample data
    await setupDatabase();
    
    // Display all data
    await displayAllData();
    
    console.log('\n🎉 Database setup and data display completed successfully!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Test authentication with admin@sdpcprint.com / admin123');
    console.log('   2. Browse products at /services');
    console.log('   3. Create orders at /quote or /order');
    console.log('   4. Test payment integration');
    console.log('\n🔑 Admin Credentials:');
    console.log('   Email: admin@sdpcprint.com');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

main();
