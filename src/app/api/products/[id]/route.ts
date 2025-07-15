import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Product from '@/models/Product';
import { isValidObjectId } from 'mongoose';

// GET /api/products/[id] - Get single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('API: Starting product fetch...');
    await connectDB();
    console.log('API: Database connected');
    
    const { id } = await params;
    console.log('API: Product ID received:', id);
    
    // Validate MongoDB ObjectId
    if (!isValidObjectId(id)) {
      console.log('API: Invalid ObjectId:', id);
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    console.log('API: Searching for product with ID:', id);
    
    // Find product by ID
    const product = await Product.findById(id).lean();
    console.log('API: Product found:', !!product);
    
    if (product) {
      console.log('API: Product details:', {
        id: (product as any)._id, // eslint-disable-line @typescript-eslint/no-explicit-any
        name: (product as any).name, // eslint-disable-line @typescript-eslint/no-explicit-any
        hasVariants: !!(product as any).variants, // eslint-disable-line @typescript-eslint/no-explicit-any
        variantCount: (product as any).variants?.length || 0 // eslint-disable-line @typescript-eslint/no-explicit-any
      });
    }

    if (!product) {
      console.log('API: Product not found in database');
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    console.log('API: Returning product successfully');
    return NextResponse.json({
      success: true,
      product: product
    });

  } catch (error) {
    console.error('API: Error fetching product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch product' 
      },
      { status: 500 }
    );
  }
}
