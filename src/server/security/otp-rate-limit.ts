import { NextRequest } from 'next/server';
import { getClientsIp } from './request-identity';
import { rateLimit } from './rate-limit';
import { rateLimitEmail } from './email-rate-limit';
import { rateLimits } from '../config/rate-limit.config';

type OTPResendVerification = 'resendVerificationOtp' | 'resendResetOtp';

export async function rateLimitOtpSend(
  request: NextRequest,
  email: string,
  action: OTPResendVerification,
) {
  const config = rateLimits[action];

  const ip = getClientsIp(request);

  await rateLimit({
    key: `rate-limit:otp:${action}:ip:${ip}`,
    limit: config.limit,
    windowSeconds: config.windowSeconds,
  });

  await rateLimitEmail({
    action,
    email,
    limit: config.limit,
    windowSeconds: config.windowSeconds,
  });
}
