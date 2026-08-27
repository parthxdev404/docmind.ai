import { NextRequest } from 'next/server';
import { withApiHandler } from '@/server/utils/api-handler';
import { successResponse } from '@/server/utils/api-response';
import { ERROR_CODES } from '@/server/errors/error-codes';
import { revokeSessionByRefreshToken } from '@/server/repositories/session.repository';
import { getRefreshToken, clearAuthTokens } from '@/server/security/cookies';
import { hashToken } from '@/server/modules/auth/token.service';

export const POST = withApiHandler(async (_request: NextRequest) => {
  const refreshToken = await getRefreshToken();

  if (refreshToken) {
    const refreshTokenHash = hashToken(refreshToken);

    await revokeSessionByRefreshToken(refreshTokenHash);
  }

  await clearAuthTokens();

  return successResponse({
    message: 'Logged Out Successfully',
  });
});
