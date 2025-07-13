import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  image: { type: String, required: true },
  category: { type: String, required: true, trim: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, min: 0, default: 0 },
  isOnSale: { type: Boolean, default: false },
  description: { type: String, maxlength: 1000 },
  inStock: { type: Boolean, default: true },
  sku: { type: String, unique: true, sparse: true }
}, { timestamps: true });

// Promotion Schema
const promotionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  subtitle: { type: String, required: true, trim: true, maxlength: 200 },
  image: { type: String, required: true },
  ctaText: { type: String, required: true, trim: true, maxlength: 50 },
  ctaLink: { type: String, required: true, trim: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 1, min: 1 },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date }
}, { timestamps: true });

// Order Schema
const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  clientName: { type: String, required: true, trim: true },
  clientEmail: { type: String, required: true, trim: true, lowercase: true },
  clientAddress: { type: String, required: true, trim: true },
  clientPhone: { type: String, required: true, trim: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, required: true }
  }],
  total: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  notes: { type: String, maxlength: 500 }
}, { timestamps: true });

// Create models
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Promotion = mongoose.models.Promotion || mongoose.model('Promotion', promotionSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

// Sample data
const sampleData = {
  products: [
    {
      name: "Premium Coffee Mug",
      price: 24.99,
      originalPrice: 29.99,
      image: "/products/coffee-mug.svg",
      category: "Kitchen",
      rating: 4.5,
      reviewCount: 128,
      isOnSale: true,
      description: "Premium ceramic coffee mug with ergonomic handle.",
      inStock: true,
      sku: "MUG-001"
    },
    {
      name: "Wireless Bluetooth Headphones",
      price: 89.99,
      originalPrice: 129.99,
      image: "/products/headphones.svg",
      category: "Electronics",
      rating: 4.7,
      reviewCount: 245,
      isOnSale: true,
      description: "High-quality wireless headphones with noise cancellation.",
      inStock: true,
      sku: "HEAD-001"
    },
    {
      name: "Leather Laptop Bag",
      price: 129.99,
      image: "/products/leather-bag.svg",
      category: "Accessories",
      rating: 4.3,
      reviewCount: 89,
      isOnSale: false,
      description: "Genuine leather laptop bag with multiple compartments.",
      inStock: true,
      sku: "BAG-001"
    },
    {
      name: "Smart Watch Pro",
      price: 299.99,
      originalPrice: 349.99,
      image: "/products/smart-watch.svg",
      category: "Electronics",
      rating: 4.6,
      reviewCount: 167,
      isOnSale: true,
      description: "Advanced smartwatch with fitness tracking and GPS.",
      inStock: true,
      sku: "WATCH-001"
    },
    {
      name: "Premium Smartphone",
      price: 799.99,
      image: "/products/smartphone.svg",
      category: "Electronics",
      rating: 4.8,
      reviewCount: 324,
      isOnSale: false,
      description: "Latest smartphone with advanced camera system.",
      inStock: true,
      sku: "PHONE-001"
    }
  ],
  
  promotions: [
    {
      title: "Electronics Sale",
      subtitle: "Up to 50% off on all electronic devices",
      image: "/promotions/electronics-sale.svg",
      ctaText: "Shop Now",
      ctaLink: "/categories?category=Electronics",
      isActive: true,
      order: 1,
      startDate: new Date('2024-12-01'),
      endDate: new Date('2025-01-31')
    },
    {
      title: "Fashion Week Special",
      subtitle: "Trendy clothing and accessories at amazing prices",
      image: "/promotions/fashion-week.svg",
      ctaText: "Explore",
      ctaLink: "/categories?category=Clothing",
      isActive: true,
      order: 2,
      startDate: new Date('2024-12-15'),
      endDate: new Date('2025-02-15')
    }
  ]
};

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await Product.deleteMany({});
    await Promotion.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing data');
    
    // Create products
    console.log('📦 Creating products...');
    const products = await Product.insertMany(sampleData.products);
    console.log(`✅ Created ${products.length} products`);
    
    // Create promotions
    console.log('🎯 Creating promotions...');
    const promotions = await Promotion.insertMany(sampleData.promotions);
    console.log(`✅ Created ${promotions.length} promotions`);
    
    // Create sample orders
    console.log('📋 Creating orders...');
    const sampleOrders = [
      {
        orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        clientName: "John Doe",
        clientEmail: "john.doe@email.com",
        clientAddress: "123 Main St, New York, NY 10001",
        clientPhone: "+1-555-0123",
        products: [
          {
            productId: products[0]._id,
            name: products[0].name,
            price: products[0].price,
            quantity: 2,
            image: products[0].image
          }
        ],
        total: products[0].price * 2,
        status: 'confirmed',
        notes: 'Please deliver before 5 PM'
      },
      {
        orderNumber: `ORD-${Date.now() + 1}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        clientName: "Jane Smith",
        clientEmail: "jane.smith@email.com",
        clientAddress: "456 Oak Ave, Los Angeles, CA 90210",
        clientPhone: "+1-555-0456",
        products: [
          {
            productId: products[1]._id,
            name: products[1].name,
            price: products[1].price,
            quantity: 1,
            image: products[1].image
          }
        ],
        total: products[1].price,
        status: 'shipped',
        notes: 'Gift wrapping requested'
      }
    ];
    
    const orders = await Order.insertMany(sampleOrders);
    console.log(`✅ Created ${orders.length} orders`);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Products: ${products.length}`);
    console.log(`   Promotions: ${promotions.length}`);
    console.log(`   Orders: ${orders.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

async function main() {
  await connectDB();
  await seedDatabase();
  await mongoose.connection.close();
  console.log('🔌 Database connection closed');
  process.exit(0);
}

main().catch(console.error);
