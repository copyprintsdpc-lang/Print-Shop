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

async function createDatabaseSchema() {
  console.log('\n🏗️  Creating Database Schema...');
  console.log('===============================');
  
  try {
    const db = mongoose.connection.db;

    // Define all required collections with their schemas
    const collections = [
      {
        name: 'users',
        schema: {
          email: { type: String, unique: true, required: true, index: true },
          passwordHash: { type: String, required: false },
          verified: { type: Boolean, default: false },
          name: { type: String, required: false },
          mobile: { type: String, unique: true, sparse: true },
          role: { type: String, enum: ['customer', 'admin', 'staff'], default: 'customer' },
          businessProfile: {
            companyName: String,
            gstin: String,
            pan: String,
            address: {
              line1: String,
              line2: String,
              city: String,
              state: String,
              pincode: String,
              country: { type: String, default: 'IN' }
            }
          },
          addresses: [{
            type: { type: String, enum: ['billing', 'shipping'] },
            line1: String,
            line2: String,
            city: String,
            state: String,
            pincode: String,
            country: { type: String, default: 'IN' },
            isDefault: { type: Boolean, default: false }
          }],
          createdAt: { type: Date, default: Date.now },
          updatedAt: { type: Date, default: Date.now }
        }
      },
      {
        name: 'products',
        schema: {
          name: { type: String, required: true, trim: true },
          slug: { type: String, required: true, unique: true, trim: true },
          description: { type: String, required: true },
          category: {
            type: String,
            enum: ['documents', 'business-cards', 'posters-banners', 'stickers-labels', 'stationery', 'custom'],
            required: true
          },
          images: [{ type: String, required: true }],
          basePrice: { type: Number, required: true, min: 0 },
          pricingMethod: { type: String, enum: ['flat', 'tier', 'area'], required: true },
          sameDayEligible: { type: Boolean, default: false },
          sameDayCutoff: { type: String, default: '12:00' },
          variants: [{
            size: { type: String, required: true },
            material: { type: String, required: true },
            finish: { type: String, required: true },
            price: { type: Number, required: true, min: 0 },
            sku: { type: String },
            inStock: { type: Boolean, default: true },
            name: { type: String }
          }],
          options: [{
            name: { type: String, required: true },
            type: { type: String, enum: ['select', 'boolean', 'numeric', 'dim2'], required: true },
            required: { type: Boolean, default: false },
            values: [{
              value: { type: String, required: true },
              label: { type: String, required: true },
              priceDelta: { type: Number, default: 0 },
              priceDeltaType: { type: String, enum: ['flat', 'percent'], default: 'flat' }
            }]
          }],
          pricingTiers: [{
            minQty: { type: Number, required: true, min: 1 },
            unitPrice: { type: Number, required: true, min: 0 }
          }],
          areaPricing: {
            pricePerSqFt: { type: Number, min: 0 },
            minCharge: { type: Number, min: 0 }
          },
          promotion: {
            discount: { type: Number, min: 0, max: 100 },
            validUntil: { type: Date },
            isActive: { type: Boolean, default: false },
            title: { type: String },
            description: { type: String }
          },
          featured: { type: Boolean, default: false },
          active: { type: Boolean, default: true },
          metaTitle: { type: String, trim: true },
          metaDescription: { type: String, trim: true },
          tags: [{ type: String }],
          weight: { type: Number, min: 0 },
          dimensions: {
            length: { type: Number, min: 0 },
            width: { type: Number, min: 0 },
            height: { type: Number, min: 0 }
          },
          createdAt: { type: Date, default: Date.now },
          updatedAt: { type: Date, default: Date.now }
        }
      },
      {
        name: 'orders',
        schema: {
          orderNumber: { type: String, required: true, unique: true },
          userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
          customer: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            company: { type: String }
          },
          status: {
            type: String,
            enum: ['placed', 'preflight', 'proof_ready', 'approved', 'in_production', 'ready_for_pickup', 'shipped', 'completed', 'cancelled'],
            default: 'placed'
          },
          items: [{
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            productName: { type: String, required: true },
            variant: { type: String, required: true },
            quantity: { type: Number, required: true, min: 1 },
            specifications: { type: mongoose.Schema.Types.Mixed, required: true },
            unitPrice: { type: Number, required: true, min: 0 },
            totalPrice: { type: Number, required: true, min: 0 },
            files: [{
              originalFile: { type: String, required: true },
              proofFile: { type: String },
              printReadyFile: { type: String },
              fileName: { type: String, required: true },
              fileSize: { type: Number, required: true },
              uploadedAt: { type: Date, default: Date.now }
            }]
          }],
          artwork_files: [{ type: String }],
          pricing: {
            subtotal: { type: Number, required: true, min: 0 },
            taxAmount: { type: Number, required: true, min: 0 },
            shippingAmount: { type: Number, required: true, min: 0 },
            discountAmount: { type: Number, default: 0 },
            grandTotal: { type: Number, required: true, min: 0 },
            currency: { type: String, default: 'INR' }
          },
          delivery: {
            method: { type: String, enum: ['pickup', 'courier'], required: true },
            address: {
              line1: { type: String },
              line2: { type: String },
              city: { type: String },
              state: { type: String },
              pincode: { type: String },
              country: { type: String, default: 'IN' }
            },
            pickupSlot: {
              date: { type: Date },
              timeSlot: { type: String }
            },
            courierDetails: {
              carrier: { type: String },
              trackingNumber: { type: String },
              estimatedDelivery: { type: Date }
            }
          },
          payment: {
            method: { type: String, enum: ['razorpay', 'cod'], required: true },
            status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
            razorpayOrderId: { type: String },
            razorpayPaymentId: { type: String },
            amount: { type: Number, required: true, min: 0 }
          },
          payment_status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
          gst: {
            gstin: { type: String },
            cgst: { type: Number, default: 0 },
            sgst: { type: Number, default: 0 },
            igst: { type: Number, default: 0 },
            totalTax: { type: Number, required: true, min: 0 }
          },
          notes: { type: String },
          estimatedCompletion: { type: Date },
          actualCompletion: { type: Date },
          createdAt: { type: Date, default: Date.now },
          updatedAt: { type: Date, default: Date.now }
        }
      },
      {
        name: 'admins',
        schema: {
          email: { type: String, required: true, unique: true, lowercase: true, trim: true },
          passwordHash: { type: String, required: true },
          name: { type: String, required: true, trim: true },
          role: { type: String, enum: ['super_admin', 'admin', 'staff'], default: 'staff' },
          permissions: [{
            type: String,
            enum: [
              'products.create', 'products.read', 'products.update', 'products.delete',
              'orders.read', 'orders.update',
              'promotions.create', 'promotions.read', 'promotions.update', 'promotions.delete',
              'users.read', 'analytics.read', 'settings.update'
            ]
          }],
          isActive: { type: Boolean, default: true },
          lastLogin: { type: Date },
          createdAt: { type: Date, default: Date.now },
          updatedAt: { type: Date, default: Date.now }
        }
      },
      {
        name: 'promotions',
        schema: {
          title: { type: String, required: true, trim: true },
          description: { type: String, trim: true },
          discount: { type: Number, required: true, min: 0 },
          discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
          minOrderAmount: { type: Number, min: 0 },
          maxDiscountAmount: { type: Number, min: 0 },
          startDate: { type: Date, required: true },
          endDate: { type: Date, required: true },
          applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
          applicableCategories: [{
            type: String,
            enum: ['documents', 'business-cards', 'posters-banners', 'stickers-labels', 'stationery', 'custom']
          }],
          isActive: { type: Boolean, default: true },
          usageLimit: { type: Number, min: 1 },
          usedCount: { type: Number, default: 0 },
          createdAt: { type: Date, default: Date.now },
          updatedAt: { type: Date, default: Date.now }
        }
      },
      {
        name: 'verificationtokens',
        schema: {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
          tokenHash: { type: String, required: true, index: true },
          expiresAt: { type: Date, required: true },
          createdAt: { type: Date, default: Date.now }
        }
      },
      {
        name: 'otpchallenges',
        schema: {
          mobile: { type: String, required: true, index: true },
          otpHash: { type: String, required: true },
          expiresAt: { type: Date, required: true },
          attempts: { type: Number, default: 0 },
          createdAt: { type: Date, default: Date.now }
        }
      }
    ];

    // Create collections and indexes
    for (const collection of collections) {
      try {
        // Create collection
        await db.createCollection(collection.name);
        console.log(`✅ Created collection: ${collection.name}`);
        
        // Create indexes
        await createIndexesForCollection(db, collection.name, collection.schema);
        
      } catch (error) {
        if (error.code === 48) { // Collection already exists
          console.log(`✅ Collection already exists: ${collection.name}`);
          await createIndexesForCollection(db, collection.name, collection.schema);
        } else {
          console.log(`⚠️  Collection ${collection.name}: ${error.message}`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Failed to create database schema:', error.message);
    throw error;
  }
}

async function createIndexesForCollection(db, collectionName, schema) {
  const collection = db.collection(collectionName);
  
  try {
    switch (collectionName) {
      case 'users':
        await collection.createIndex({ email: 1 }, { unique: true });
        await collection.createIndex({ mobile: 1 }, { unique: true, sparse: true });
        await collection.createIndex({ role: 1 });
        await collection.createIndex({ verified: 1 });
        console.log(`   📊 Created indexes for ${collectionName}`);
        break;
        
      case 'products':
        await collection.createIndex({ slug: 1 }, { unique: true });
        await collection.createIndex({ category: 1 });
        await collection.createIndex({ active: 1 });
        await collection.createIndex({ featured: 1 });
        await collection.createIndex({ tags: 1 });
        await collection.createIndex({ 'variants.sku': 1 });
        console.log(`   📊 Created indexes for ${collectionName}`);
        break;
        
      case 'orders':
        await collection.createIndex({ orderNumber: 1 }, { unique: true });
        await collection.createIndex({ userId: 1 });
        await collection.createIndex({ status: 1 });
        await collection.createIndex({ createdAt: 1 });
        await collection.createIndex({ 'payment.status': 1 });
        await collection.createIndex({ 'customer.email': 1 });
        console.log(`   📊 Created indexes for ${collectionName}`);
        break;
        
      case 'admins':
        await collection.createIndex({ email: 1 }, { unique: true });
        await collection.createIndex({ role: 1 });
        await collection.createIndex({ isActive: 1 });
        console.log(`   📊 Created indexes for ${collectionName}`);
        break;
        
      case 'promotions':
        await collection.createIndex({ startDate: 1, endDate: 1 });
        await collection.createIndex({ isActive: 1 });
        await collection.createIndex({ applicableProducts: 1 });
        await collection.createIndex({ applicableCategories: 1 });
        console.log(`   📊 Created indexes for ${collectionName}`);
        break;
        
      case 'verificationtokens':
        await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
        await collection.createIndex({ userId: 1 });
        await collection.createIndex({ tokenHash: 1 });
        console.log(`   📊 Created indexes for ${collectionName}`);
        break;
        
      case 'otpchallenges':
        await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
        await collection.createIndex({ mobile: 1 });
        console.log(`   📊 Created indexes for ${collectionName}`);
        break;
    }
  } catch (error) {
    console.log(`   ⚠️  Index creation for ${collectionName}: ${error.message}`);
  }
}

async function createInitialData() {
  console.log('\n📦 Creating Initial Data...');
  console.log('============================');
  
  try {
    const db = mongoose.connection.db;

    // Check if data already exists
    const adminCount = await db.collection('admins').countDocuments();
    const productCount = await db.collection('products').countDocuments();
    
    if (adminCount > 0 && productCount > 0) {
      console.log(`✅ Initial data already exists (${adminCount} admins, ${productCount} products)`);
      return;
    }

    // Create super admin
    const bcrypt = require('bcryptjs');
    const adminPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = {
      email: 'admin@sdpcprint.com',
      passwordHash: adminPassword,
      name: 'Super Admin',
      role: 'super_admin',
      permissions: [
        'products.create', 'products.read', 'products.update', 'products.delete',
        'orders.read', 'orders.update',
        'promotions.create', 'promotions.read', 'promotions.update', 'promotions.delete',
        'users.read', 'analytics.read', 'settings.update'
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('admins').insertOne(adminUser);
    console.log('✅ Super Admin created: admin@sdpcprint.com / admin123');

    // Create sample products
    const sampleProducts = [
      {
        name: 'Business Cards - Premium',
        slug: 'business-cards-premium',
        description: 'High-quality business cards with premium finishes and customization options.',
        category: 'business-cards',
        images: ['https://res.cloudinary.com/dyz54xx10/image/upload/v1/business-cards-premium.jpg'],
        basePrice: 200,
        pricingMethod: 'tier',
        sameDayEligible: true,
        sameDayCutoff: '14:00',
        variants: [
          {
            size: '3.5" x 2"',
            material: 'Premium Cardstock',
            finish: 'Matte',
            price: 200,
            sku: 'BC-PREMIUM-MATTE',
            inStock: true,
            name: 'Premium Matte'
          },
          {
            size: '3.5" x 2"',
            material: 'Premium Cardstock',
            finish: 'Glossy',
            price: 250,
            sku: 'BC-PREMIUM-GLOSSY',
            inStock: true,
            name: 'Premium Glossy'
          },
          {
            size: '3.5" x 2"',
            material: 'Premium Cardstock',
            finish: 'Spot UV',
            price: 350,
            sku: 'BC-PREMIUM-SPOTUV',
            inStock: true,
            name: 'Premium Spot UV'
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
              { value: '500', label: '500 cards', priceDelta: -20, priceDeltaType: 'percent' },
              { value: '1000', label: '1000 cards', priceDelta: -30, priceDeltaType: 'percent' }
            ]
          }
        ],
        pricingTiers: [
          { minQty: 100, unitPrice: 200 },
          { minQty: 250, unitPrice: 180 },
          { minQty: 500, unitPrice: 160 },
          { minQty: 1000, unitPrice: 140 }
        ],
        featured: true,
        active: true,
        tags: ['business', 'cards', 'premium', 'professional'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Document Printing - A4',
        slug: 'document-printing-a4',
        description: 'Professional document printing with various paper types and binding options.',
        category: 'documents',
        images: ['https://res.cloudinary.com/dyz54xx10/image/upload/v1/document-printing-a4.jpg'],
        basePrice: 3,
        pricingMethod: 'flat',
        sameDayEligible: true,
        sameDayCutoff: '16:00',
        variants: [
          {
            size: 'A4',
            material: '80 GSM Paper',
            finish: 'Standard',
            price: 3,
            sku: 'DOC-A4-80GSM',
            inStock: true,
            name: 'A4 Standard'
          },
          {
            size: 'A4',
            material: '100 GSM Paper',
            finish: 'Standard',
            price: 4,
            sku: 'DOC-A4-100GSM',
            inStock: true,
            name: 'A4 Premium'
          },
          {
            size: 'A4',
            material: '120 GSM Paper',
            finish: 'Standard',
            price: 5,
            sku: 'DOC-A4-120GSM',
            inStock: true,
            name: 'A4 Heavy'
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
        tags: ['documents', 'printing', 'paper', 'binding', 'a4'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.collection('products').insertMany(sampleProducts);
    console.log(`✅ Created ${sampleProducts.length} sample products`);

    // Create sample promotions
    const samplePromotions = [
      {
        title: 'New Customer Welcome',
        description: 'Get 20% off your first order over ₹1000',
        discount: 20,
        discountType: 'percentage',
        minOrderAmount: 1000,
        maxDiscountAmount: 2000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
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
    console.error('❌ Failed to create initial data:', error.message);
    throw error;
  }
}

async function displayDatabaseInfo() {
  console.log('\n📊 Database Information:');
  console.log('=========================');
  
  try {
    const db = mongoose.connection.db;
    
    // Get database stats
    const stats = await db.stats();
    console.log(`📊 Database Name: ${stats.db}`);
    console.log(`📊 Collections: ${stats.collections}`);
    console.log(`📊 Data Size: ${(stats.dataSize / 1024).toFixed(2)} KB`);
    console.log(`📊 Index Size: ${(stats.indexSize / 1024).toFixed(2)} KB`);
    
    // Get collection counts
    const collections = await db.listCollections().toArray();
    console.log('\n📋 Collections:');
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`   ${collection.name}: ${count} documents`);
    }
    
  } catch (error) {
    console.error('❌ Failed to get database info:', error.message);
  }
}

async function main() {
  try {
    console.log('🚀 Creating Print Shop Database Schema...\n');
    
    // Connect to database
    await connectToDatabase();
    
    // Create database schema
    await createDatabaseSchema();
    
    // Create initial data
    await createInitialData();
    
    // Display database information
    await displayDatabaseInfo();
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📝 Database Details:');
    console.log(`   Name: sdpc_print_shop`);
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Collections: 7 (users, products, orders, admins, promotions, verificationtokens, otpchallenges)`);
    console.log('\n🔑 Admin Credentials:');
    console.log('   Email: admin@sdpcprint.com');
    console.log('   Password: admin123');
    console.log('\n🚀 Ready to use your Print Shop application!');
    
  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB Atlas');
  }
}

main();
