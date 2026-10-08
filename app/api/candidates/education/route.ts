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
    const { institution, degree, fieldOfStudy, startDate, endDate, grade } = body;

    if (!institution || !degree || !startDate) {
      return errorResponse('Institution, degree, and start date are required', 400);
    }

    const education = await prisma.education.create({
      data: {
        candidateProfileId: session.candidateProfileId,
        institution: institution.trim(),
        degree: degree.trim(),
        fieldOfStudy: fieldOfStudy?.trim() || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        grade: grade?.trim() || null,
      },
    });

    return successResponse(education, 'Education record added', 201);
  } catch (error: any) {
    console.error('Add education error:', error);
    return errorResponse('Failed to add education', 500, error.message);
  }
}
