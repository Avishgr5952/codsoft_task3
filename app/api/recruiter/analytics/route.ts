import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import { ApplicationStatus, JobStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = getTokenFromRequest(req);
    if (!session || (session.role !== 'RECRUITER' && session.role !== 'ADMIN')) {
      return unauthorizedResponse('Recruiter authorization required');
    }

    const companyId = session.companyId;
    if (!companyId && session.role !== 'ADMIN') {
      return errorResponse('Company profile required', 400);
    }

    const jobWhere = companyId ? { companyId } : {};
    const appWhere = companyId ? { job: { companyId } } : {};

    // 1. Summary stats
    const [
      totalJobs,
      activeJobs,
      totalApplications,
      shortlistedCount,
      interviewCount,
      selectedCount,
    ] = await Promise.all([
      prisma.job.count({ where: jobWhere }),
      prisma.job.count({ where: { ...jobWhere, status: JobStatus.ACTIVE } }),
      prisma.application.count({ where: appWhere }),
      prisma.application.count({ where: { ...appWhere, status: ApplicationStatus.SHORTLISTED } }),
      prisma.application.count({ where: { ...appWhere, status: ApplicationStatus.INTERVIEW } }),
      prisma.application.count({ where: { ...appWhere, status: ApplicationStatus.SELECTED } }),
    ]);

    // 2. Status distribution for chart
    const statusCounts = await prisma.application.groupBy({
      by: ['status'],
      where: appWhere,
      _count: { _all: true },
    });

    const statusMap: Record<string, number> = {
      APPLIED: 0,
      UNDER_REVIEW: 0,
      SHORTLISTED: 0,
      INTERVIEW: 0,
      SELECTED: 0,
      REJECTED: 0,
    };
    statusCounts.forEach((s) => {
      statusMap[s.status] = s._count._all;
    });

    const statusDistribution = [
      { name: 'Applied', value: statusMap.APPLIED, color: '#6366f1' },
      { name: 'Under Review', value: statusMap.UNDER_REVIEW, color: '#eab308' },
      { name: 'Shortlisted', value: statusMap.SHORTLISTED, color: '#06b6d4' },
      { name: 'Interview', value: statusMap.INTERVIEW, color: '#8b5cf6' },
      { name: 'Selected', value: statusMap.SELECTED, color: '#10b981' },
      { name: 'Rejected', value: statusMap.REJECTED, color: '#ef4444' },
    ];

    // 3. Applications per job
    const jobsWithAppCounts = await prisma.job.findMany({
      where: jobWhere,
      select: {
        id: true,
        title: true,
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { applications: { _count: 'desc' } },
      take: 6,
    });

    const applicationsPerJob = jobsWithAppCounts.map((j) => ({
      title: j.title.length > 22 ? j.title.substring(0, 22) + '...' : j.title,
      applications: j._count.applications,
    }));

    return successResponse({
      summary: {
        totalJobs,
        activeJobs,
        totalApplications,
        shortlistedCount,
        interviewCount,
        selectedCount,
      },
      statusDistribution,
      applicationsPerJob,
    });
  } catch (error: any) {
    console.error('Recruiter analytics error:', error);
    return errorResponse('Failed to retrieve analytics', 500, error.message);
  }
}
