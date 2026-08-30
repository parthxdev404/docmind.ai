import { NextResponse, NextRequest } from 'next/server';

import { registerSchema } from '@/server/modules/auth/auth.schema';
import { registerUser } from '@/server/modules/auth/auth.service';
import { withApiHandler } from '@/server/utils/api-handler';
import { successResponse } from '@/server/utils/api-response';
import { validate } from '@/server/utils/validation';
import { rateLimitAuth } from '@/server/security/auth-rate-limit';

export const POST = withApiHandler(async (request: NextRequest) => {
  await rateLimitAuth(request, 'register');
  const body = validate(registerSchema, await request.json());

  const user = await registerUser(body);

  return successResponse(
    {
      user,
    },
    201,
  );
});
