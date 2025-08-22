import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Promotion from '@/models/Promotion';

// GET active promotions for hero section
export async function GET() {
  try {
    await connectDB();
    // Limit to 5 latest active promotions
    const promotions = await Promotion.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5); 

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
