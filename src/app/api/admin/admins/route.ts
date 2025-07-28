import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Admin from '@/models/Admin';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value;
  
  if (!token) {
    throw new Error('No token provided');
  }

  const decoded = jwt.verify(token, JWT_SECRET) as { adminId: string };
  
  await connectDB();
  const admin = await Admin.findById(decoded.adminId);
  
  if (!admin || !admin.isActive) {
    throw new Error('Admin not found or inactive');
  }

  return admin;
}

export async function GET(request: NextRequest) {
  try {
    await verifyAdmin(request);
    await connectDB();

    const admins = await Admin.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      admins
    });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch admins' },
      { status: error instanceof Error && error.message.includes('token') ? 401 : 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin(request);
    await connectDB();

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin with this email already exists' },
        { status: 400 }
      );
    }

    const admin = new Admin({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      isActive: true
    });

    await admin.save();

    return NextResponse.json({
      success: true,
      message: 'Admin created successfully',
      admin
    });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create admin' },
      { status: error instanceof Error && error.message.includes('token') ? 401 : 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await verifyAdmin(request);
    await connectDB();

    const body = await request.json();
    const { id, name, email, password, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Admin ID is required' },
        { status: 400 }
      );
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    if (name) admin.name = name.trim();
    if (email) {
      const existingAdmin = await Admin.findOne({ email, _id: { $ne: id } });
      if (existingAdmin) {
        return NextResponse.json(
          { error: 'Email is already taken by another admin' },
          { status: 400 }
        );
      }
      admin.email = email.toLowerCase().trim();
    }
    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters long' },
          { status: 400 }
        );
      }
      admin.password = password;
    }
    if (typeof isActive === 'boolean') admin.isActive = isActive;

    await admin.save();

    return NextResponse.json({
      success: true,
      message: 'Admin updated successfully',
      admin
    });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update admin' },
      { status: error instanceof Error && error.message.includes('token') ? 401 : 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const currentAdmin = await verifyAdmin(request);
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Admin ID is required' },
        { status: 400 }
      );
    }

    if (currentAdmin._id.toString() === id) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      );
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    await Admin.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Admin deleted successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete admin' },
      { status: error instanceof Error && error.message.includes('token') ? 401 : 500 }
    );
  }
}
