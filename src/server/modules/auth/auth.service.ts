import { AppError } from '@/server/errors/app-error';
import { ERROR_CODES } from '@/server/errors/error-codes';

import { createSession, createUser, findUserByEmail } from './auth.repository';
import { comparePassword, hashedPasswords } from './password.service';
import {
  createAccessToken,
  createRefreshToken,
  hashToken,
} from './token.service';
import { SessionMode } from '@aws-sdk/client-s3';

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

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
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

  const accessToken = createAccessToken(user._id.toString());

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
