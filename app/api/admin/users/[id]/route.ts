import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse, forbiddenResponse, notFoundResponse } from '@/lib/api-response';
import { UserStatus } from '@prisma/client';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = getTokenFromRequest(req);
    if (!session || session.role !== 'ADMIN') {
      return forbiddenResponse('Admin access required');
    }

    const body = await req.json();
    const { status, role } = body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return notFoundResponse('User not found');
    }

    // Prevent deactivating oneself
    if (id === session.id && status === UserStatus.INACTIVE) {
      return errorResponse('You cannot deactivate your own admin account', 400);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(status && Object.values(UserStatus).includes(status) && { status }),
        ...(role && { role }),
      },
    });

    return successResponse(updated, 'User updated successfully');
  } catch (error: any) {
    console.error('Update user error:', error);
    return errorResponse('Failed to update user', 500, error.message);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = getTokenFromRequest(req);
    if (!session || session.role !== 'ADMIN') {
      return forbiddenResponse('Admin access required');
    }

    if (id === session.id) {
      return errorResponse('You cannot delete your own admin account', 400);
    }

    await prisma.user.delete({ where: { id } });

    return successResponse(null, 'User deleted successfully');
  } catch (error: any) {
    console.error('Delete user error:', error);
    return errorResponse('Failed to delete user', 500, error.message);
  }
}
