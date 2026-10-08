import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, signJwtToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-response';
import { AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return errorResponse('Email and password are required', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        candidateProfile: true,
        recruiterProfile: {
          include: {
            company: true,
          },
        },
      },
    });

    if (!user) {
      return errorResponse('Invalid email or password', 401);
    }

    if (user.status === 'INACTIVE') {
      return errorResponse('Your account has been deactivated. Please contact support.', 403);
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return errorResponse('Invalid email or password', 401);
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      candidateProfileId: user.candidateProfile?.id,
      recruiterProfileId: user.recruiterProfile?.id,
      companyId: user.recruiterProfile?.companyId,
    };

    const token = signJwtToken(tokenPayload);

    const response = successResponse(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          candidateProfileId: user.candidateProfile?.id,
          recruiterProfileId: user.recruiterProfile?.id,
          company: user.recruiterProfile?.company,
        },
        token,
      },
      'Login successful'
    );

    // Set secure HTTP-only cookie
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return errorResponse('Internal server error during login', 500, error.message);
  }
}
