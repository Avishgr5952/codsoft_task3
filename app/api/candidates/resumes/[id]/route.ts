import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { getStorageProvider } from '@/lib/storage';
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse, forbiddenResponse } from '@/lib/api-response';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = getTokenFromRequest(req);
    if (!session || session.role !== 'CANDIDATE' || !session.candidateProfileId) {
      return unauthorizedResponse();
    }

    const resume = await prisma.resume.findUnique({ where: { id } });
    if (!resume) {
      return notFoundResponse('Resume not found');
    }

    if (resume.candidateProfileId !== session.candidateProfileId) {
      return forbiddenResponse();
    }

    // Delete file from storage
    if (resume.fileUrl) {
      const storage = getStorageProvider();
      await storage.deleteFile(resume.fileUrl).catch(() => {});
    }

    await prisma.resume.delete({ where: { id } });

    // If was default, set another one as default
    if (resume.isDefault) {
      const nextResume = await prisma.resume.findFirst({
        where: { candidateProfileId: session.candidateProfileId },
        orderBy: { uploadedAt: 'desc' },
      });
      if (nextResume) {
        await prisma.resume.update({
          where: { id: nextResume.id },
          data: { isDefault: true },
        });
      }
    }

    return successResponse(null, 'Resume deleted successfully');
  } catch (error: any) {
    console.error('Delete resume error:', error);
    return errorResponse('Failed to delete resume', 500, error.message);
  }
}
