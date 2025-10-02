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

async function getDatabaseStats() {
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
    return null;
  }
}

async function getUsers() {
  console.log('\n👥 USERS:');
  console.log('==========');
  
  try {
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}).toArray();
    
    if (users.length === 0) {
      console.log('No users found');
      return;
    }

    users.forEach((user, index) => {
      console.log(`\n${index + 1}. User ID: ${user._id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name || 'Not set'}`);
      console.log(`   Mobile: ${user.mobile || 'Not set'}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Verified: ${user.verified}`);
      console.log(`   Created: ${user.createdAt}`);
      if (user.businessProfile) {
        console.log(`   Company: ${user.businessProfile.companyName || 'Not set'}`);
      }
    });
    
    return users;
  } catch (error) {
    console.error('❌ Failed to get users:', error.message);
    return [];
  }
}

async function getAdmins() {
  console.log('\n👤 ADMINS:');
  console.log('===========');
  
  try {
    const db = mongoose.connection.db;
    const admins = await db.collection('admins').find({}).toArray();
    
    if (admins.length === 0) {
      console.log('No admins found');
      return;
    }

    admins.forEach((admin, index) => {
      console.log(`\n${index + 1}. Admin ID: ${admin._id}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Name: ${admin.name}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Active: ${admin.isActive}`);
      console.log(`   Permissions: ${admin.permissions?.join(', ') || 'None'}`);
      console.log(`   Last Login: ${admin.lastLogin || 'Never'}`);
      console.log(`   Created: ${admin.createdAt}`);
    });
    
    return admins;
  } catch (error) {
    console.error('❌ Failed to get admins:', error.message);
    return [];
  }
}

async function getProducts() {
  console.log('\n📦 PRODUCTS:');
  console.log('=============');
  
  try {
    const db = mongoose.connection.db;
    const products = await db.collection('products').find({}).toArray();
    
    if (products.length === 0) {
      console.log('No products found');
      return;
    }

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
    
    return products;
  } catch (error) {
    console.error('❌ Failed to get products:', error.message);
    return [];
  }
}

async function getOrders() {
  console.log('\n📋 ORDERS:');
  console.log('===========');
  
  try {
    const db = mongoose.connection.db;
    const orders = await db.collection('orders').find({}).toArray();
    
    if (orders.length === 0) {
      console.log('No orders found');
      return;
    }

    orders.forEach((order, index) => {
      console.log(`\n${index + 1}. Order ID: ${order._id}`);
      console.log(`   Order Number: ${order.orderNumber}`);
      console.log(`   Customer: ${order.customer?.name} (${order.customer?.email})`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Payment Status: ${order.payment_status}`);
      console.log(`   Grand Total: ₹${order.pricing?.grandTotal || 0}`);
      console.log(`   Currency: ${order.pricing?.currency || 'INR'}`);
      console.log(`   Delivery Method: ${order.delivery?.method}`);
      console.log(`   Items: ${order.items?.length || 0}`);
      console.log(`   Created: ${order.createdAt}`);
      
      // Show items
      if (order.items && order.items.length > 0) {
        console.log('   Items:');
        order.items.forEach((item, iIndex) => {
          console.log(`     ${iIndex + 1}. ${item.productName} - ${item.variant} (Qty: ${item.quantity}) - ₹${item.totalPrice}`);
        });
      }
    });
    
    return orders;
  } catch (error) {
    console.error('❌ Failed to get orders:', error.message);
    return [];
  }
}

async function getPromotions() {
  console.log('\n🎉 PROMOTIONS:');
  console.log('==============');
  
  try {
    const db = mongoose.connection.db;
    const promotions = await db.collection('promotions').find({}).toArray();
    
    if (promotions.length === 0) {
      console.log('No promotions found');
      return;
    }

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
    
    return promotions;
  } catch (error) {
    console.error('❌ Failed to get promotions:', error.message);
    return [];
  }
}

async function getVerificationTokens() {
  console.log('\n🔐 VERIFICATION TOKENS:');
  console.log('=======================');
  
  try {
    const db = mongoose.connection.db;
    const tokens = await db.collection('verificationtokens').find({}).toArray();
    
    if (tokens.length === 0) {
      console.log('No verification tokens found');
      return;
    }

    tokens.forEach((token, index) => {
      console.log(`\n${index + 1}. Token ID: ${token._id}`);
      console.log(`   User ID: ${token.userId}`);
      console.log(`   Token Hash: ${token.tokenHash?.substring(0, 20)}...`);
      console.log(`   Expires At: ${token.expiresAt}`);
      console.log(`   Created: ${token.createdAt}`);
    });
    
    return tokens;
  } catch (error) {
    console.error('❌ Failed to get verification tokens:', error.message);
    return [];
  }
}

async function listCollections() {
  console.log('\n📁 COLLECTIONS:');
  console.log('================');
  
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log(`Found ${collections.length} collections:`);
    collections.forEach((collection, index) => {
      console.log(`  ${index + 1}. ${collection.name}`);
    });
    
    return collections;
  } catch (error) {
    console.error('❌ Failed to list collections:', error.message);
    return [];
  }
}

async function main() {
  try {
    console.log('🔍 Retrieving Print Shop Database Data...\n');
    
    // Connect to database
    await connectToDatabase();
    
    // List all collections
    await listCollections();
    
    // Get database statistics
    await getDatabaseStats();
    
    // Get all data from each collection
    await getUsers();
    await getAdmins();
    await getProducts();
    await getOrders();
    await getPromotions();
    await getVerificationTokens();
    
    console.log('\n✅ Data retrieval completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Data retrieval failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

main();
