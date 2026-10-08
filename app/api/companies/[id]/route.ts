import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { successResponse, errorResponse, notFoundResponse, unauthorizedResponse, forbiddenResponse } from '@/lib/api-response';
import { JobStatus } from '@prisma/client';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        jobs: {
          where: { status: JobStatus.ACTIVE },
          include: {
            category: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            jobs: { where: { status: JobStatus.ACTIVE } },
            recruiters: true,
          },
        },
      },
    });

    if (!company) {
      return notFoundResponse('Company not found');
    }

    return successResponse(company);
  } catch (error: any) {
    console.error('Get company detail error:', error);
    return errorResponse('Failed to fetch company details', 500, error.message);
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
      return unauthorizedResponse('Only authorized recruiters can update company profile');
    }

    if (session.role === 'RECRUITER' && session.companyId !== id) {
      return forbiddenResponse('You can only update your own company');
    }

    const body = await req.json();
    const {
      name,
      logoUrl,
      website,
      industry,
      location,
      companySize,
      description,
      foundedYear,
      linkedinUrl,
      twitterUrl,
    } = body;

    const updated = await prisma.company.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(logoUrl !== undefined && { logoUrl: logoUrl?.trim() || null }),
        ...(website !== undefined && { website: website?.trim() || null }),
        ...(industry !== undefined && { industry: industry?.trim() || null }),
        ...(location !== undefined && { location: location?.trim() || null }),
        ...(companySize !== undefined && { companySize: companySize?.trim() || null }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(foundedYear !== undefined && { foundedYear: foundedYear ? parseInt(foundedYear, 10) : null }),
        ...(linkedinUrl !== undefined && { linkedinUrl: linkedinUrl?.trim() || null }),
        ...(twitterUrl !== undefined && { twitterUrl: twitterUrl?.trim() || null }),
      },
    });

    return successResponse(updated, 'Company profile updated successfully');
  } catch (error: any) {
    console.error('Update company error:', error);
    return errorResponse('Failed to update company profile', 500, error.message);
  }
}
