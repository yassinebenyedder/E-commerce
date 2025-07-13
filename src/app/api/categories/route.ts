import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Category from '@/models/Category';

// GET - Fetch all categories
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
    
    return NextResponse.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { title, image, description, order } = body;
    
    // Validation
    if (!title || !image) {
      return NextResponse.json(
        { success: false, error: 'Title and image are required' },
        { status: 400 }
      );
    }
    
    // Check if category with same title already exists
    const existingCategory = await Category.findOne({ title: title.trim() });
    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category with this title already exists' },
        { status: 400 }
      );
    }
    
    const category = new Category({
      title: title.trim(),
      image,
      description: description?.trim() || '',
      order: order || 1
    });
    
    await category.save();
    
    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      category
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
