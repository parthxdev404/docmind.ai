const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=()',
};

export function applySecurityHeaders(
  response: Response,
): Response {
  for (const [key, value] of Object.entries(
    securityHeaders,
  )) {
    response.headers.set(key, value);
  }

  return response;
}