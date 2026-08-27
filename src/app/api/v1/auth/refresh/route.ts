import { NextRequest } from 'next/server';
import { getRefreshToken } from '@/server/security/cookies';
import { refreshSession } from '@/server/modules/auth/session.service';
import { withApiHandler } from '@/server/utils/api-handler';
import { successResponse } from '@/server/utils/api-response';
import { AppError } from '@/server/errors/app-error';
import { ERROR_CODES } from '@/server/errors/error-codes';
import { setAuthCookies } from '@/server/security/cookies';

export const POST = withApiHandler(async (_request: NextRequest) => {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    throw new AppError(
      'Refresh Token Is Missing',
      401,
      ERROR_CODES.UNAUTHORIZED,
    );
  }

  const result = await refreshSession(refreshToken);
  await setAuthCookies(result.accessToken, result.refreshToken);

  return successResponse({
    user: result.user,
  });
});
