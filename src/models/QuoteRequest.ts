import mongoose, { Schema, Document } from 'mongoose';

export interface IQuoteRequest extends Document {
  quoteNumber: string;
  customer: {
    phone: string;
    email?: string;
    name?: string;
  };
  delivery: {
    method: 'pickup' | 'delivery';
    address?: string;
  };
  quantity: number; // Total quantity (sum of all file quantities)
  files: Array<{
    key: string;
    url?: string;
    quantity: number;
    name: string;
    colorMode: 'color' | 'grayscale'; // Color mode per file
    paperSize: string; // Paper size per file
  }>; // Files with individual quantities, color modes, and paper sizes
  message?: string;
  status: 'new' | 'reviewed' | 'replied' | 'completed'; // Updated status workflow
  deliveryStatus?: 'pending' | 'completed'; // Optional delivery tracking
  adminNotes?: string; // Admin internal notes
  auditTrail: Array<{
    action: string;
    performedBy?: string; // Admin ID or 'system'
    timestamp: Date;
    notes?: string;
  }>; // Audit trail for all status changes
  quotedAmount?: number;
  quotedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const QuoteRequestSchema: Schema = new Schema({
  quoteNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customer: {
    phone: { type: String, required: true },
    email: { type: String },
    name: { type: String },
  },
  delivery: {
    method: {
      type: String,
      enum: ['pickup', 'delivery'],
      required: true,
    },
    address: { type: String },
  },
  quantity: { type: Number, required: true }, // Total quantity
  files: [{
    key: { type: String, required: true },
    url: { type: String },
    quantity: { type: Number, required: true },
    name: { type: String, required: true },
    colorMode: {
      type: String,
      enum: ['color', 'grayscale'],
      default: 'color',
      required: true
    },
    paperSize: { type: String, required: true } // Paper size per file
  }],
  message: { type: String },
  status: {
    type: String,
    enum: ['new', 'reviewed', 'replied', 'completed'],
    default: 'new',
  },
  deliveryStatus: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  adminNotes: { type: String },
  auditTrail: [{
    action: { type: String, required: true },
    performedBy: { type: String },
    timestamp: { type: Date, default: Date.now },
    notes: { type: String }
  }],
  quotedAmount: { type: Number },
  quotedAt: { type: Date },
}, {
  timestamps: true,
});

// Indexes for faster queries
QuoteRequestSchema.index({ quoteNumber: 1 });
QuoteRequestSchema.index({ 'customer.phone': 1 });
QuoteRequestSchema.index({ status: 1 });
QuoteRequestSchema.index({ createdAt: -1 });

// Pre-save hook to add initial audit trail entry and initialize status
QuoteRequestSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Add initial audit trail entry
    if (!this.auditTrail || this.auditTrail.length === 0) {
      this.auditTrail = [{
        action: 'Quote created',
        performedBy: 'system',
        timestamp: new Date(),
        notes: 'Quote request submitted by customer'
      }];
    }
    
    // Ensure status is set to 'new' for new quotes
    if (!this.status) {
      this.status = 'new';
    }
  }
  next();
});

export default mongoose.models.QuoteRequest || mongoose.model<IQuoteRequest>('QuoteRequest', QuoteRequestSchema);

