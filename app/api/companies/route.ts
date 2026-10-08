import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { JobStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const search = searchParams.get('search')?.trim();
    const industry = searchParams.get('industry')?.trim();

    const companies = await prisma.company.findMany({
      where: {
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { location: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }),
        ...(industry && {
          industry: { contains: industry, mode: 'insensitive' },
        }),
      },
      include: {
        _count: {
          select: {
            jobs: {
              where: { status: JobStatus.ACTIVE },
            },
            recruiters: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return successResponse(companies);
  } catch (error: any) {
    console.error('Get companies error:', error);
    return errorResponse('Failed to fetch companies', 500, error.message);
  }
}
