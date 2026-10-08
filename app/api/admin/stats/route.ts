import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse, forbiddenResponse } from '@/lib/api-response';
import { Role, UserStatus, JobStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = getTokenFromRequest(req);
    if (!session) return unauthorizedResponse();
    if (session.role !== 'ADMIN') return forbiddenResponse('Admin access required');

    const [
      totalUsers,
      totalCandidates,
      totalRecruiters,
      totalJobs,
      activeJobs,
      totalApplications,
      totalCompanies,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: Role.CANDIDATE } }),
      prisma.user.count({ where: { role: Role.RECRUITER } }),
      prisma.job.count(),
      prisma.job.count({ where: { status: JobStatus.ACTIVE } }),
      prisma.application.count(),
      prisma.company.count(),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    const userDistribution = [
      { name: 'Candidates', value: totalCandidates, color: '#6366f1' },
      { name: 'Recruiters', value: totalRecruiters, color: '#06b6d4' },
      { name: 'Admins', value: totalUsers - (totalCandidates + totalRecruiters), color: '#8b5cf6' },
    ];

    return successResponse({
      stats: {
        totalUsers,
        totalCandidates,
        totalRecruiters,
        totalJobs,
        activeJobs,
        totalApplications,
        totalCompanies,
      },
      userDistribution,
      recentUsers,
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return errorResponse('Failed to fetch admin stats', 500, error.message);
  }
}
