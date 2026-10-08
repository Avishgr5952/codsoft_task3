import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse, forbiddenResponse } from '@/lib/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = getTokenFromRequest(req);
    if (!session) {
      return unauthorizedResponse();
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          include: {
            company: true,
            category: true,
          },
        },
        candidateProfile: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
            skills: {
              include: { skill: true },
            },
            experiences: {
              orderBy: { startDate: 'desc' },
            },
            educations: {
              orderBy: { startDate: 'desc' },
            },
          },
        },
        resume: true,
        interviews: {
          orderBy: { scheduledAt: 'desc' },
        },
      },
    });

    if (!application) {
      return notFoundResponse('Application not found');
    }

    // Authorization checks
    if (session.role === 'CANDIDATE' && application.candidateProfileId !== session.candidateProfileId) {
      return forbiddenResponse('You cannot view another candidate’s application');
    }

    if (session.role === 'RECRUITER' && application.job.companyId !== session.companyId) {
      return forbiddenResponse('You cannot view applications outside of your company');
    }

    return successResponse(application);
  } catch (error: any) {
    console.error('Get application detail error:', error);
    return errorResponse('Failed to retrieve application details', 500, error.message);
  }
}
