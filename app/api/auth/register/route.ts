import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signJwtToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-response';
import { AUTH_COOKIE_NAME } from '@/lib/auth';
import { Role, UserStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      confirmPassword,
      phone,
      role,
      companyName,
      companyWebsite,
      companyDescription,
    } = body;

    // Validation
    if (!name || !email || !password) {
      return errorResponse('Full name, email, and password are required', 400);
    }

    if (password !== confirmPassword) {
      return errorResponse('Passwords do not match', 400);
    }

    if (password.length < 6) {
      return errorResponse('Password must be at least 6 characters long', 400);
    }

    const selectedRole = role === 'RECRUITER' ? Role.RECRUITER : Role.CANDIDATE;

    if (selectedRole === Role.RECRUITER && !companyName) {
      return errorResponse('Company name is required for recruiter registration', 400);
    }

    // Check duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return errorResponse('An account with this email address already exists', 409);
    }

    const hashedPassword = await hashPassword(password);

    let newUser: any;
    let candidateProfileId: string | undefined;
    let recruiterProfileId: string | undefined;
    let companyId: string | undefined;

    if (selectedRole === Role.CANDIDATE) {
      newUser = await prisma.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          phone: phone?.trim() || null,
          role: Role.CANDIDATE,
          status: UserStatus.ACTIVE,
          candidateProfile: {
            create: {
              headline: 'Job Seeker',
            },
          },
        },
        include: {
          candidateProfile: true,
        },
      });
      candidateProfileId = newUser.candidateProfile?.id;

      // Welcome notification
      await prisma.notification.create({
        data: {
          userId: newUser.id,
          title: 'Welcome to CareerHub!',
          message: 'Complete your profile to stand out to verified recruiters and unlock top opportunities.',
          type: 'SYSTEM',
          link: '/candidate/profile',
        },
      });
    } else {
      // RECRUITER
      // Find or create Company
      let company = await prisma.company.findFirst({
        where: { name: { equals: companyName.trim(), mode: 'insensitive' } },
      });

      if (!company) {
        company = await prisma.company.create({
          data: {
            name: companyName.trim(),
            website: companyWebsite?.trim() || null,
            description: companyDescription?.trim() || null,
          },
        });
      }

      companyId = company.id;

      newUser = await prisma.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          phone: phone?.trim() || null,
          role: Role.RECRUITER,
          status: UserStatus.ACTIVE,
          recruiterProfile: {
            create: {
              companyId: company.id,
              designation: 'Talent Acquisition Partner',
            },
          },
        },
        include: {
          recruiterProfile: {
            include: { company: true },
          },
        },
      });
      recruiterProfileId = newUser.recruiterProfile?.id;

      // Welcome notification
      await prisma.notification.create({
        data: {
          userId: newUser.id,
          title: 'Welcome to CareerHub for Employers!',
          message: 'Start finding top talent by publishing your first job opening.',
          type: 'SYSTEM',
          link: '/recruiter/jobs/new',
        },
      });
    }

    const tokenPayload = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      candidateProfileId,
      recruiterProfileId,
      companyId,
    };

    const token = signJwtToken(tokenPayload);

    const response = successResponse(
      {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          candidateProfileId,
          recruiterProfileId,
          companyId,
        },
        token,
      },
      'Account created successfully',
      201
    );

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return errorResponse('Failed to register user', 500, error.message);
  }
}
