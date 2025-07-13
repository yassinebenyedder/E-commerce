const mongoose = require('mongoose');

// Admin model definition (since we can't import TS files in JS)
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Admin name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Admin email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
const bcrypt = require('bcryptjs');
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://benyedderyassin7:UMza9Crj3c3akPNR@cluster0.e2aee.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0';

async function createFirstAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if any admin exists
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
      return;
    }

    // Create first admin
    const admin = new Admin({
      name: 'Administrator',
      email: 'admin@example.com',
      password: 'admin123', // This will be hashed automatically
      isActive: true
    });

    await admin.save();
    console.log('First admin created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('Please change these credentials after first login.');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createFirstAdmin();
