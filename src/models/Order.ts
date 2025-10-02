import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string;
  userId: mongoose.Types.ObjectId;
  customer: {
    name: string;
    email: string;
    phone: string;
    company?: string;
  };
  status: 'placed' | 'preflight' | 'proof_ready' | 'approved' | 'in_production' | 'ready_for_pickup' | 'shipped' | 'completed' | 'cancelled';
  items: Array<{
    productId: mongoose.Types.ObjectId;
    productName: string;
    variant: string; // e.g., "Matte Spot UV"
    quantity: number;
    specifications: Record<string, any>;
    unitPrice: number;
    totalPrice: number;
    files: Array<{
      originalFile: string; // S3 URL
      proofFile?: string; // S3 URL
      printReadyFile?: string; // S3 URL
      fileName: string;
      fileSize: number;
      uploadedAt: Date;
    }>;
  }>;
  artwork_files: string[]; // S3 URLs for customer uploaded artwork
  pricing: {
    subtotal: number;
    taxAmount: number;
    shippingAmount: number;
    discountAmount: number;
    grandTotal: number;
    currency: string;
  };
  delivery: {
    method: 'pickup' | 'courier';
    address?: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
    pickupSlot?: {
      date: Date;
      timeSlot: string;
    };
    courierDetails?: {
      carrier: string;
      trackingNumber?: string;
      estimatedDelivery?: Date;
    };
  };
  payment: {
    method: 'razorpay' | 'cod';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    amount: number;
  };
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  gst: {
    gstin?: string;
    cgst: number;
    sgst: number;
    igst: number;
    totalTax: number;
  };
  notes?: string;
  estimatedCompletion?: Date;
  actualCompletion?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String },
  },
  status: {
    type: String,
    enum: ['placed', 'preflight', 'proof_ready', 'approved', 'in_production', 'ready_for_pickup', 'shipped', 'completed', 'cancelled'],
    default: 'placed',
  },
  items: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productName: { type: String, required: true },
    variant: { type: String, required: true }, // e.g., "Matte Spot UV"
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    specifications: {
      type: Schema.Types.Mixed,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    files: [{
      originalFile: { type: String, required: true },
      proofFile: String,
      printReadyFile: String,
      fileName: { type: String, required: true },
      fileSize: { type: Number, required: true },
      uploadedAt: { type: Date, default: Date.now },
    }],
  }],
  artwork_files: [{ type: String }], // S3 URLs for customer uploaded artwork
  pricing: {
    subtotal: { type: Number, required: true, min: 0 },
    taxAmount: { type: Number, required: true, min: 0 },
    shippingAmount: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
  },
  delivery: {
    method: {
      type: String,
      enum: ['pickup', 'courier'],
      required: true,
    },
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'IN' },
    },
    pickupSlot: {
      date: Date,
      timeSlot: String,
    },
    courierDetails: {
      carrier: String,
      trackingNumber: String,
      estimatedDelivery: Date,
    },
  },
  payment: {
    method: {
      type: String,
      enum: ['razorpay', 'cod'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    amount: { type: Number, required: true, min: 0 },
  },
  payment_status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  gst: {
    gstin: String,
    cgst: { type: Number, default: 0 },
    sgst: { type: Number, default: 0 },
    igst: { type: Number, default: 0 },
    totalTax: { type: Number, required: true, min: 0 },
  },
  notes: String,
  estimatedCompletion: Date,
  actualCompletion: Date,
}, {
  timestamps: true,
});

// Indexes for faster queries
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ userId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: 1 });
OrderSchema.index({ 'payment.status': 1 });

// Generate order number before saving
OrderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Get count of orders for today
    const todayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    const count = await mongoose.model('Order').countDocuments({
      createdAt: { $gte: todayStart, $lt: todayEnd }
    });
    
    this.orderNumber = `CP${year}${month}${day}${(count + 1).toString().padStart(3, '0')}`;
  }
  next();
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
