import { resendOtpSchema } from '@/server/modules/auth/auth.schema';
import { resendResetOtp } from '@/server/modules/auth/auth.service';
import { enforceOtpCooldown } from '@/server/security/otp-cooldown';
import { rateLimitOtpSend } from '@/server/security/otp-rate-limit';
import { withApiHandler } from '@/server/utils/api-handler';
import { successResponse } from '@/server/utils/api-response';
import { validate } from '@/server/utils/validation';
import { NextRequest } from 'next/server';

export const POST = withApiHandler(async (request: NextRequest) => {
  const body = validate(resendOtpSchema, await request.json());

  await rateLimitOtpSend(request, body.email, 'resendResetOtp');
  await enforceOtpCooldown({
    action: 'resendResetOtp',
    email: body.email,
    coolDownSeconds: 60,
  });
  await resendResetOtp(body.email);

  return successResponse({
    message: 'If the account exists , a password reset Otp has been sent',
  });
});
