import { SessionModel } from '../models/session.model';

export async function createSession(data: {
  userId: string;
  refreshTokenHash: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  return SessionModel.create(data);
}

export async function findSessionById(sessionId: string) {
  return SessionModel.findById(sessionId).select('+refreshTokenHash');
}

export async function revokeSession(sessionId: string) {
  return SessionModel.findByIdAndUpdate(
    sessionId,
    {
      revokedAt: new Date(),
    },
    { new: true },
  );
}

export async function revokeAllUserSession(userId: string) {
  return SessionModel.updateMany(
    {
      userId,
      revokedAt: null,
    },
    {
      revokedAt: new Date(),
    },
  );
}

export async function revokeSessionByRefreshToken(refreshTokenHash: string) {
  return SessionModel.findOneAndUpdate(
    {
      refreshTokenHash,
      revokedAt: null,
    },
    {
      revokedAt: new Date(),
    },
    {
      new: true,
    },
  );
}
