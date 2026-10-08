import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = getTokenFromRequest(req);
    if (!session || session.role !== 'CANDIDATE') {
      return unauthorizedResponse('Please sign in as a candidate to view saved jobs');
    }

    const savedJobs = await prisma.savedJob.findMany({
      where: { userId: session.id },
      include: {
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
                location: true,
              },
            },
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(
      savedJobs.map((item) => ({
        id: item.id,
        savedAt: item.createdAt,
        job: item.job,
      }))
    );
  } catch (error: any) {
    console.error('Get saved jobs error:', error);
    return errorResponse('Failed to retrieve saved jobs', 500, error.message);
  }
}
