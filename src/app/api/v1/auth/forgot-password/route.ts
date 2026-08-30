import { forgotPasswordSchema } from '@/server/modules/auth/auth.schema';
import { requestPasswordRequest } from '@/server/modules/auth/auth.service';
import { rateLimitAuth } from '@/server/security/auth-rate-limit';
import { withApiHandler } from '@/server/utils/api-handler';
import { successResponse } from '@/server/utils/api-response';
import { validate } from '@/server/utils/validation';
import { NextRequest } from 'next/server';

export const POST = withApiHandler(async (request: NextRequest) => {
  await rateLimitAuth(request, 'forgotPassword');
  const body = validate(forgotPasswordSchema, await request.json());
  await requestPasswordRequest(body.email);

  return successResponse({
    message:
      'If an account with this email exists , a password reset OTP has been sent ',
  });
});
