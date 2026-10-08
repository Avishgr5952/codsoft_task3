import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/auth';
import { successResponse } from '@/lib/api-response';

export async function POST() {
  const response = successResponse(null, 'Logged out successfully');
  response.cookies.delete(AUTH_COOKIE_NAME);
  return response;
}
