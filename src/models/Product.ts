import mongoose from 'mongoose';

// TypeScript interface for product variant
interface IVariant {
  name: string;
  price: number;
  originalPrice?: number | null;
  sku?: string | null;
  inStock: boolean;
  stockQuantity: number;
  isDefault: boolean;
}

// Schema for product variants (e.g., different sizes, colors, etc.)
const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Variant name is required'],
    trim: true,
    maxlength: [50, 'Variant name cannot exceed 50 characters']
  },
  price: {
    type: Number,
    required: [true, 'Variant price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  sku: {
    type: String,
    trim: true
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    min: [0, 'Stock quantity cannot be negative'],
    default: 0
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { _id: true });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  // Remove single price field as variants will have individual prices
  basePrice: {
    type: Number,
    min: [0, 'Base price cannot be negative'],
    default: 0
  },
  variants: {
    type: [variantSchema],
    validate: {
      validator: function(variants: IVariant[]) {
        return variants && variants.length > 0;
      },
      message: 'Product must have at least one variant'
    }
  },
  image: {
    type: String,
    required: [true, 'Product image is required']
  },
  images: [{
    type: String
  }],
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },
  reviewCount: {
    type: Number,
    min: [0, 'Review count cannot be negative'],
    default: 0
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  inStock: {
    type: Boolean,
    default: true
  },
  // Base SKU for the product (variants will have their own SKUs)
  baseSku: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

// Virtual to get the default variant (marked as default or first variant)
productSchema.virtual('defaultVariant').get(function() {
  if (!this.variants || this.variants.length === 0) return null;
  return this.variants.find((variant: IVariant) => variant.isDefault) || this.variants[0];
});

// Virtual to get price range for display
productSchema.virtual('priceRange').get(function() {
  if (!this.variants || this.variants.length === 0) return { min: 0, max: 0 };
  const prices = this.variants.map((variant: IVariant) => variant.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
});

// Method to check if product has multiple variants
productSchema.methods.hasMultipleVariants = function() {
  return this.variants && this.variants.length > 1;
};

// Method to get variant by ID
productSchema.methods.getVariant = function(variantId: string) {
  return this.variants && this.variants.id(variantId);
};

// Pre-save middleware to ensure at least one default variant
productSchema.pre('save', function(next) {
  if (this.variants && this.variants.length > 0) {
    const hasDefault = this.variants.some((variant: IVariant) => variant.isDefault);
    if (!hasDefault) {
      this.variants[0].isDefault = true;
    }
  }
  next();
});

// Create indexes for better query performance
productSchema.index({ category: 1 });
productSchema.index({ 'variants.price': 1 });
productSchema.index({ rating: -1 });
productSchema.index({ name: 'text', category: 'text' });
productSchema.index({ 'variants.sku': 1 });

export default mongoose.models.Product || mongoose.model('Product', productSchema);
