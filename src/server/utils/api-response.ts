import { NextResponse } from 'next/server';

interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function successResponse<T>(data: T, statusCode = 200) {
  const response: SuccessResponse<T> = {
    success: true,
    data,
  };

  return NextResponse.json(response, {
    status: statusCode,
  });
}

export function errorResponse(
  message: string,
  code: string,
  statusCode: number,
  details?: unknown,
) {
  const response: ErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined && {
        details,
      }),
    },
  };

  return NextResponse.json(response, {
    status: statusCode,
  });
}
