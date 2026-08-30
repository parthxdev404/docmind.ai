import { NextRequest } from 'next/server';
import { getClientsIp } from './request-identity';
import { rateLimit } from './rate-limit';
import { rateLimits } from '../config/rate-limit.config';

type AuthAction =
  | 'login'
  | 'register'
  | 'verifyEmail'
  | 'forgotPassword'
  | 'resetPassword'
  | 'refresh'
  | 'resendVerificationOtp'
  | 'resendResetOtp';

export async function rateLimitAuth(request: NextRequest, action: AuthAction) {
  const ip = getClientsIp(request);

  const config = rateLimits[action];

  const key = `rate-limit:auth${action}:${ip}`;

  return rateLimit({
    key,
    limit: config.limit,
    windowSeconds: config.windowSeconds,
  });
}
