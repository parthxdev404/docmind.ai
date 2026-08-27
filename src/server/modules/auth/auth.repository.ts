import { SessionModel } from '@/server/models/session.model';
import { UserModel } from '@/server/models/user.model';
import { hashedPasswords } from './password.service';

export async function findUserById(userId: string) {
  return UserModel.findById(userId);
}

export async function findUserByEmail(email: string) {
  return UserModel.findOne({
    email: email.toLowerCase(),
  }).select('+passwordHash');
}

export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
}) {
  return UserModel.create(data);
}

export async function createSession(data: {
  userId: string;
  refreshTokenHash: string;
  expiresAt: Date;
  userAgent?: string | null;
  ipAddress?: string | null;
}) {
  return SessionModel.create(data);
}

export async function findSessionById(sessionId: string) {
  return SessionModel.findById(sessionId).select('+refreshTokenHash');
}
