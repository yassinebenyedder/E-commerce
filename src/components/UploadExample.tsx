/**
 * Example of how to use UploadThing in your React components
 * 
 * Method 1: Using UploadButton/UploadDropzone components
 * Method 2: Using the custom upload routes we created
 */

import { UploadButton, UploadDropzone } from "@/lib/uploadthing-client";

// Method 1: Using UploadThing React components
export function ProductImageUpload() {
  return (
    <div className="space-y-4">
      <h3>Upload Product Images</h3>
      
      {/* Upload Button */}
      <UploadButton
        endpoint="productImageUploader"
        onClientUploadComplete={(res) => {
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
      
      {/* Upload Dropzone */}
      <UploadDropzone
        endpoint="productImageUploader"
        onClientUploadComplete={(res) => {
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
    </div>
  );
}

// Method 2: Using custom upload with form
export function CustomProductImageUpload() {
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload/products', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Upload successful:', result);
        // Handle success - update your product with result.imageUrl
      } else {
        console.error('Upload failed:', result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileUpload(file);
          }
        }}
      />
    </div>
  );
}
