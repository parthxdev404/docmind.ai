import { NextResponse, NextRequest } from 'next/server';

import { registerSchema } from '@/server/modules/auth/auth.schema';
import { registerUser } from '@/server/modules/auth/auth.service';
import { withApiHandler } from '@/server/utils/api-handler';
import { successResponse } from '@/server/utils/api-response';
import { validate } from '@/server/utils/validation';

export const POST = withApiHandler(async (request: NextRequest) => {
  const body = validate(registerSchema, await request.json());

  const user = await registerUser(body);

  return successResponse(
    {
      user,
    },
    201,
  );
});
