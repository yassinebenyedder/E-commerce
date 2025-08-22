import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Product from '@/models/Product';

// GET /api/products - Get all products for clients
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const priceRange = searchParams.get('priceRange');
    const sortBy = searchParams.get('sortBy');
    const limit = parseInt(searchParams.get('limit') || '0');

    // Build query
    const query: {
      category?: { $regex: string; $options: string };
      variants?: { $elemMatch: { price: { $gte?: number; $lte?: number } } };
      $or?: Array<{
        name?: { $regex: string; $options: string };
        description?: { $regex: string; $options: string };
        category?: { $regex: string; $options: string };
      }>;
    } = {};
    
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Price range filtering
    if (priceRange) {
      if (priceRange === '100') {
        // Handle 100+ range
        query.variants = { $elemMatch: { price: { $gte: 100 } } };
      } else {
        const [min, max] = priceRange.split('-').map(Number);
        if (max) {
          query.variants = { $elemMatch: { price: { $gte: min, $lte: max } } };
        } else {
          query.variants = { $elemMatch: { price: { $gte: min } } };
        }
      }
    }

    // Execute query
    let productQuery = Product.find(query);
    
    // Sorting
    if (sortBy) {
      switch (sortBy) {
        case 'price-low':
          productQuery = productQuery.sort({ 'variants.price': 1 });
          break;
        case 'price-high':
          productQuery = productQuery.sort({ 'variants.price': -1 });
          break;
        case 'newest':
          productQuery = productQuery.sort({ createdAt: -1 });
          break;
        case 'alphabetical-asc':
          productQuery = productQuery.sort({ name: 1 });
          break;
        case 'alphabetical-desc':
          productQuery = productQuery.sort({ name: -1 });
          break;
        default:
          // Default : alphabetical ascending sorting
          productQuery = productQuery.sort({ name: 1 });
          break;
      }
    } else {
      // Default : alphabetical ascending sorting when no sortBy is specified
      productQuery = productQuery.sort({ name: 1 });
    }
    
    if (limit > 0) {
      productQuery = productQuery.limit(limit);
    }
    
    const products = await productQuery.lean();

    return NextResponse.json({
      success: true,
      products: products
    });

  } catch {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products' 
      },
      { status: 500 }
    );
  }
}
