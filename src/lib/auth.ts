import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/connectDB';
import Admin from '@/models/Admin';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function verifyAdminToken(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      return { error: 'No token provided', status: 401 };
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { adminId: string };
    
    await connectDB();
    const admin = await Admin.findById(decoded.adminId);
    
    if (!admin || !admin.isActive) {
      return { error: 'Admin not found or inactive', status: 401 };
    }

    return { admin, status: 200 };

  } catch {
    return { error: 'Invalid token', status: 401 };
  }
}
