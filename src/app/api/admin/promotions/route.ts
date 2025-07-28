import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Promotion from '@/models/Promotion';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const authResult = await verifyAdminToken(request);
  if (authResult.error) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    await connectDB();
    const promotions = await Promotion.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      promotions
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch promotions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await verifyAdminToken(request);
  if (authResult.error) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status }
    );
  }
  try {
    await connectDB();
    
    const body = await request.json();
    const { title, image, ctaText, ctaLink, isActive = true } = body;

    if (!title || !ctaText || !ctaLink) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, ctaText, ctaLink' },
        { status: 400 }
      );
    }

    const promotion = new Promotion({
      title,
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
    return NextResponse.json(
      { success: false, error: 'Failed to create promotion' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const authResult = await verifyAdminToken(request);
  if (authResult.error) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    await connectDB();
    
    const body = await request.json();
    const { _id, title, image, ctaText, ctaLink, isActive, order } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: 'Promotion ID is required' },
        { status: 400 }
      );
    }

    const updateData: {
      title?: string;
      image?: string;
      ctaText?: string;
      ctaLink?: string;
      isActive?: boolean;
      order?: number;
    } = {};
    if (title) updateData.title = title;
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
    return NextResponse.json(
      { success: false, error: 'Failed to update promotion' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = await verifyAdminToken(request);
  if (authResult.error) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status }
    );
  }

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
    return NextResponse.json(
      { success: false, error: 'Failed to delete promotion' },
      { status: 500 }
    );
  }
}
