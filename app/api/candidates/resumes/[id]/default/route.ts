import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse, forbiddenResponse } from '@/lib/api-response';

export async function PUT(
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
    if (!resume) return notFoundResponse('Resume not found');
    if (resume.candidateProfileId !== session.candidateProfileId) return forbiddenResponse();

    await prisma.resume.updateMany({
      where: { candidateProfileId: session.candidateProfileId },
      data: { isDefault: false },
    });

    const updated = await prisma.resume.update({
      where: { id },
      data: { isDefault: true },
    });

    return successResponse(updated, 'Default resume updated');
  } catch (error: any) {
    return errorResponse('Failed to set default resume', 500);
  }
}
