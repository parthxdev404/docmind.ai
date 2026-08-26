import mongoose from "mongoose";
import dns from 'node:dns'
import { env } from "../config/env";
import { logger } from "../logger/logger";

dns.setServers(['8.8.8.8','8.8.4.4'])

const MONGOOSE_READY_STATE = {
  DISCONNECTED: 0,
  CONNECTED: 1,
  CONNECTING: 2,
  DISCONNECTING: 3,
} as const;

let connectionPromise : Promise<typeof mongoose> | null = null

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


export async function connectToDatabase(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === MONGOOSE_READY_STATE.CONNECTED) {
    return mongoose;
  }

  if (mongoose.connection.readyState === MONGOOSE_READY_STATE.CONNECTING) {
    if(connectionPromise){
      return connectionPromise
    }

    await mongoose.connection.asPromise()
    return mongoose
  }

  connectionPromise = mongoose.connect(env.MONGODB_URI , {
    autoIndex : env.NODE_ENV !== 'production',
    maxPoolSize : 10,
    minPoolSize : 2,
    serverSelectionTimeoutMS : 5000
  })
  .then(()=>{
    logger.info('MONGODB CONNECTED SUCCESSFULLY')
    return mongoose
  }).catch((error) => {
    logger.error("MONGODB CONNECTION FAILED",{
      error : error instanceof Error ? error.message : error
    })
    throw error
  }).finally(()=>{
    connectionPromise = null
  })

  return connectionPromise


}


export async function disconnectFromDatabase(): Promise<void> {
  if (mongoose.connection.readyState === MONGOOSE_READY_STATE.DISCONNECTED) {
    return;
  }

  await mongoose.disconnect();

  logger.info("MongoDB disconnected");
}

