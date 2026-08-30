import { loginSchema } from '@/server/modules/auth/auth.schema';
import { NextRequest } from 'next/server';
import { authenticateUser } from '@/server/modules/auth/auth.service';
import { withApiHandler } from '@/server/utils/api-handler';
import { successResponse } from '@/server/utils/api-response';
import { setAuthCookies } from '@/server/security/cookies';
import { validate } from '@/server/utils/validation';
import { rateLimitAuth } from '@/server/security/auth-rate-limit';

export const POST = withApiHandler(async (request: NextRequest) => {
  await rateLimitAuth(request, 'login');
  const body = validate(loginSchema, await request.json());
  const result = await authenticateUser({
    ...body,
    userAgent: request.headers.get('user-agent'),
    ipAddress:
      request.headers.get('x-forwarded-for') ??
      request.headers.get('x-real-ip'),
  });

  await setAuthCookies(result.accessToken, result.refreshToken);

  return successResponse({
    user: result.user,
  });
});
