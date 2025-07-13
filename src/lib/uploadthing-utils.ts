import { UTApi } from 'uploadthing/server';

const utapi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN,
});

/**
 * Delete a file from UploadThing by its key
 * @param fileKey - The key of the file to delete (returned from upload)
 * @returns Promise<boolean> - Success status
 */
export async function deleteUploadThingFile(fileKey: string): Promise<boolean> {
  try {
    await utapi.deleteFiles(fileKey);
    return true;
  } catch (error) {
    console.error('Error deleting file from UploadThing:', error);
    return false;
  }
}

/**
 * Delete multiple files from UploadThing
 * @param fileKeys - Array of file keys to delete
 * @returns Promise<boolean> - Success status
 */
export async function deleteUploadThingFiles(fileKeys: string[]): Promise<boolean> {
  try {
    await utapi.deleteFiles(fileKeys);
    return true;
  } catch (error) {
    console.error('Error deleting files from UploadThing:', error);
    return false;
  }
}

/**
 * Extract the file key from an UploadThing URL
 * @param url - The full UploadThing URL
 * @returns string - The file key
 */
export function extractFileKeyFromUrl(url: string): string {
  // UploadThing URLs typically look like:
  // https://uploadthing-prod.s3.us-west-2.amazonaws.com/abc123def.jpg
  const parts = url.split('/');
  return parts[parts.length - 1];
}
