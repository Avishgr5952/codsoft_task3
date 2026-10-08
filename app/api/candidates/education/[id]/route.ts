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

    const item = await prisma.education.findUnique({ where: { id } });
    if (!item) return notFoundResponse('Education record not found');
    if (item.candidateProfileId !== session.candidateProfileId) {
      return forbiddenResponse();
    }

    await prisma.education.delete({ where: { id } });
    return successResponse(null, 'Education record removed');
  } catch (error: any) {
    return errorResponse('Failed to remove education record', 500);
  }
}
