import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
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

    const item = await prisma.experience.findUnique({ where: { id } });
    if (!item) return notFoundResponse('Experience record not found');
    if (item.candidateProfileId !== session.candidateProfileId) {
      return forbiddenResponse();
    }

    await prisma.experience.delete({ where: { id } });
    return successResponse(null, 'Experience record removed');
  } catch (error: any) {
    return errorResponse('Failed to remove experience record', 500);
  }
}
