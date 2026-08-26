import mongoose from "mongoose";
import { logger } from "../logger/logger";

let indexesInitialized = false

export async function initializedDatabaseIndex():Promise<void>{
    if(indexesInitialized){
        return;
    }

    if(mongoose.connection.readyState !== 1){
        throw new Error('MongoDB must connected before initializing indexes')
    }

    indexesInitialized = true;

    logger.info('MongoDB Indexes Initialized')


}