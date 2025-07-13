import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Product from '@/models/Product';

// GET /api/search - Search products
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = parseInt(searchParams.get('skip') || '0');
    
    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        products: [],
        total: 0,
        message: 'Veuillez saisir un terme de recherche'
      });
    }
    
    // Build search criteria
    const searchCriteria: {
      $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
      category?: { $regex: string; $options: string };
    } = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    };
    
    // Add category filter if specified
    if (category) {
      searchCriteria.category = { $regex: category, $options: 'i' };
    }
    
    // Get total count for pagination
    const total = await Product.countDocuments(searchCriteria);
    
    // Fetch products with pagination
    const products = await Product.find(searchCriteria)
      .select('name description category image price variants inStock')
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 });
    
    return NextResponse.json({
      success: true,
      products,
      total,
      page: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + limit < total
    });
    
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la recherche' },
      { status: 500 }
    );
  }
}
