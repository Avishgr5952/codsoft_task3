import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { successResponse, errorResponse, notFoundResponse, unauthorizedResponse, forbiddenResponse } from '@/lib/api-response';
import { JobStatus, JobType, WorkMode, ExperienceLevel } from '@prisma/client';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = getTokenFromRequest(req);

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        category: true,
        recruiter: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            applications: true,
            savedBy: true,
          },
        },
      },
    });

    if (!job) {
      return notFoundResponse('Job listing not found');
    }

    // Increment view count asynchronously
    await prisma.job.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    }).catch(() => {});

    // Check if user has saved or applied
    let isSaved = false;
    let hasApplied = false;
    let existingApplication = null;

    if (session?.candidateProfileId) {
      const [saved, application] = await Promise.all([
        prisma.savedJob.findUnique({
          where: {
            userId_jobId: {
              userId: session.id,
              jobId: id,
            },
          },
        }),
        prisma.application.findUnique({
          where: {
            jobId_candidateProfileId: {
              jobId: id,
              candidateProfileId: session.candidateProfileId,
            },
          },
          include: {
            resume: true,
          },
        }),
      ]);
      isSaved = !!saved;
      hasApplied = !!application;
      existingApplication = application;
    }

    // Fetch 3 similar jobs
    const similarJobs = await prisma.job.findMany({
      where: {
        id: { not: id },
        status: JobStatus.ACTIVE,
        OR: [
          { categoryId: job.categoryId },
          { jobType: job.jobType },
        ],
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
          },
        },
        category: true,
      },
      take: 3,
    });

    return successResponse({
      job: {
        ...job,
        isSaved,
        hasApplied,
        existingApplication,
      },
      similarJobs,
    });
  } catch (error: any) {
    console.error('Get single job error:', error);
    return errorResponse('Failed to retrieve job details', 500, error.message);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = getTokenFromRequest(req);
    if (!session || (session.role !== 'RECRUITER' && session.role !== 'ADMIN')) {
      return unauthorizedResponse('You must be a recruiter or admin to update job postings');
    }

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      return notFoundResponse('Job not found');
    }

    if (session.role === 'RECRUITER' && job.recruiterId !== session.recruiterProfileId) {
      return forbiddenResponse('You can only edit jobs posted by your organization');
    }

    const body = await req.json();
    const {
      title,
      description,
      responsibilities,
      requirements,
      benefits,
      skills,
      categoryId,
      jobType,
      workMode,
      experienceLevel,
      location,
      salaryMin,
      salaryMax,
      deadline,
      status,
      featured,
    } = body;

    const skillsArray = skills
      ? Array.isArray(skills)
        ? skills
        : typeof skills === 'string'
        ? skills.split(',').map((s: string) => s.trim()).filter(Boolean)
        : undefined
      : undefined;

    const updated = await prisma.job.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(description && { description: description.trim() }),
        ...(responsibilities !== undefined && { responsibilities }),
        ...(requirements !== undefined && { requirements }),
        ...(benefits !== undefined && { benefits }),
        ...(skillsArray && { skills: skillsArray }),
        ...(categoryId && { categoryId }),
        ...(jobType && { jobType: jobType as JobType }),
        ...(workMode && { workMode: workMode as WorkMode }),
        ...(experienceLevel && { experienceLevel: experienceLevel as ExperienceLevel }),
        ...(location && { location: location.trim() }),
        ...(salaryMin !== undefined && { salaryMin: salaryMin ? parseFloat(salaryMin) : null }),
        ...(salaryMax !== undefined && { salaryMax: salaryMax ? parseFloat(salaryMax) : null }),
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
        ...(status && { status: status as JobStatus }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
      },
      include: {
        company: true,
        category: true,
      },
    });

    return successResponse(updated, 'Job updated successfully');
  } catch (error: any) {
    console.error('Update job error:', error);
    return errorResponse('Failed to update job posting', 500, error.message);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = getTokenFromRequest(req);
    if (!session || (session.role !== 'RECRUITER' && session.role !== 'ADMIN')) {
      return unauthorizedResponse('You must be a recruiter or admin to delete job postings');
    }

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      return notFoundResponse('Job not found');
    }

    if (session.role === 'RECRUITER' && job.recruiterId !== session.recruiterProfileId) {
      return forbiddenResponse('You can only delete jobs posted by your organization');
    }

    await prisma.job.delete({ where: { id } });

    return successResponse(null, 'Job deleted successfully');
  } catch (error: any) {
    console.error('Delete job error:', error);
    return errorResponse('Failed to delete job posting', 500, error.message);
  }
}
