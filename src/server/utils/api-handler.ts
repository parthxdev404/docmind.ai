import type { NextRequest } from 'next/server';
import { applySecurityHeaders } from '../middleware/security.middleware';
import { handleApiError } from '../errors/error-handler';
import { getRequestId } from '../middleware/request-id.middleware';
import { logger } from '../logger/logger';

export type ApiHandler = (
  request: NextRequest,
  context: { requestId: string; startedAt: number },
) => Promise<Response>;

export function withApiHandler(handler: ApiHandler) {
  return async (request: NextRequest) => {
    const requestContext = getRequestId(request);

    try {
      const response = await handler(request, requestContext);
      response.headers.set('x-request-id', requestContext.requestId);

      const duration = Date.now() - requestContext.startedAt;
      logger.info('Request Completed', {
        requestId: requestContext.requestId,
        method: request.method,
        path: request.nextUrl.pathname,
        status: response.status,
        durationMs: duration,
      });

      return applySecurityHeaders(response);
    } catch (error) {
      const response = handleApiError(error);

      response.headers.set('x-request-id', requestContext.requestId);
      return response;
    }
  };
}
