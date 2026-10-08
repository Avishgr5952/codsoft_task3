import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const session = getTokenFromRequest(req);
    if (!session || session.role !== 'CANDIDATE' || !session.candidateProfileId) {
      return unauthorizedResponse('Please sign in as a candidate');
    }

    const body = await req.json();
    const { company, title, location, startDate, endDate, current, description } = body;

    if (!company || !title || !startDate) {
      return errorResponse('Company, job title, and start date are required', 400);
    }

    const experience = await prisma.experience.create({
      data: {
        candidateProfileId: session.candidateProfileId,
        company: company.trim(),
        title: title.trim(),
        location: location?.trim() || null,
        startDate: new Date(startDate),
        endDate: current ? null : endDate ? new Date(endDate) : null,
        current: Boolean(current),
        description: description?.trim() || null,
      },
    });

    return successResponse(experience, 'Experience record added', 201);
  } catch (error: any) {
    console.error('Add experience error:', error);
    return errorResponse('Failed to add experience', 500, error.message);
  }
}
