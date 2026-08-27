import { cookies } from 'next/headers';

const ACCESS_TOKEN_COOKIE = 'docmind_access_token';
const REFRESH_TOKEN_COOKIE = 'docmind_refresh_token';

const isProduction = process.env.NODE_ENV === 'production';

const cookieOption = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax' as const,
  path: '/',
};

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  const cookiesStore = await cookies();

  cookiesStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    ...cookieOption,
    maxAge: 60 * 15,
  });

  cookiesStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...cookieOption,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getAccessToken(): Promise<string | undefined> {
  const cookiesStore = await cookies();

  return cookiesStore.get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookiesStore = await cookies();

  return cookiesStore.get(REFRESH_TOKEN_COOKIE)?.value;
}

export async function clearAuthTokens(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}
