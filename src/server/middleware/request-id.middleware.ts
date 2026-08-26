import { randomUUID } from "node:crypto";
import type { RequestContext } from "@/types/request";

export function getRequestId(request:Request):RequestContext{ 
    return {

        requestId : request.headers.get('x-request-id') ?? 
        randomUUID(),
        startedAt : Date.now()
    }
}