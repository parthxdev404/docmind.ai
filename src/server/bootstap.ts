import { connectToDatabase } from './db/mongoose';
import { initializedDatabaseIndex } from './db/indexes';
import { logger } from './logger/logger';

let initialized = false;

export async function bootstrap(): Promise<void> {
  if (initialized) {
    return;
  }

  logger.info('Starting Your Application');
  await connectToDatabase();
  await initializedDatabaseIndex();
  initialized = true;

  logger.info('Application Bootstrap Completed');
}
