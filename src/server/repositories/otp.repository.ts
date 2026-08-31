import { OtpModel } from '../models/otp.model';

export async function invalidateActiveOtp(
  userId: string,
  purpose: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET',
) {
  await OtpModel.updateMany(
    {
      userId,
      purpose,
      consumedAt: null,
      expiresAt: {
        $gt: new Date(),
      },
    },
    {
      $set: {
        consumedAt: new Date(),
      },
    },
  );
}
