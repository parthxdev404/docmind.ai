import redis from '../cache/redis';
import { AppError } from '../errors/app-error';
import { ERROR_CODES } from '../errors/error-codes';
interface OTPCoolDownOptions {
  action: string;
  email: string;
  coolDownSeconds: number;
}

export async function enforceOtpCooldown({
  action,
  email,
  coolDownSeconds,
}: OTPCoolDownOptions) {
  const normalizedEmail = email.trim().toLowerCase();

  const key = `otp:cooldown:${action}:${normalizedEmail}`;

  const exists = await redis.exists(key);

  if (exists) {
    const ttl = await redis.ttl(key);

    throw new AppError(
      `Please wait ${ttl} seconds before requesting another otp`,
      429,
      ERROR_CODES.RATE_LIMITED,
      {
        retryAfter: ttl,
      },
    );
  }

  await redis.set(key, '1', 'EX', coolDownSeconds);
}
