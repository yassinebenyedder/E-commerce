import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Product from '@/models/Product';
import Promotion from '@/models/Promotion';

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

// POST - Initialize database with sample data
export async function POST() {
  try {
    await connectDB();

    // Check if data already exists
    const existingProducts = await Product.countDocuments();
    const existingPromotions = await Promotion.countDocuments();

    let message = '';
    let productsCount = 0;
    let promotionsCount = 0;

    // Add products if none exist
    if (existingProducts === 0) {
      const products = await Product.insertMany(sampleProducts);
      productsCount = products.length;
      message += `Inserted ${productsCount} products. `;
    } else {
      message += `${existingProducts} products already exist. `;
    }

    // Add promotions if none exist
    if (existingPromotions === 0) {
      const promotions = await Promotion.insertMany(samplePromotions);
      promotionsCount = promotions.length;
      message += `Inserted ${promotionsCount} promotions.`;
    } else {
      message += `${existingPromotions} promotions already exist.`;
    }

    return NextResponse.json({
      success: true,
      message,
      data: {
        productsInserted: productsCount,
        promotionsInserted: promotionsCount,
        existingProducts,
        existingPromotions,
      }
    });

  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}

// GET - Check database status
export async function GET() {
  try {
    await connectDB();
    
    const productsCount = await Product.countDocuments();
    const promotionsCount = await Promotion.countDocuments();
    
    return NextResponse.json({
      success: true,
      status: {
        products: productsCount,
        promotions: promotionsCount,
        isInitialized: productsCount > 0 && promotionsCount > 0
      }
    });

  } catch (error) {
    console.error('Error checking database status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check database status' },
      { status: 500 }
    );
  }
}
