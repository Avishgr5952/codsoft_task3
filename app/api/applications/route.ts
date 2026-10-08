import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse, forbiddenResponse } from '@/lib/api-response';
import { ApplicationStatus, JobStatus, Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = getTokenFromRequest(req);
    if (!session) {
      return unauthorizedResponse();
    }

    const { searchParams } = req.nextUrl;
    const status = searchParams.get('status')?.trim();
    const jobId = searchParams.get('jobId')?.trim();

    if (session.role === 'CANDIDATE') {
      if (!session.candidateProfileId) {
        return errorResponse('Candidate profile not found', 404);
      }

      const applications = await prisma.application.findMany({
        where: {
          candidateProfileId: session.candidateProfileId,
          ...(status && Object.values(ApplicationStatus).includes(status as ApplicationStatus) && {
            status: status as ApplicationStatus,
          }),
        },
        include: {
          job: {
            include: {
              company: true,
              category: true,
            },
          },
          resume: true,
          interviews: {
            orderBy: { scheduledAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return successResponse(applications);
    }

    if (session.role === 'RECRUITER') {
      if (!session.companyId) {
        return errorResponse('Recruiter company not found', 404);
      }

      const where: Prisma.ApplicationWhereInput = {
        job: {
          companyId: session.companyId,
          ...(jobId && { id: jobId }),
        },
        ...(status && Object.values(ApplicationStatus).includes(status as ApplicationStatus) && {
          status: status as ApplicationStatus,
        }),
      };

      const applications = await prisma.application.findMany({
        where,
        include: {
          job: {
            select: {
              id: true,
              title: true,
              jobType: true,
              location: true,
              companyId: true,
            },
          },
          resume: true,
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
                take: 2,
                orderBy: { startDate: 'desc' },
              },
              educations: {
                take: 1,
                orderBy: { startDate: 'desc' },
              },
            },
          },
          interviews: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return successResponse(applications);
    }

    if (session.role === 'ADMIN') {
      const applications = await prisma.application.findMany({
        include: {
          job: {
            include: {
              company: true,
            },
          },
          candidateProfile: {
            include: {
              user: true,
            },
          },
          resume: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      });

      return successResponse(applications);
    }

    return forbiddenResponse();
  } catch (error: any) {
    console.error('Get applications error:', error);
    return errorResponse('Failed to fetch applications', 500, error.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getTokenFromRequest(req);
    if (!session || session.role !== 'CANDIDATE') {
      return unauthorizedResponse('Please sign in as a candidate to apply for jobs');
    }

    if (!session.candidateProfileId) {
      return errorResponse('Candidate profile record is required', 400);
    }

    const body = await req.json();
    const { jobId, resumeId: providedResumeId, coverLetter, additionalInfo } = body;

    if (!jobId) {
      return errorResponse('Job ID is required', 400);
    }

    // Verify job
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        company: true,
        recruiter: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!job || job.status !== JobStatus.ACTIVE) {
      return errorResponse('This job is no longer accepting applications', 400);
    }

    // Prevent duplicate application
    const existing = await prisma.application.findUnique({
      where: {
        jobId_candidateProfileId: {
          jobId,
          candidateProfileId: session.candidateProfileId,
        },
      },
    });

    if (existing) {
      return errorResponse('You have already submitted an application for this position', 409);
    }

    // Resolve resume
    let resumeId = providedResumeId;
    if (!resumeId) {
      const defaultResume = await prisma.resume.findFirst({
        where: {
          candidateProfileId: session.candidateProfileId,
        },
        orderBy: [{ isDefault: 'desc' }, { uploadedAt: 'desc' }],
      });
      resumeId = defaultResume?.id;
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        jobId,
        candidateProfileId: session.candidateProfileId,
        resumeId,
        coverLetter: coverLetter?.trim() || null,
        additionalInfo: additionalInfo?.trim() || null,
        status: ApplicationStatus.APPLIED,
      },
      include: {
        job: true,
        resume: true,
      },
    });

    // Notify candidate
    await prisma.notification.create({
      data: {
        userId: session.id,
        title: 'Application Submitted',
        message: `Your application for "${job.title}" at ${job.company.name} has been submitted successfully.`,
        type: 'APPLICATION',
        link: '/candidate/applications',
      },
    });

    // Notify recruiter (if recruiter is associated with the job or company)
    if (job.recruiter?.user?.id) {
      await prisma.notification.create({
        data: {
          userId: job.recruiter.user.id,
          title: 'New Candidate Applied',
          message: `${session.name} just applied for "${job.title}".`,
          type: 'APPLICATION',
          link: '/recruiter/applications',
        },
      });
    }

    return successResponse(application, 'Application submitted successfully', 201);
  } catch (error: any) {
    console.error('Submit application error:', error);
    return errorResponse('Failed to submit application', 500, error.message);
  }
}
