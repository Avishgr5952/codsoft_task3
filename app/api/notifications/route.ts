import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = getTokenFromRequest(req);
    if (!session) {
      return unauthorizedResponse();
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.id,
        read: false,
      },
    });

    return successResponse({
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    console.error('Get notifications error:', error);
    return errorResponse('Failed to retrieve notifications', 500, error.message);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = getTokenFromRequest(req);
    if (!session) {
      return unauthorizedResponse();
    }

    // Mark all as read
    await prisma.notification.updateMany({
      where: {
        userId: session.id,
        read: false,
      },
      data: { read: true },
    });

    return successResponse(null, 'All notifications marked as read');
  } catch (error: any) {
    console.error('Mark all read error:', error);
    return errorResponse('Failed to update notifications', 500, error.message);
  }
}
