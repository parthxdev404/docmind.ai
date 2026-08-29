import { verifyEmailSchema } from '@/server/modules/auth/auth.schema';
import { verifyEmail } from '@/server/modules/auth/auth.service';
import { withApiHandler } from '@/server/utils/api-handler';
import { successResponse } from '@/server/utils/api-response';
import { validate } from '@/server/utils/validation';
import { NextRequest } from 'next/server';

export const POST = withApiHandler(async (request: NextRequest) => {
  const body = validate(verifyEmailSchema, await request.json());

  await verifyEmail(body.email, body.otp);

  return successResponse({
    message: 'Brevo Email Verified Successfully',
  });
});
