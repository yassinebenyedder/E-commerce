import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Product from '@/models/Product';
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
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      products
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
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
    const { name, description, category, image, images, variants, baseSku } = body;

    if (!name || !description || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, description, category' },
        { status: 400 }
      );
    }

    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product must have at least one variant' },
        { status: 400 }
      );
    }

    for (const variant of variants) {
      if (!variant.name || variant.price === undefined || variant.price < 0) {
        return NextResponse.json(
          { success: false, error: 'Each variant must have a name and valid price' },
          { status: 400 }
        );
      }
    }

    const hasDefault = variants.some(variant => variant.isDefault);
    if (!hasDefault && variants.length > 0) {
      variants[0].isDefault = true;
    }

    const product = new Product({
      name,
      description,
      category,
      image: image || '/products/placeholder.svg',
      images: images || [],
      variants,
      baseSku
    });

    const savedProduct = await product.save();

    return NextResponse.json({
      success: true,
      product: savedProduct,
      message: 'Product created successfully'
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
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
    const { _id, name, description, category, image, images, variants, baseSku } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const updateData: {
      name?: string;
      description?: string;
      category?: string;
      image?: string;
      images?: string[];
      baseSku?: string;
      variants?: Array<{
        name: string;
        sku: string;
        price: number;
        originalPrice?: number;
        stock: number;
        isDefault?: boolean;
        inStock?: boolean;
      }>;
      inStock?: boolean;
    } = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (image) updateData.image = image;
    if (images) updateData.images = images;
    if (baseSku) updateData.baseSku = baseSku;
    
    if (variants && Array.isArray(variants) && variants.length > 0) {
      for (const variant of variants) {
        if (!variant.name || variant.price === undefined || variant.price < 0) {
          return NextResponse.json(
            { success: false, error: 'Each variant must have a name and valid price' },
            { status: 400 }
          );
        }
      }
      
      const hasDefault = variants.some(variant => variant.isDefault);
      if (!hasDefault && variants.length > 0) {
        variants[0].isDefault = true;
      }
      
      updateData.variants = variants;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
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
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
