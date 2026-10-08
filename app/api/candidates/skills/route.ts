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
    const { skillName, yearsOfExperience } = body;

    if (!skillName) {
      return errorResponse('Skill name is required', 400);
    }

    // Upsert master Skill
    const trimmedSkill = skillName.trim();
    let skill = await prisma.skill.findFirst({
      where: { name: { equals: trimmedSkill, mode: 'insensitive' } },
    });

    if (!skill) {
      skill = await prisma.skill.create({
        data: { name: trimmedSkill },
      });
    }

    // Link skill to candidate profile
    const candidateSkill = await prisma.candidateSkill.upsert({
      where: {
        candidateProfileId_skillId: {
          candidateProfileId: session.candidateProfileId,
          skillId: skill.id,
        },
      },
      create: {
        candidateProfileId: session.candidateProfileId,
        skillId: skill.id,
        yearsOfExperience: yearsOfExperience ? parseFloat(yearsOfExperience) : null,
      },
      update: {
        yearsOfExperience: yearsOfExperience ? parseFloat(yearsOfExperience) : null,
      },
      include: {
        skill: true,
      },
    });

    return successResponse(candidateSkill, 'Skill added to profile', 201);
  } catch (error: any) {
    console.error('Add skill error:', error);
    return errorResponse('Failed to add skill', 500, error.message);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = getTokenFromRequest(req);
    if (!session || session.role !== 'CANDIDATE' || !session.candidateProfileId) {
      return unauthorizedResponse('Please sign in as a candidate');
    }

    const { searchParams } = req.nextUrl;
    const skillId = searchParams.get('skillId');

    if (!skillId) {
      return errorResponse('Skill ID is required', 400);
    }

    await prisma.candidateSkill.deleteMany({
      where: {
        candidateProfileId: session.candidateProfileId,
        skillId,
      },
    });

    return successResponse(null, 'Skill removed from profile');
  } catch (error: any) {
    return errorResponse('Failed to remove skill', 500);
  }
}
