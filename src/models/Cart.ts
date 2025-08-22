import mongoose from 'mongoose';

export interface CartItemDoc {
  productId: string;
  variantId?: string;
  quantity: number;
  addedAt: Date;
}

const cartItemSchema = new mongoose.Schema<CartItemDoc>({
  productId: { type: String, required: true },
  variantId: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  addedAt: { type: Date, default: Date.now }
});

const cartSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  items: [cartItemSchema],
  updatedAt: { type: Date, default: Date.now }
});

cartSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);
