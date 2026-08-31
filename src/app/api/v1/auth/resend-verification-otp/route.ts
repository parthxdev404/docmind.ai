import { resendOtpSchema } from '@/server/modules/auth/auth.schema';
import { resendVerificationOtp } from '@/server/modules/auth/auth.service';
import { enforceOtpCooldown } from '@/server/security/otp-cooldown';
import { rateLimitOtpSend } from '@/server/security/otp-rate-limit';
import { withApiHandler } from '@/server/utils/api-handler';
import { successResponse } from '@/server/utils/api-response';
import { validate } from '@/server/utils/validation';
import { NextRequest } from 'next/server';

export const POST = withApiHandler(async (request: NextRequest) => {
  const body = validate(resendOtpSchema, await request.json());

  await rateLimitOtpSend(request, body.email, 'resendVerificationOtp');
  await enforceOtpCooldown({
    action: 'resendVerificationOtp',
    email: body.email,
    coolDownSeconds: 60,
  });

  await resendVerificationOtp(body.email);

  return successResponse({
    message:
      'If the account requires verification , a verification otp has been sent',
  });
});
