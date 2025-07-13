// Sample data seeder script
// This script can be run to populate the database with sample data

const mongoose = require('mongoose');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://benyedderyassin7:UMza9Crj3c3akPNR@cluster0.e2aee.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0'
    );
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, default: '/products/placeholder.svg' },
  inStock: { type: Boolean, default: true },
}, {
  timestamps: true,
});

// Promotion schema
const promotionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: '/promotions/placeholder.svg' },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
const Promotion = mongoose.model('Promotion', promotionSchema);

// Sample data
const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 79.99,
    category: 'Electronics',
    image: '/products/headphones.svg',
    inStock: true,
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracker with heart rate monitoring, GPS, and water resistance.',
    price: 199.99,
    category: 'Electronics',
    image: '/products/smart-watch.svg',
    inStock: true,
  },
  {
    name: 'Premium Coffee Mug',
    description: 'Insulated ceramic coffee mug that keeps your drink hot for hours.',
    price: 24.99,
    category: 'Home & Kitchen',
    image: '/products/coffee-mug.svg',
    inStock: true,
  },
  {
    name: 'Leather Messenger Bag',
    description: 'Handcrafted genuine leather bag perfect for work or travel.',
    price: 149.99,
    category: 'Fashion',
    image: '/products/leather-bag.svg',
    inStock: true,
  },
  {
    name: 'Smartphone Pro Max',
    description: 'Latest smartphone with advanced camera system and 5G connectivity.',
    price: 999.99,
    category: 'Electronics',
    image: '/products/smartphone.svg',
    inStock: true,
  },
  {
    name: 'Cotton T-Shirt',
    description: 'Comfortable 100% organic cotton t-shirt available in multiple colors.',
    price: 29.99,
    category: 'Fashion',
    image: '/products/t-shirt.svg',
    inStock: true,
  },
  {
    name: 'Wireless Speaker',
    description: 'Portable Bluetooth speaker with 360-degree sound and waterproof design.',
    price: 89.99,
    category: 'Electronics',
    image: '/products/wireless-speaker.svg',
    inStock: true,
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat made from eco-friendly materials with carrying strap.',
    price: 39.99,
    category: 'Sports & Fitness',
    image: '/products/yoga-mat.svg',
    inStock: true,
  },
];

const samplePromotions = [
  {
    title: 'Electronics Sale - Up to 50% Off',
    description: 'Huge discounts on all electronic items. Limited time offer!',
    image: '/promotions/electronics-sale.svg',
    isActive: true,
  },
  {
    title: 'Fashion Week Special',
    description: 'Trendy fashion items at unbeatable prices. New arrivals included!',
    image: '/promotions/fashion-week.svg',
    isActive: true,
  },
  {
    title: 'Home & Living Collection',
    description: 'Transform your home with our curated collection of home essentials.',
    image: '/promotions/home-living.svg',
    isActive: true,
  },
];

// Seed function
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany({});
    await Promotion.deleteMany({});

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${products.length} products`);

    // Insert sample promotions
    const promotions = await Promotion.insertMany(samplePromotions);
    console.log(`Inserted ${promotions.length} promotions`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
