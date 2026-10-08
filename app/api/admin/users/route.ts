import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse, forbiddenResponse } from '@/lib/api-response';
import { Role, UserStatus, Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = getTokenFromRequest(req);
    if (!session || session.role !== 'ADMIN') {
      return forbiddenResponse('Admin access required');
    }

    const { searchParams } = req.nextUrl;
    const search = searchParams.get('search')?.trim();
    const role = searchParams.get('role')?.trim();
    const status = searchParams.get('status')?.trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get('limit') || '15', 10)));
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(role && Object.values(Role).includes(role as Role) && {
        role: role as Role,
      }),
      ...(status && Object.values(UserStatus).includes(status as UserStatus) && {
        status: status as UserStatus,
      }),
    };

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
          candidateProfile: {
            select: {
              id: true,
              headline: true,
              location: true,
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
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return successResponse({
      users,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error: any) {
    console.error('Admin users error:', error);
    return errorResponse('Failed to fetch users', 500, error.message);
  }
}
