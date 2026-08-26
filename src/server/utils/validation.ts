import { z } from 'zod';

import { AppError } from '@/server/errors/app-error';
import { ERROR_CODES } from '@/server/errors/error-codes';

export function validate<T>(
  schema: z.ZodType<T>,
  data: unknown,
): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new AppError(
      'Request validation failed',
      400,
      ERROR_CODES.VALIDATION_ERROR,
      result.error.flatten(),
    );
  }

  return result.data;
}