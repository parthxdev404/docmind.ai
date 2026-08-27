import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string()
    .email()
    .transform((value) => value.trim().toLowerCase()),

  name: z.string().trim().min(2).max(100),

  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email()
    .transform((value) => value.trim().toLowerCase()),

  password: z.string().min(1).max(128),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email()
    .transform((value) => value.trim().toLowerCase()),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),

  password: z.string().min(8).max(128),
});
