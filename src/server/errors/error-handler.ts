import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { AppError } from './app-error';
import { ERROR_CODES } from './error-codes';

import { logger } from '@/server/logger/logger';

export function handleApiError(
  error: unknown,
): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          ...(error.details !== undefined && {
            details: error.details,
          }),
        },
      },
      {
        status: error.statusCode,
      },
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Request validation failed',
          details: error.flatten(),
        },
      },
      {
        status: 400,
      },
    );
  }

  logger.error('Unhandled API error', {
    error:
      error instanceof Error
        ? error.message
        : error,
    stack:
      error instanceof Error
        ? error.stack
        : undefined,
  });

  return NextResponse.json(
    {
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      },
    },
    {
      status: 500,
    },
  );
}