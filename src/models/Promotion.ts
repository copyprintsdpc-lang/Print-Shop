import mongoose, { Schema, Document } from 'mongoose';

export interface IPromotion extends Document {
  title: string;
  description?: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate: Date;
  endDate: Date;
  applicableProducts: mongoose.Types.ObjectId[]; // Array of product IDs
  applicableCategories: string[]; // Array of category names
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PromotionSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage',
  },
  minOrderAmount: {
    type: Number,
    min: 0,
  },
  maxDiscountAmount: {
    type: Number,
    min: 0,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  applicableProducts: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],
  applicableCategories: [{
    type: String,
    enum: ['documents', 'business-cards', 'posters-banners', 'stickers-labels', 'stationery', 'custom'],
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  usageLimit: {
    type: Number,
    min: 1,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Indexes for faster queries
PromotionSchema.index({ startDate: 1, endDate: 1 });
PromotionSchema.index({ isActive: 1 });
PromotionSchema.index({ applicableProducts: 1 });
PromotionSchema.index({ applicableCategories: 1 });

// Virtual to check if promotion is currently active
PromotionSchema.virtual('isCurrentlyActive').get(function() {
  const now = new Date();
  return this.isActive && 
         this.startDate <= now && 
         this.endDate >= now &&
         (!this.usageLimit || this.usedCount < this.usageLimit);
});

export default mongoose.models.Promotion || mongoose.model<IPromotion>('Promotion', PromotionSchema);

