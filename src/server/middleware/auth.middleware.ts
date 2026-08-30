import { AppError } from '../errors/app-error';
import { ERROR_CODES } from '../errors/error-codes';
import { getAccessToken } from '../security/cookies';
import { verifyAccessToken } from '../modules/auth/token.service';
import { findUserById } from '../modules/auth/auth.repository';

export async function requireAuth() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new AppError(
      'Authentication required',
      401,
      ERROR_CODES.UNAUTHORIZED,
    );
  }

  try {
    const payload = verifyAccessToken(accessToken);

    if (payload.type !== 'access') {
      throw new Error();
    }

    const user = await findUserById(payload.sub);

    if (!user || !user.isActive) {
      throw new Error();
    }

    if (payload.tokenVersion !== user.tokenVersion) {
      throw new Error();
    }

    return {
      userId: user._id.toString(),
    };
  } catch {
    throw new AppError(
      'Invalid or expired access token',
      401,
      ERROR_CODES.UNAUTHORIZED,
    );
  }
}
