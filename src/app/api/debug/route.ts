import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Product from '@/models/Product';
import { isValidObjectId } from 'mongoose';

export async function GET() {
  try {
    console.log('Debug: Starting debug check...');
    
    // Check environment variables
    const mongoUri = process.env.MONGODB_URI;
    const hasMongoUri = !!mongoUri;
    
    console.log('Debug: MongoDB URI exists:', hasMongoUri);
    console.log('Debug: Node environment:', process.env.NODE_ENV);
    
    let dbConnected = false;
    let totalProducts = 0;
    let sampleProducts = [];
    let specificProduct = null;
    
    try {
      // Check database connection
      await connectDB();
      dbConnected = true;
      console.log('Debug: Database connected successfully');
      
      // Count total products
      totalProducts = await Product.countDocuments();
      console.log('Debug: Total products in database:', totalProducts);
      
      // Get first 3 products
      const rawSampleProducts = await Product.find({}).limit(3).lean();
      sampleProducts = rawSampleProducts.map(p => ({ 
        id: p._id?.toString(), 
        name: p.name 
      }));
      console.log('Debug: Sample products:', sampleProducts);
      
      // Check specific product ID
      const testId = '68769a0f4ae7fe0f300e5f12';
      console.log('Debug: Testing ID:', testId);
      console.log('Debug: Is valid ObjectId:', isValidObjectId(testId));
      
      if (isValidObjectId(testId)) {
        const rawSpecificProduct = await Product.findById(testId).lean();
        specificProduct = rawSpecificProduct ? { 
          id: rawSpecificProduct._id?.toString(), 
          name: rawSpecificProduct.name 
        } : null;
        console.log('Debug: Specific product found:', !!specificProduct);
      }

    } catch (dbError) {
      console.error('Debug: Database error:', dbError);
    }
    
    return NextResponse.json({
      success: true,
      debug: {
        mongoUriExists: hasMongoUri,
        dbConnected,
        totalProducts,
        sampleProducts,
        testId: '68769a0f4ae7fe0f300e5f12',
        isValidObjectId: isValidObjectId('68769a0f4ae7fe0f300e5f12'),
        specificProductFound: !!specificProduct,
        specificProduct,
        nodeEnv: process.env.NODE_ENV
      }
    });

  } catch (error) {
    console.error('Debug: Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        mongoUriExists: !!process.env.MONGODB_URI,
        dbConnected: false,
        totalProducts: 0,
        sampleProducts: [],
        testId: '68769a0f4ae7fe0f300e5f12',
        isValidObjectId: isValidObjectId('68769a0f4ae7fe0f300e5f12'),
        specificProductFound: false,
        specificProduct: null,
        nodeEnv: process.env.NODE_ENV
      }
    });
  }
}
