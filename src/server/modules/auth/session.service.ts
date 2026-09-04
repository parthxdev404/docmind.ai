import { AppError } from '@/server/errors/app-error';
import { ERROR_CODES } from '@/server/errors/error-codes';
import {
  findSessionById,
  revokeAllUserSession,
  revokeSession,
} from '../../repositories/session.repository';
import { findUserById } from './auth.repository';
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
  hashToken,
  getTokenExpiryDate,
} from './token.service';

export async function refreshSession(refreshToken: string) {
  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError(
      'Invalid or expired refresh token',
      401,
      ERROR_CODES.INVALID_TOKEN,
    );
  }

  if (payload.type !== 'refresh') {
    throw new AppError('Invalid refresh token', 401, ERROR_CODES.INVALID_TOKEN);
  }

  const session = await findSessionById(payload.sessionId);

  if (!session) {
    throw new AppError('Session not found', 401, ERROR_CODES.INVALID_TOKEN);
  }

  if (session.revokedAt) {
    throw new AppError(
      'Session has been revoked',
      401,
      ERROR_CODES.INVALID_TOKEN,
    );
  }

  if (session.expiresAt <= new Date()) {
    await revokeSession(session._id.toString());

    throw new AppError('Session has expired', 401, ERROR_CODES.TOKEN_EXPIRED);
  }

  const incomingHash = hashToken(refreshToken);

  // Refresh-token reuse / mismatch detection
  if (incomingHash !== session.refreshTokenHash) {
    await revokeSession(session._id.toString());

    throw new AppError('Invalid refresh token', 401, ERROR_CODES.INVALID_TOKEN);
  }

  const user = await findUserById(payload.sub);

  if (!user || !user.isActive) {
    await revokeSession(session._id.toString());

    throw new AppError(
      'User account is unavailable',
      401,
      ERROR_CODES.UNAUTHORIZED,
    );
  }

  // Rotate refresh token
  const newAccessToken = createAccessToken(user._id.toString(), tokenVersion);

  const newRefreshToken = createRefreshToken(
    user._id.toString(),
    session._id.toString(),
  );

  session.refreshTokenHash = hashToken(newRefreshToken);
  session.expiresAt = getTokenExpiryDate('7d');
  session.lastUsedAt = new Date();

  await session.save();

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    },
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}
