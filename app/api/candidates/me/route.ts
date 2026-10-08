import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = getTokenFromRequest(req);
    if (!session || session.role !== 'CANDIDATE') {
      return unauthorizedResponse('Please sign in as a candidate');
    }

    const candidateProfile = await prisma.candidateProfile.findUnique({
      where: { userId: session.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            status: true,
          },
        },
        skills: {
          include: { skill: true },
        },
        educations: {
          orderBy: { startDate: 'desc' },
        },
        experiences: {
          orderBy: { startDate: 'desc' },
        },
        resumes: {
          orderBy: [{ isDefault: 'desc' }, { uploadedAt: 'desc' }],
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!candidateProfile) {
      return errorResponse('Candidate profile not found', 404);
    }

    // Calculate profile completion percentage
    let completedPoints = 0;
    const totalPoints = 7;
    if (candidateProfile.user.name) completedPoints++;
    if (candidateProfile.headline) completedPoints++;
    if (candidateProfile.bio) completedPoints++;
    if (candidateProfile.location) completedPoints++;
    if (candidateProfile.skills.length > 0) completedPoints++;
    if (candidateProfile.educations.length > 0 || candidateProfile.experiences.length > 0) completedPoints++;
    if (candidateProfile.resumes.length > 0) completedPoints++;

    const completionPercentage = Math.round((completedPoints / totalPoints) * 100);

    return successResponse({
      ...candidateProfile,
      completionPercentage,
    });
  } catch (error: any) {
    console.error('Get candidate profile error:', error);
    return errorResponse('Failed to retrieve candidate profile', 500, error.message);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = getTokenFromRequest(req);
    if (!session || session.role !== 'CANDIDATE') {
      return unauthorizedResponse('Please sign in as a candidate');
    }

    const body = await req.json();
    const {
      name,
      phone,
      headline,
      bio,
      location,
      photoUrl,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
    } = body;

    // Update User model fields if provided
    if (name || phone !== undefined) {
      await prisma.user.update({
        where: { id: session.id },
        data: {
          ...(name && { name: name.trim() }),
          ...(phone !== undefined && { phone: phone?.trim() || null }),
        },
      });
    }

    // Update CandidateProfile
    const updated = await prisma.candidateProfile.upsert({
      where: { userId: session.id },
      create: {
        userId: session.id,
        headline: headline?.trim() || null,
        bio: bio?.trim() || null,
        location: location?.trim() || null,
        photoUrl: photoUrl?.trim() || null,
        linkedinUrl: linkedinUrl?.trim() || null,
        githubUrl: githubUrl?.trim() || null,
        portfolioUrl: portfolioUrl?.trim() || null,
      },
      update: {
        ...(headline !== undefined && { headline: headline?.trim() || null }),
        ...(bio !== undefined && { bio: bio?.trim() || null }),
        ...(location !== undefined && { location: location?.trim() || null }),
        ...(photoUrl !== undefined && { photoUrl: photoUrl?.trim() || null }),
        ...(linkedinUrl !== undefined && { linkedinUrl: linkedinUrl?.trim() || null }),
        ...(githubUrl !== undefined && { githubUrl: githubUrl?.trim() || null }),
        ...(portfolioUrl !== undefined && { portfolioUrl: portfolioUrl?.trim() || null }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return successResponse(updated, 'Profile updated successfully');
  } catch (error: any) {
    console.error('Update candidate profile error:', error);
    return errorResponse('Failed to update candidate profile', 500, error.message);
  }
}
