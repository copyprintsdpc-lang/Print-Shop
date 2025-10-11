const mongoose = require('mongoose')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config({ path: '.env.local' })

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB Atlas successfully!')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    process.exit(1)
  }
}

// Order Schema
const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, required: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String, default: '' }
  },
  delivery: {
    method: { type: String, enum: ['pickup', 'courier'], required: true },
    address: {
      line1: { type: String, required: true },
      line2: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: 'India' }
    }
  },
  payment: {
    method: { type: String, enum: ['razorpay', 'cod'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    transactionId: { type: String, default: '' },
    razorpayOrderId: { type: String, default: '' }
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    variant: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
  }],
  artworkFiles: [{ type: String, default: [] }],
  notes: { type: String, default: '' },
  pricing: {
    subtotal: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    shippingAmount: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    currency: { type: String, default: 'INR' }
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  trackingInfo: {
    courier: { type: String, default: '' },
    trackingNumber: { type: String, default: '' },
    estimatedDelivery: { type: Date, default: null }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const Order = mongoose.model('Order', orderSchema)

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  images: [{ type: String, default: [] }],
  basePrice: { type: Number, required: true },
  pricingMethod: { type: String, enum: ['flat', 'tier'], default: 'flat' },
  variants: [{
    size: { type: String, required: true },
    material: { type: String, required: true },
    finish: { type: String, required: true },
    price: { type: Number, required: true },
    sku: { type: String, default: '' },
    inStock: { type: Boolean, default: true }
  }],
  options: [{
    name: { type: String, required: true },
    choices: [{ type: String, required: true }],
    required: { type: Boolean, default: false }
  }],
  tags: [{ type: String, default: [] }],
  sameDayEligible: { type: Boolean, default: false },
  sameDayCutoff: { type: String, default: '14:00' },
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const Product = mongoose.model('Product', productSchema)

async function createSampleOrders() {
  try {
    console.log('\n📦 Creating Sample Orders...')
    console.log('============================')
    
    // Get existing products
    const products = await Product.find({ active: true })
    if (products.length === 0) {
      console.log('❌ No products found. Please create products first.')
      return
    }
    
    // Clear existing orders
    await Order.deleteMany({})
    console.log('✅ Cleared existing orders')
    
    // Sample orders data
    const sampleOrders = [
      {
        orderNumber: 'SDPC-2024-001',
        customer: {
          name: 'Rajesh Kumar',
          email: 'rajesh@example.com',
          phone: '9876543210',
          company: 'Tech Solutions Pvt Ltd'
        },
        delivery: {
          method: 'courier',
          address: {
            line1: '123 MG Road',
            line2: 'Near Metro Station',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560001',
            country: 'India'
          }
        },
        payment: {
          method: 'razorpay',
          status: 'completed',
          transactionId: 'txn_123456789',
          razorpayOrderId: 'order_123456789'
        },
        items: [
          {
            productId: products[0]._id,
            productName: products[0].name,
            variant: 'A4 Standard',
            quantity: 100,
            unitPrice: 3,
            totalPrice: 300
          }
        ],
        artworkFiles: ['artwork1.pdf'],
        notes: 'Please ensure high quality printing',
        pricing: {
          subtotal: 300,
          taxAmount: 54,
          shippingAmount: 50,
          discountAmount: 0,
          grandTotal: 404,
          currency: 'INR'
        },
        status: 'delivered',
        trackingInfo: {
          courier: 'BlueDart',
          trackingNumber: 'BD123456789',
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        }
      },
      {
        orderNumber: 'SDPC-2024-002',
        customer: {
          name: 'Priya Sharma',
          email: 'priya@example.com',
          phone: '9876543211',
          company: 'Design Studio'
        },
        delivery: {
          method: 'pickup',
          address: {
            line1: '456 Brigade Road',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560025',
            country: 'India'
          }
        },
        payment: {
          method: 'razorpay',
          status: 'completed',
          transactionId: 'txn_123456790',
          razorpayOrderId: 'order_123456790'
        },
        items: [
          {
            productId: products[1]._id,
            productName: products[1].name,
            variant: 'Premium Glossy',
            quantity: 500,
            unitPrice: 250,
            totalPrice: 1250
          }
        ],
        artworkFiles: ['business_card_design.ai'],
        notes: 'Urgent delivery required',
        pricing: {
          subtotal: 1250,
          taxAmount: 225,
          shippingAmount: 0,
          discountAmount: 100,
          grandTotal: 1375,
          currency: 'INR'
        },
        status: 'processing',
        trackingInfo: {
          courier: '',
          trackingNumber: '',
          estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        }
      },
      {
        orderNumber: 'SDPC-2024-003',
        customer: {
          name: 'Amit Patel',
          email: 'amit@example.com',
          phone: '9876543212',
          company: 'Marketing Agency'
        },
        delivery: {
          method: 'courier',
          address: {
            line1: '789 Commercial Street',
            line2: '2nd Floor, Office 201',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560008',
            country: 'India'
          }
        },
        payment: {
          method: 'cod',
          status: 'pending',
          transactionId: '',
          razorpayOrderId: ''
        },
        items: [
          {
            productId: products[0]._id,
            productName: products[0].name,
            variant: 'A4 Premium',
            quantity: 200,
            unitPrice: 4,
            totalPrice: 800
          },
          {
            productId: products[1]._id,
            productName: products[1].name,
            variant: 'Premium Matte',
            quantity: 1000,
            unitPrice: 200,
            totalPrice: 2000
          }
        ],
        artworkFiles: ['brochure_design.pdf', 'card_design.pdf'],
        notes: 'Bulk order for client presentation',
        pricing: {
          subtotal: 2800,
          taxAmount: 504,
          shippingAmount: 50,
          discountAmount: 200,
          grandTotal: 3154,
          currency: 'INR'
        },
        status: 'confirmed',
        trackingInfo: {
          courier: '',
          trackingNumber: '',
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
        }
      },
      {
        orderNumber: 'SDPC-2024-004',
        customer: {
          name: 'Sneha Reddy',
          email: 'sneha@example.com',
          phone: '9876543213',
          company: 'Event Management Co'
        },
        delivery: {
          method: 'courier',
          address: {
            line1: '321 Residency Road',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560025',
            country: 'India'
          }
        },
        payment: {
          method: 'razorpay',
          status: 'completed',
          transactionId: 'txn_123456791',
          razorpayOrderId: 'order_123456791'
        },
        items: [
          {
            productId: products[1]._id,
            productName: products[1].name,
            variant: 'Premium Spot UV',
            quantity: 2000,
            unitPrice: 350,
            totalPrice: 7000
          }
        ],
        artworkFiles: ['event_cards_design.psd'],
        notes: 'For corporate event - premium quality required',
        pricing: {
          subtotal: 7000,
          taxAmount: 1260,
          shippingAmount: 100,
          discountAmount: 500,
          grandTotal: 7860,
          currency: 'INR'
        },
        status: 'shipped',
        trackingInfo: {
          courier: 'DTDC',
          trackingNumber: 'DTDC123456789',
          estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
        }
      },
      {
        orderNumber: 'SDPC-2024-005',
        customer: {
          name: 'Vikram Singh',
          email: 'vikram@example.com',
          phone: '9876543214',
          company: 'Startup Inc'
        },
        delivery: {
          method: 'pickup',
          address: {
            line1: '654 Koramangala',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560034',
            country: 'India'
          }
        },
        payment: {
          method: 'razorpay',
          status: 'completed',
          transactionId: 'txn_123456792',
          razorpayOrderId: 'order_123456792'
        },
        items: [
          {
            productId: products[0]._id,
            productName: products[0].name,
            variant: 'A4 Heavy',
            quantity: 50,
            unitPrice: 5,
            totalPrice: 250
          }
        ],
        artworkFiles: ['startup_pitch_deck.pdf'],
        notes: 'Small test order',
        pricing: {
          subtotal: 250,
          taxAmount: 45,
          shippingAmount: 0,
          discountAmount: 0,
          grandTotal: 295,
          currency: 'INR'
        },
        status: 'pending',
        trackingInfo: {
          courier: '',
          trackingNumber: '',
          estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
        }
      }
    ]
    
    // Create orders
    for (const orderData of sampleOrders) {
      const order = new Order(orderData)
      await order.save()
      console.log(`✅ Created order: ${order.orderNumber} - ${order.customer.name}`)
    }
    
    console.log(`\n🎉 Successfully created ${sampleOrders.length} sample orders!`)
    
    // Display summary
    const totalOrders = await Order.countDocuments()
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$pricing.grandTotal' } } }
    ])
    
    console.log('\n📊 Order Summary:')
    console.log(`   Total Orders: ${totalOrders}`)
    console.log(`   Total Revenue: ₹${totalRevenue[0]?.total || 0}`)
    
  } catch (error) {
    console.error('❌ Error creating sample orders:', error.message)
  }
}

async function main() {
  try {
    console.log('🚀 Creating Sample Orders for Print Shop...\n')
    
    // Connect to database
    await connectToDatabase()
    
    // Create sample orders
    await createSampleOrders()
    
    console.log('\n🎉 Sample orders creation completed successfully!')
    console.log('\n📝 Next Steps:')
    console.log('   1. Check your admin dashboard for updated statistics')
    console.log('   2. View orders in the admin panel')
    console.log('   3. Test order management features')
    
  } catch (error) {
    console.error('\n❌ Sample orders creation failed:', error.message)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('\n🔌 Disconnected from MongoDB')
  }
}

main()
