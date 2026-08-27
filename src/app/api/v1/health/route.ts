import { NextRequest, NextResponse } from 'next/server';
import { bootstrap } from '@/server/bootstap';
import { withApiHandler } from '@/server/utils/api-handler';
import { successResponse } from '@/server/utils/api-response';

export const GET = withApiHandler(async (_request: NextRequest, context) => {
  await bootstrap();

  return successResponse({
    status: 'healthy',
    database: 'connected',
    timestamp: new Date().toISOString(),
    requestId: context.requestId,
  });
});
