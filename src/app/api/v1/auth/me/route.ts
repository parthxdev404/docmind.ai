import { NextRequest } from 'next/server';
import { requireAuth } from '@/server/middleware/auth.middleware';
import { findUserById } from '@/server/modules/auth/auth.repository';
import { ERROR_CODES } from '@/server/errors/error-codes';
import { AppError } from '@/server/errors/app-error';
import { successResponse } from '@/server/utils/api-response';
import { withApiHandler } from '@/server/utils/api-handler';

export const GET = withApiHandler(async (_request: NextRequest) => {
  const { userId } = await requireAuth();

  const user = await findUserById(userId);

  if (!user) {
    throw new AppError('User Not Found', 404, ERROR_CODES.USER_NOT_FOUND);
  }

  return successResponse({
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      isEmailVerified: user.isEmailVerified,
    },
  });
});
