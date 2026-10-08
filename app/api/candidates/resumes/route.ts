import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = getTokenFromRequest(req);
    if (!session || session.role !== 'CANDIDATE' || !session.candidateProfileId) {
      return unauthorizedResponse('Please sign in as a candidate');
    }

    const resumes = await prisma.resume.findMany({
      where: { candidateProfileId: session.candidateProfileId },
      orderBy: [{ isDefault: 'desc' }, { uploadedAt: 'desc' }],
    });

    return successResponse(resumes);
  } catch (error: any) {
    console.error('Get resumes error:', error);
    return errorResponse('Failed to retrieve resumes', 500, error.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getTokenFromRequest(req);
    if (!session || session.role !== 'CANDIDATE' || !session.candidateProfileId) {
      return unauthorizedResponse('Please sign in as a candidate');
    }

    const body = await req.json();
    const { fileName, fileUrl, fileSize, fileType, isDefault } = body;

    if (!fileName || !fileUrl) {
      return errorResponse('File name and file URL are required', 400);
    }

    // If setting as default, unmark others
    if (isDefault) {
      await prisma.resume.updateMany({
        where: { candidateProfileId: session.candidateProfileId },
        data: { isDefault: false },
      });
    }

    // Check if this is their first resume, if so make it default
    const count = await prisma.resume.count({
      where: { candidateProfileId: session.candidateProfileId },
    });

    const resume = await prisma.resume.create({
      data: {
        candidateProfileId: session.candidateProfileId,
        fileName,
        fileUrl,
        fileSize: fileSize || 0,
        fileType: fileType || 'application/pdf',
        isDefault: isDefault ?? count === 0,
      },
    });

    return successResponse(resume, 'Resume added successfully', 201);
  } catch (error: any) {
    console.error('Save resume error:', error);
    return errorResponse('Failed to save resume record', 500, error.message);
  }
}
