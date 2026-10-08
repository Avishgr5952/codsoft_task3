import { NextRequest } from 'next/server';
import { getStorageProvider } from '@/lib/storage';
import { getTokenFromRequest } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = getTokenFromRequest(req);
    if (!session) {
      return unauthorizedResponse();
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'resumes';

    if (!file) {
      return errorResponse('No file uploaded', 400);
    }

    const allowedFolders = ['resumes', 'avatars', 'logos'];
    if (!allowedFolders.includes(folder)) {
      return errorResponse('Invalid folder specified', 400);
    }

    const fileName = file.name;
    const mimeType = file.type;
    const extension = fileName.split('.').pop()?.toLowerCase();

    // Validation
    if (folder === 'resumes') {
      const allowedExts = ['pdf', 'doc', 'docx'];
      if (!extension || !allowedExts.includes(extension)) {
        return errorResponse('Invalid resume format. Only PDF, DOC, and DOCX files are allowed', 400);
      }
      if (file.size > 10 * 1024 * 1024) {
        return errorResponse('Resume file size cannot exceed 10MB', 400);
      }
    } else {
      // avatars / logos
      const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'svg'];
      if (!extension || !allowedExts.includes(extension)) {
        return errorResponse('Only JPG, PNG, WEBP, and SVG images are allowed', 400);
      }
      if (file.size > 5 * 1024 * 1024) {
        return errorResponse('Image file size cannot exceed 5MB', 400);
      }
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const storage = getStorageProvider();
    const result = await storage.uploadFile(
      buffer,
      fileName,
      mimeType,
      folder as 'resumes' | 'avatars' | 'logos'
    );

    return successResponse(
      {
        url: result.url,
        fileName,
        fileSize: result.size,
        fileType: mimeType || `application/${extension}`,
      },
      'File uploaded successfully',
      201
    );
  } catch (error: any) {
    console.error('File upload error:', error);
    return errorResponse('Failed to upload file', 500, error.message);
  }
}
