import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Category title is required'],
    trim: true,
    unique: true,
    maxlength: [50, 'Category title cannot exceed 50 characters']
  },
  image: {
    type: String,
    required: [true, 'Category image is required']
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 1,
    min: 1
  }
}, {
  timestamps: true
});

// Create indexes
categorySchema.index({ isActive: 1, order: 1 });

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
