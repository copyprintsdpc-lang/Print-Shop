const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

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
    
    // Fallback to in-memory MongoDB for development
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔄 Falling back to in-memory MongoDB for development...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mem = await MongoMemoryServer.create();
        const memUri = mem.getUri('sdpc_print_shop_dev');
        console.log('✅ Connected to in-memory MongoDB successfully');
        await mongoose.connect(memUri, { bufferCommands: false });
      } catch (fallbackErr) {
        console.error('❌ In-memory MongoDB fallback also failed:', fallbackErr);
        throw error;
      }
    }
  }
}

async function createCollections() {
  console.log('\n📋 Creating database collections...');
  
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
    
    // Users collection indexes
    try {
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      await db.collection('users').createIndex({ mobile: 1 }, { unique: true, sparse: true });
      console.log('✅ Users indexes created');
    } catch (error) {
      console.log('⚠️  Users indexes:', error.message);
    }

    // Products collection indexes
    try {
      await db.collection('products').createIndex({ slug: 1 }, { unique: true });
      await db.collection('products').createIndex({ category: 1 });
      await db.collection('products').createIndex({ active: 1 });
      console.log('✅ Products indexes created');
    } catch (error) {
      console.log('⚠️  Products indexes:', error.message);
    }

    // Orders collection indexes
    try {
      await db.collection('orders').createIndex({ orderNumber: 1 }, { unique: true });
      await db.collection('orders').createIndex({ userId: 1 });
      await db.collection('orders').createIndex({ status: 1 });
      await db.collection('orders').createIndex({ createdAt: 1 });
      console.log('✅ Orders indexes created');
    } catch (error) {
      console.log('⚠️  Orders indexes:', error.message);
    }

    // Verification tokens with TTL
    try {
      await db.collection('verificationtokens').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
      await db.collection('verificationtokens').createIndex({ userId: 1 });
      await db.collection('verificationtokens').createIndex({ tokenHash: 1 });
      console.log('✅ Verification tokens indexes created');
    } catch (error) {
      console.log('⚠️  Verification tokens indexes:', error.message);
    }

  } catch (error) {
    console.error('❌ Failed to create collections:', error.message);
    throw error;
  }
}

async function createSampleData() {
  console.log('\n📦 Creating sample data...');
  
  try {
    const db = mongoose.connection.db;

    // Check if sample data already exists
    const userCount = await db.collection('users').countDocuments();
    const productCount = await db.collection('products').countDocuments();
    
    if (userCount > 0 && productCount > 0) {
      console.log(`✅ Sample data already exists (${userCount} users, ${productCount} products)`);
      return;
    }

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
      }
    ];

    await db.collection('promotions').insertMany(samplePromotions);
    console.log(`✅ Created ${samplePromotions.length} sample promotions`);

  } catch (error) {
    console.error('❌ Failed to create sample data:', error.message);
    throw error;
  }
}

async function displayDatabaseStats() {
  console.log('\n📊 Database Statistics:');
  console.log('========================');
  
  try {
    const db = mongoose.connection.db;
    
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
    
    // Create collections and indexes
    await createCollections();
    
    // Create sample data
    await createSampleData();
    
    // Display database statistics
    await displayDatabaseStats();
    
    console.log('\n🎉 Database setup completed successfully!');
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

