import { AppError } from '@/server/errors/app-error';
import { ERROR_CODES } from '@/server/errors/error-codes';
import { createOtp, verifyOtp } from './otp.service';
import { sendOtpEmail } from '../email/brevo.service';
import { createSession, createUser, findUserByEmail } from './auth.repository';
import { comparePassword, hashedPasswords } from './password.service';
import {
  createAccessToken,
  createRefreshToken,
  hashToken,
} from './token.service';
import { revokeAllUserSession } from '@/server/repositories/session.repository';
import { updateUserPassword } from '@/server/repositories/user.repository';

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new AppError(
      'An Account with this email already exists',
      409,
      ERROR_CODES.EMAIL_ALREADY_EXISTS,
    );
  }

  const passwordHash = await hashedPasswords(data.password);

  const user = await createUser({
    name: data.name,
    email: data.email,
    passwordHash,
  });

  const otp = await createOtp({
    userId: user._id.toString(),
    purpose: 'EMAIL_VERIFICATION',
  });

  await sendOtpEmail({ email: user.email, otp, purpose: 'EMAIL_VERIFICATION' });

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    isEmailVerified: user.isEmailVerified,
  };
}

export async function authenticateUser(data: {
  email: string;
  password: string;
  userAgent?: string | null;
  ipAddress?: string | null;
}) {
  const user = await findUserByEmail(data.email);

  if (!user) {
    throw new AppError(
      'INVALID EMAIL AND PASSWORD',
      401,
      ERROR_CODES.INVALID_CREDENTIALS,
    );
  }

  if (!user.isActive) {
    throw new AppError('Account is disabled', 403, ERROR_CODES.FORBIDDEN);
  }

  const validPassword = await comparePassword(
    data.password,
    user?.passwordHash,
  );
  if (!validPassword) {
    throw new AppError(
      'Invalid Email Or Password',
      401,
      ERROR_CODES.INVALID_CREDENTIALS,
    );
  }

  const session = await createSession({
    userId: user._id.toString(),
    refreshTokenHash: 'temporary',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    userAgent: data.userAgent,
    ipAddress: data.ipAddress,
  });

  const accessToken = createAccessToken(user._id.toString(), user.tokenVersion);

  const refreshToken = createRefreshToken(
    user._id.toString(),
    session._id.toString(),
  );

  session.refreshTokenHash = hashToken(refreshToken);
  await session.save();

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    },
    accessToken,
    refreshToken,
  };
}

export async function verifyEmail(email: string, otp: string) {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError(
      'Invalid verification request',
      400,
      ERROR_CODES.INVALID_TOKEN,
    );
  }

  if (user.isEmailVerified) {
    return;
  }

  const valid = await verifyOtp({
    userId: user._id.toString(),
    otp,
    purpose: 'EMAIL_VERIFICATION',
  });

  if (!valid) {
    throw new AppError(
      'Invalid or expired OTP',
      400,
      ERROR_CODES.INVALID_TOKEN,
    );
  }

  user.isEmailVerified = true;

  await user.save();
}

export async function requestPasswordRequest(email: string): Promise<void> {
  const user = await findUserByEmail(email);

  if (!user) {
    return;
  }

  const otp = await createOtp({
    userId: user._id.toString(),
    purpose: 'PASSWORD_RESET',
  });

  await sendOtpEmail({
    email: user.email,
    otp,
    purpose: 'PASSWORD_RESET',
  });
}

export async function resetPassword(
  email: string,
  otp: string,
  newPassword: string,
): Promise<void> {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError(
      'Invalid or Expired Token',
      400,
      ERROR_CODES.INVALID_TOKEN,
    );
  }

  const valid = verifyOtp({
    userId: user._id.toString(),
    otp,
    purpose: 'PASSWORD_RESET',
  });

  if (!valid) {
    throw new AppError(
      'Invalid or Expired Token',
      400,
      ERROR_CODES.INVALID_TOKEN,
    );
  }

  const passwordHash = await hashedPasswords(newPassword);
  await updateUserPassword(user._id.toString(), passwordHash);

  await revokeAllUserSession(user._id.toString());
}
