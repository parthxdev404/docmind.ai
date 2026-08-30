import redis from '../cache/redis';
import { AppError } from '../errors/app-error';
import { ERROR_CODES } from '../errors/error-codes';

interface RateLimitOptions {
  key: string;
  limit: number;
  windowSeconds: number;
}

export async function rateLimit({
  key,
  limit,
  windowSeconds,
}: RateLimitOptions) {
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, windowSeconds);
  }

  if (count > limit) {
    const ttl = await redis.ttl(key);

    throw new AppError(
      'Too many requests. Please try again later.',
      429,
      ERROR_CODES.RATE_LIMITED,
      {
        retryAfter: ttl,
      },
    );
  }

  return {
    limit,
    remaining: Math.max(limit - count, 0),
  };
}
