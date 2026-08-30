import { resetPasswordSchema } from '@/server/modules/auth/auth.schema';
import { resetPassword } from '@/server/modules/auth/auth.service';
import { rateLimitAuth } from '@/server/security/auth-rate-limit';
import { withApiHandler } from '@/server/utils/api-handler';
import { successResponse } from '@/server/utils/api-response';
import { validate } from '@/server/utils/validation';
import { NextRequest } from 'next/server';

export const POST = withApiHandler(async (request: NextRequest) => {
  await rateLimitAuth(request, 'resetPassword');
  const body = validate(resetPasswordSchema, await request.json());

  await resetPassword(body.email, body.otp, body.password);

  return successResponse({
    message: 'Password Reset Successfully',
  });
});
