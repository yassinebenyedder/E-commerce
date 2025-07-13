import { NextRequest, NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';

const utapi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    // Get form data
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Check file size (4MB limit to match UploadThing config)
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size too large. Maximum 4MB allowed.' },
        { status: 400 }
      );
    }

    // Upload to UploadThing
    const uploadResult = await utapi.uploadFiles(file);

    if (!uploadResult.data) {
      throw new Error('Upload failed');
    }

    const { url, key, name, size } = uploadResult.data;

    return NextResponse.json({
      success: true,
      imageUrl: url,
      key: key,
      filename: name,
      originalName: file.name,
      size: size,
    });

  } catch (error) {
    console.error('Error uploading product image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
