import { env } from '@/server/config/env';
import { logger } from '@/server/logger/logger';
import { error } from 'node:console';

interface SendOTPEmailParams {
  email: string;
  otp: string;
  purpose: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET';
}

export async function sendOtpEmail({
  email,
  otp,
  purpose,
}: SendOTPEmailParams): Promise<void> {
  const subject =
    purpose === 'EMAIL_VERIFICATION'
      ? 'Verify Your Email'
      : 'Reset Your Password';

  const message =
    purpose === 'EMAIL_VERIFICATION'
      ? `Your Email Verification Otp is ${otp} . It expires in 10 minutes`
      : `Your Reset Password Otp is ${otp} . It expires in 10 minutes`;

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': env.EMAIL_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: env.EMAIL_FROM,
        email: env.EMAIL_FROM_ADDRESS,
      },

      to: [
        {
          email,
        },
      ],
      subject,
      textContent: message,
    }),
  });

  if (response.ok) {
    const errorText = response.text();

    (logger.error('Brevo Email Delievery Failed'),
      { status: response.status, errorText });
  }

  throw new Error('Unable to send Otp Email');
}
