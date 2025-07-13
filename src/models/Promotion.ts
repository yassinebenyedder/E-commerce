import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Promotion title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  subtitle: {
    type: String,
    required: [true, 'Promotion subtitle is required'],
    trim: true,
    maxlength: [200, 'Subtitle cannot exceed 200 characters']
  },
  image: {
    type: String,
    required: [true, 'Promotion image is required']
  },
  ctaText: {
    type: String,
    required: [true, 'CTA text is required'],
    trim: true,
    maxlength: [50, 'CTA text cannot exceed 50 characters']
  },
  ctaLink: {
    type: String,
    required: [true, 'CTA link is required'],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 1,
    min: 1
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Create indexes
promotionSchema.index({ isActive: 1, order: 1 });
promotionSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.models.Promotion || mongoose.model('Promotion', promotionSchema);
