import crypto from 'node:crypto';
import { OtpModel } from '@/server/models/otp.model';

const otpLength = 6;
const otpExpiryMinutes = 10;

export function generateOtp(): string {
  const max = 10 ** otpExpiryMinutes;

  return crypto.randomInt(0, max).toString().padStart(otpLength, '0');
}

export function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

export async function createOtp(data: {
  userId: string;
  purpose: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET';
}) {
  await OtpModel.deleteMany({
    userId: data.userId,
    purpose: data.purpose,
    verifiedAt: null,
  });

  const otp = generateOtp();
  const codeHash = hashOtp(otp);
  const expiresAt = new Date(Date.now() + otpExpiryMinutes * 60 * 1000);

  await OtpModel.create({
    userId: data.userId,
    codeHash,
    purpose: data.purpose,
    expiresAt,
  });

  return otp;
}

export async function verifyOtp(data: {
  userId: string;
  otp: string;
  purpose: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET';
}) {
  const record = await OtpModel.findOne({
    userId: data.userId,
    purpose: data.purpose,
    verifiedAt: null,
  })
    .sort({ createdAt: -1 })
    .select('+codeHash');

  if (!record) {
    return false;
  }

  if (record.expiresAt <= new Date()) {
    await record.deleteOne();
    return false;
  }

  // Fallback to 0 if record.attempts is null or undefined
  const currentAttempts = record.attempts ?? 0;

  if (currentAttempts >= 5) {
    await record.deleteOne();
    return false;
  }

  // Safely increment the value
  record.attempts = currentAttempts + 1;

  const incomingHash = await hashOtp(data.otp);

  // Use strict inequality (!==)
  if (incomingHash !== record.codeHash) {
    await record.save();
    return false;
  }

  record.verifiedAt = new Date();
  await record.save();

  return true;
}
