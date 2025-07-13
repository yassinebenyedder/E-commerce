import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Promotion from '@/models/Promotion';

// GET all promotions for admin
export async function GET() {
  try {
    await connectDB();
    const promotions = await Promotion.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      promotions
    });
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch promotions' },
      { status: 500 }
    );
  }
}

// POST - Create new promotion
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { title, subtitle, image, ctaText, ctaLink, isActive = true } = body;

    // Validation
    if (!title || !subtitle || !ctaText || !ctaLink) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, subtitle, ctaText, ctaLink' },
        { status: 400 }
      );
    }

    // Create new promotion
    const promotion = new Promotion({
      title,
      subtitle,
      image: image || '/promotions/placeholder.svg',
      ctaText,
      ctaLink,
      isActive
    });

    const savedPromotion = await promotion.save();

    return NextResponse.json({
      success: true,
      promotion: savedPromotion,
      message: 'Promotion created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating promotion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create promotion' },
      { status: 500 }
    );
  }
}

// PUT - Update promotion
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { _id, title, subtitle, image, ctaText, ctaLink, isActive, order } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: 'Promotion ID is required' },
        { status: 400 }
      );
    }

    const updateData: {
      title?: string;
      subtitle?: string;
      image?: string;
      ctaText?: string;
      ctaLink?: string;
      isActive?: boolean;
      order?: number;
    } = {};
    if (title) updateData.title = title;
    if (subtitle) updateData.subtitle = subtitle;
    if (image) updateData.image = image;
    if (ctaText) updateData.ctaText = ctaText;
    if (ctaLink) updateData.ctaLink = ctaLink;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (order !== undefined) updateData.order = order;

    const updatedPromotion = await Promotion.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPromotion) {
      return NextResponse.json(
        { success: false, error: 'Promotion not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      promotion: updatedPromotion,
      message: 'Promotion updated successfully'
    });

  } catch (error) {
    console.error('Error updating promotion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update promotion' },
      { status: 500 }
    );
  }
}

// DELETE - Delete promotion
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const promotionId = searchParams.get('id');

    if (!promotionId) {
      return NextResponse.json(
        { success: false, error: 'Promotion ID is required' },
        { status: 400 }
      );
    }

    const deletedPromotion = await Promotion.findByIdAndDelete(promotionId);

    if (!deletedPromotion) {
      return NextResponse.json(
        { success: false, error: 'Promotion not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Promotion deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting promotion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete promotion' },
      { status: 500 }
    );
  }
}
