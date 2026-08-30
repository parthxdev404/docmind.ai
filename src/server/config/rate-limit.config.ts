export const rateLimits = {
  login: {
    limit: 5,
    windowSeconds: 15 * 60,
  },
  register: {
    limit: 5,
    windowSeconds: 15 * 60,
  },
  verifyEmail: {
    limit: 5,
    windowSeconds: 10 * 60,
  },
  forgotPassword: {
    limit: 3,
    windowSeconds: 15 * 60,
  },
  resetPassword: {
    limit: 5,
    windowSeconds: 15 * 60,
  },
  refresh: {
    limit: 30,
    windowSeconds: 15 * 60,
  },
  resendVerificationOtp: {
    limit: 3,
    windowSeconds: 15 * 60,
  },

  resendResetOtp: {
    limit: 3,
    windowSeconds: 15 * 60,
  },
} as const;
