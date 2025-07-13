import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Category from '@/models/Category';

// GET - Fetch all categories (including inactive ones for admin)
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ order: 1, createdAt: -1 });
    
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

// PUT - Update category
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { id, title, image, description, isActive, order } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      );
    }
    
    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Check if title is being changed and if new title already exists
    if (title && title.trim() !== category.title) {
      const existingCategory = await Category.findOne({ 
        title: title.trim(),
        _id: { $ne: id }
      });
      if (existingCategory) {
        return NextResponse.json(
          { success: false, error: 'Category with this title already exists' },
          { status: 400 }
        );
      }
    }
    
    // Update category
    const updateData: {
      title?: string;
      image?: string;
      description?: string;
      isActive?: boolean;
      order?: number;
    } = {};
    if (title) updateData.title = title.trim();
    if (image) updateData.image = image;
    if (description !== undefined) updateData.description = description.trim();
    if (isActive !== undefined) updateData.isActive = isActive;
    if (order !== undefined) updateData.order = order;
    
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      category: updatedCategory
    });
    
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      );
    }
    
    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Check if any products are using this category
    const { default: Product } = await import('@/models/Product');
    const productsUsingCategory = await Product.countDocuments({ category: category.title });
    
    if (productsUsingCategory > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete category. ${productsUsingCategory} product(s) are using this category.` 
        },
        { status: 400 }
      );
    }
    
    await Category.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
