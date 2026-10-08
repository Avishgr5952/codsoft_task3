import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse } from '@/lib/api-response';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: jobId } = params;
    const session = getTokenFromRequest(req);
    if (!session || session.role !== 'CANDIDATE') {
      return unauthorizedResponse('Please sign in as a candidate to save jobs');
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return notFoundResponse('Job not found');
    }

    const existing = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId: session.id,
          jobId,
        },
      },
    });

    if (existing) {
      // Toggle off / unsave
      await prisma.savedJob.delete({
        where: { id: existing.id },
      });
      return successResponse({ isSaved: false }, 'Job removed from saved jobs');
    }

    await prisma.savedJob.create({
      data: {
        userId: session.id,
        jobId,
      },
    });

    return successResponse({ isSaved: true }, 'Job saved successfully', 201);
  } catch (error: any) {
    console.error('Save job error:', error);
    return errorResponse('Failed to toggle saved job', 500, error.message);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: jobId } = params;
    const session = getTokenFromRequest(req);
    if (!session || session.role !== 'CANDIDATE') {
      return unauthorizedResponse('Please sign in as a candidate to manage saved jobs');
    }

    await prisma.savedJob.deleteMany({
      where: {
        userId: session.id,
        jobId,
      },
    });

    return successResponse({ isSaved: false }, 'Job removed from saved list');
  } catch (error: any) {
    console.error('Delete saved job error:', error);
    return errorResponse('Failed to remove saved job', 500, error.message);
  }
}
