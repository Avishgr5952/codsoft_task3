import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET() {
  try {
    const categories = await prisma.jobCategory.findMany({
      include: {
        _count: {
          select: { jobs: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return successResponse(categories);
  } catch (error: any) {
    console.error('Get categories error:', error);
    return errorResponse('Failed to fetch job categories', 500, error.message);
  }
}
