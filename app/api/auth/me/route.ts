import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = getTokenFromRequest(req);
    if (!session) {
      return unauthorizedResponse();
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        candidateProfile: {
          select: {
            id: true,
            headline: true,
            location: true,
            photoUrl: true,
          },
        },
        recruiterProfile: {
          select: {
            id: true,
            designation: true,
            company: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            notifications: {
              where: { read: false },
            },
          },
        },
      },
    });

    if (!user) {
      return unauthorizedResponse('User no longer exists');
    }

    return successResponse({
      ...user,
      unreadNotificationsCount: user._count.notifications,
    });
  } catch (error: any) {
    console.error('Auth me error:', error);
    return errorResponse('Failed to retrieve user session', 500);
  }
}
