import { AppError } from '../errors/app-error';
import { ERROR_CODES } from '../errors/error-codes';
import { getAccessToken } from '../security/cookies';
import { verifyAccessToken } from '../modules/auth/token.service';

export async function requireAuth() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new AppError(
      'Authentication Required',
      401,
      ERROR_CODES.UNAUTHORIZED,
    );
  }

  try {
    const payload = await verifyAccessToken(accessToken);
    if (payload.type !== 'access') {
      throw new Error();
    }

    return {
      userId: payload.sub,
    };
  } catch (error) {
    throw new AppError(
      'Invalid or expired token',
      401,
      ERROR_CODES.UNAUTHORIZED,
    );
  }
}
