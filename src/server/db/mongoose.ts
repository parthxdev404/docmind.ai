import mongoose from "mongoose";

import { env } from "../config/env";
import { logger } from "../logger/logger";

const MONGOOSE_READY_STATE = {
  DISCONNECTED: 0,
  CONNECTED: 1,
  CONNECTING: 2,
  DISCONNECTING: 3,
} as const;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === MONGOOSE_READY_STATE.CONNECTED) {
    return mongoose;
  }

  if (mongoose.connection.readyState === MONGOOSE_READY_STATE.CONNECTING) {
    await mongoose.connection.asPromise();

    return mongoose;
  }

  try {
    await mongoose.connect(env.MONGODB_URI, {
      autoIndex: env.NODE_ENV !== "production",
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
    });

    logger.info("MONGODB CONNECTED", {
      database: mongoose.connection.name,
    });
    return mongoose;
  } catch (error) {
    logger.error("MongoDb Connection Failed", {
      error: error instanceof Error ? error.message : error,
    });

    throw error;
  }
}

export async function disconnectFromDatabase(): Promise<void> {
  if (mongoose.connection.readyState === MONGOOSE_READY_STATE.DISCONNECTED) {
    return;
  }

  await mongoose.disconnect();

  logger.info("MongoDB disconnected");
}

mongoose.connection.on("connected", () => {
  logger.info("MongoDB connection established");
});

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB connection lost");
});

mongoose.connection.on("error", (error) => {
  logger.error("MongoDB connection error", {
    error: error.message,
  });
});
