import connectDB from './src/lib/connectDB';
import Product from './src/models/Product';
import Promotion from './src/models/Promotion';
import Order from './src/models/Order';

// Sample data
const sampleProducts = [
  {
    name: "Premium Coffee Mug",
    price: 24.99,
    originalPrice: 29.99,
    image: "/products/coffee-mug.svg",
    category: "Kitchen",
    rating: 4.5,
    reviewCount: 128,
    isOnSale: true,
    description: "Premium ceramic coffee mug with ergonomic handle. Perfect for your morning coffee or tea.",
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
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
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
    description: "Genuine leather laptop bag with multiple compartments. Perfect for professionals.",
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
    description: "Advanced smartwatch with fitness tracking, GPS, and 7-day battery life.",
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
    description: "Latest smartphone with advanced camera system and 5G connectivity.",
    inStock: true,
    sku: "PHONE-001"
  },
  {
    name: "Cotton T-Shirt",
    price: 19.99,
    originalPrice: 24.99,
    image: "/products/t-shirt.svg",
    category: "Clothing",
    rating: 4.2,
    reviewCount: 156,
    isOnSale: true,
    description: "100% organic cotton t-shirt. Comfortable and breathable fabric.",
    inStock: true,
    sku: "SHIRT-001"
  },
  {
    name: "Wireless Speaker",
    price: 69.99,
    image: "/products/wireless-speaker.svg",
    category: "Electronics",
    rating: 4.4,
    reviewCount: 203,
    isOnSale: false,
    description: "Portable wireless speaker with 360-degree sound and waterproof design.",
    inStock: true,
    sku: "SPEAKER-001"
  },
  {
    name: "Yoga Mat Pro",
    price: 39.99,
    originalPrice: 49.99,
    image: "/products/yoga-mat.svg",
    category: "Fitness",
    rating: 4.5,
    reviewCount: 98,
    isOnSale: true,
    description: "Professional yoga mat with superior grip and extra cushioning.",
    inStock: true,
    sku: "YOGA-001"
  }
];

const samplePromotions = [
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
  },
  {
    title: "Home & Living",
    subtitle: "Transform your space with our curated collection",
    image: "/promotions/home-living.svg",
    ctaText: "Discover",
    ctaLink: "/categories?category=Kitchen",
    isActive: true,
    order: 3,
    startDate: new Date('2024-11-01'),
    endDate: new Date('2025-03-31')
  }
];

function generateOrderNumber(): string {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Product.deleteMany({});
    await Promotion.deleteMany({});
    await Order.deleteMany({});
    
    // Create products
    console.log('📦 Creating products...');
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Created ${products.length} products`);
    
    // Create promotions
    console.log('🎯 Creating promotions...');
    const promotions = await Promotion.insertMany(samplePromotions);
    console.log(`✅ Created ${promotions.length} promotions`);
    
    // Create sample orders
    console.log('📋 Creating orders...');
    const sampleOrders = [
      {
        orderNumber: generateOrderNumber(),
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
          },
          {
            productId: products[1]._id,
            name: products[1].name,
            price: products[1].price,
            quantity: 1,
            image: products[1].image
          }
        ],
        total: (products[0].price * 2) + products[1].price,
        status: 'confirmed',
        notes: 'Please deliver before 5 PM'
      },
      {
        orderNumber: generateOrderNumber(),
        clientName: "Jane Smith",
        clientEmail: "jane.smith@email.com",
        clientAddress: "456 Oak Ave, Los Angeles, CA 90210",
        clientPhone: "+1-555-0456",
        products: [
          {
            productId: products[3]._id,
            name: products[3].name,
            price: products[3].price,
            quantity: 1,
            image: products[3].image
          }
        ],
        total: products[3].price,
        status: 'shipped',
        notes: 'Gift wrapping requested'
      },
      {
        orderNumber: generateOrderNumber(),
        clientName: "Mike Johnson",
        clientEmail: "mike.johnson@email.com",
        clientAddress: "789 Pine St, Chicago, IL 60601",
        clientPhone: "+1-555-0789",
        products: [
          {
            productId: products[2]._id,
            name: products[2].name,
            price: products[2].price,
            quantity: 1,
            image: products[2].image
          },
          {
            productId: products[5]._id,
            name: products[5].name,
            price: products[5].price,
            quantity: 3,
            image: products[5].image
          }
        ],
        total: products[2].price + (products[5].price * 3),
        status: 'pending',
        notes: ''
      },
      {
        orderNumber: generateOrderNumber(),
        clientName: "Sarah Wilson",
        clientEmail: "sarah.wilson@email.com",
        clientAddress: "321 Elm St, Houston, TX 77001",
        clientPhone: "+1-555-0321",
        products: [
          {
            productId: products[4]._id,
            name: products[4].name,
            price: products[4].price,
            quantity: 1,
            image: products[4].image
          }
        ],
        total: products[4].price,
        status: 'delivered',
        notes: 'Left at front door as requested'
      },
      {
        orderNumber: generateOrderNumber(),
        clientName: "David Brown",
        clientEmail: "david.brown@email.com",
        clientAddress: "654 Maple Ave, Phoenix, AZ 85001",
        clientPhone: "+1-555-0654",
        products: [
          {
            productId: products[6]._id,
            name: products[6].name,
            price: products[6].price,
            quantity: 2,
            image: products[6].image
          },
          {
            productId: products[7]._id,
            name: products[7].name,
            price: products[7].price,
            quantity: 1,
            image: products[7].image
          }
        ],
        total: (products[6].price * 2) + products[7].price,
        status: 'confirmed',
        notes: 'Business address - call before delivery'
      }
    ];
    
    const orders = await Order.insertMany(sampleOrders);
    console.log(`✅ Created ${orders.length} orders`);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Products: ${products.length}`);
    console.log(`   Promotions: ${promotions.length}`);
    console.log(`   Orders: ${orders.length}`);
    
    console.log('\n🏪 Your e-commerce database is now ready with sample data!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

// Run the seeding
seedDatabase();
