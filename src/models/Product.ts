import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  category: 'documents' | 'business-cards' | 'posters-banners' | 'stickers-labels' | 'stationery' | 'custom';
  images: string[]; // CloudFront URLs
  basePrice: number;
  pricingMethod: 'flat' | 'tier' | 'area';
  sameDayEligible: boolean;
  sameDayCutoff: string; // HH:MM format
  variants: Array<{
    size: string;
    material: string;
    finish: string;
    price: number;
    sku?: string;
    inStock: boolean;
    name?: string; // Display name for variant
  }>;
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
  promotion?: {
    discount: number;
    validUntil: Date;
    isActive: boolean;
    title?: string;
    description?: string;
  };
  featured: boolean;
  active: boolean;
  metaTitle?: string;
  metaDescription?: string;
  // Additional fields for better product management
  tags?: string[];
  weight?: number; // For shipping calculations
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
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
    enum: ['documents', 'business-cards', 'posters-banners', 'stickers-labels', 'stationery', 'custom'],
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
  variants: [{
    size: { type: String, required: true },
    material: { type: String, required: true },
    finish: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    sku: { type: String },
    inStock: { type: Boolean, default: true },
    name: { type: String }, // Display name for variant
  }],
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
  promotion: {
    discount: { type: Number, min: 0, max: 100 },
    validUntil: { type: Date },
    isActive: { type: Boolean, default: false },
    title: { type: String },
    description: { type: String },
  },
  featured: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  metaTitle: {
    type: String,
    trim: true,
  },
  metaDescription: {
    type: String,
    trim: true,
  },
  // Additional fields for better product management
  tags: [{ type: String }],
  weight: { type: Number, min: 0 }, // For shipping calculations
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
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
