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
    if (!session) {
      return unauthorizedResponse();
    }

    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification) {
      return notFoundResponse('Notification not found');
    }

    if (notification.userId !== session.id) {
      return forbiddenResponse();
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    return successResponse(updated, 'Notification marked as read');
  } catch (error: any) {
    return errorResponse('Failed to update notification', 500);
  }
}
