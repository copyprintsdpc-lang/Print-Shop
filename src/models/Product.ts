import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  category: 'documents' | 'business-cards' | 'posters-banners' | 'stickers-labels' | 'custom';
  images: string[];
  basePrice: number;
  pricingMethod: 'flat' | 'tier' | 'area';
  sameDayEligible: boolean;
  sameDayCutoff: string; // HH:MM format
  options: Array<{
    name: string;
    type: 'select' | 'boolean' | 'numeric' | 'dim2';
    required: boolean;
    values: Array<{
      value: string;
      label: string;
      priceDelta: number;
      priceDeltaType: 'flat' | 'percent';
    }>;
  }>;
  pricingTiers: Array<{
    minQty: number;
    unitPrice: number;
  }>;
  areaPricing?: {
    pricePerSqFt: number;
    minCharge: number;
  };
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['documents', 'business-cards', 'posters-banners', 'stickers-labels', 'custom'],
    required: true,
  },
  images: [{
    type: String,
    required: true,
  }],
  basePrice: {
    type: Number,
    required: true,
    min: 0,
  },
  pricingMethod: {
    type: String,
    enum: ['flat', 'tier', 'area'],
    required: true,
  },
  sameDayEligible: {
    type: Boolean,
    default: false,
  },
  sameDayCutoff: {
    type: String,
    default: '12:00',
  },
  options: [{
    name: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['select', 'boolean', 'numeric', 'dim2'], 
      required: true 
    },
    required: { type: Boolean, default: false },
    values: [{
      value: { type: String, required: true },
      label: { type: String, required: true },
      priceDelta: { type: Number, default: 0 },
      priceDeltaType: { 
        type: String, 
        enum: ['flat', 'percent'], 
        default: 'flat' 
      },
    }],
  }],
  pricingTiers: [{
    minQty: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
  }],
  areaPricing: {
    pricePerSqFt: { type: Number, min: 0 },
    minCharge: { type: Number, min: 0 },
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes for faster queries
ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ active: 1 });
ProductSchema.index({ 'options.name': 1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
