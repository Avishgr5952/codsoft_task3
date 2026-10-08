import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import { JobStatus, JobType, WorkMode, ExperienceLevel, Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const session = getTokenFromRequest(req);

    const keyword = searchParams.get('keyword')?.trim();
    const location = searchParams.get('location')?.trim();
    const category = searchParams.get('category')?.trim();
    const jobType = searchParams.get('jobType')?.trim();
    const workMode = searchParams.get('workMode')?.trim();
    const experienceLevel = searchParams.get('experienceLevel')?.trim();
    const salaryMin = searchParams.get('salaryMin');
    const salaryMax = searchParams.get('salaryMax');
    const companyId = searchParams.get('companyId')?.trim();
    const recruiterOnly = searchParams.get('recruiterOnly') === 'true';
    const featured = searchParams.get('featured') === 'true';
    const statusParam = searchParams.get('status')?.trim();
    const sort = searchParams.get('sort')?.trim() || 'newest';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get('limit') || '10', 10)));
    const skip = (page - 1) * limit;

    const where: Prisma.JobWhereInput = {};

    // Recruiter filter
    if (recruiterOnly && session?.recruiterProfileId) {
      where.recruiterId = session.recruiterProfileId;
      if (statusParam && Object.values(JobStatus).includes(statusParam as JobStatus)) {
        where.status = statusParam as JobStatus;
      }
    } else {
      // Public / Candidate view defaults to ACTIVE jobs
      if (statusParam && session?.role === 'ADMIN') {
        where.status = statusParam as JobStatus;
      } else {
        where.status = JobStatus.ACTIVE;
      }
    }

    if (featured) {
      where.featured = true;
    }

    if (companyId) {
      where.companyId = companyId;
    }

    if (jobType && Object.values(JobType).includes(jobType as JobType)) {
      where.jobType = jobType as JobType;
    }

    if (workMode && Object.values(WorkMode).includes(workMode as WorkMode)) {
      where.workMode = workMode as WorkMode;
    }

    if (experienceLevel && Object.values(ExperienceLevel).includes(experienceLevel as ExperienceLevel)) {
      where.experienceLevel = experienceLevel as ExperienceLevel;
    }

    if (category) {
      where.OR = [
        { categoryId: category },
        { category: { slug: category } },
        { category: { name: { contains: category, mode: 'insensitive' } } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (salaryMin) {
      where.salaryMax = { gte: parseFloat(salaryMin) };
    }

    if (salaryMax) {
      where.salaryMin = { lte: parseFloat(salaryMax) };
    }

    if (keyword) {
      where.AND = [
        {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
            { company: { name: { contains: keyword, mode: 'insensitive' } } },
            { skills: { hasSome: [keyword] } },
          ],
        },
      ];
    }

    let orderBy: Prisma.JobOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'salary_desc') {
      orderBy = { salaryMax: 'desc' };
    } else if (sort === 'salary_asc') {
      orderBy = { salaryMin: 'asc' };
    }

    const [jobs, totalCount] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
              industry: true,
              location: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
            },
          },
          _count: {
            select: {
              applications: true,
              savedBy: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.job.count({ where }),
    ]);

    // Check saved & applied status if candidate session
    let savedJobIds = new Set<string>();
    let appliedJobIds = new Set<string>();

    if (session?.candidateProfileId) {
      const [saved, applied] = await Promise.all([
        prisma.savedJob.findMany({
          where: { userId: session.id },
          select: { jobId: true },
        }),
        prisma.application.findMany({
          where: { candidateProfileId: session.candidateProfileId },
          select: { jobId: true },
        }),
      ]);
      saved.forEach((s) => savedJobIds.add(s.jobId));
      applied.forEach((a) => appliedJobIds.add(a.jobId));
    }

    const transformedJobs = jobs.map((job) => ({
      ...job,
      isSaved: savedJobIds.has(job.id),
      hasApplied: appliedJobIds.has(job.id),
    }));

    return successResponse({
      jobs: transformedJobs,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error: any) {
    console.error('Get jobs error:', error);
    return errorResponse('Failed to fetch jobs', 500, error.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getTokenFromRequest(req);
    if (!session || (session.role !== 'RECRUITER' && session.role !== 'ADMIN')) {
      return unauthorizedResponse('Only recruiters and administrators can post jobs');
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
      salaryCurrency = 'USD',
      deadline,
      status = 'ACTIVE',
      companyId: explicitCompanyId,
    } = body;

    if (!title || !description || !location || !categoryId) {
      return errorResponse('Title, description, location, and category are required', 400);
    }

    const effectiveCompanyId = explicitCompanyId || session.companyId;
    if (!effectiveCompanyId) {
      return errorResponse('Recruiter company profile is required to post jobs', 400);
    }

    const skillsArray = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

    const newJob = await prisma.job.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        responsibilities: responsibilities?.trim() || null,
        requirements: requirements?.trim() || null,
        benefits: benefits?.trim() || null,
        skills: skillsArray,
        categoryId,
        companyId: effectiveCompanyId,
        recruiterId: session.recruiterProfileId || null,
        jobType: jobType || JobType.FULL_TIME,
        workMode: workMode || WorkMode.HYBRID,
        experienceLevel: experienceLevel || ExperienceLevel.MID_LEVEL,
        location: location.trim(),
        salaryMin: salaryMin ? parseFloat(salaryMin) : null,
        salaryMax: salaryMax ? parseFloat(salaryMax) : null,
        salaryCurrency,
        deadline: deadline ? new Date(deadline) : null,
        status: status === 'DRAFT' ? JobStatus.DRAFT : JobStatus.ACTIVE,
      },
      include: {
        company: true,
        category: true,
      },
    });

    return successResponse(newJob, 'Job published successfully', 201);
  } catch (error: any) {
    console.error('Create job error:', error);
    return errorResponse('Failed to create job posting', 500, error.message);
  }
}
