import crypto from 'node:crypto'
import  jwt  from 'jsonwebtoken'

import { env } from '@/server/config/env'

interface AccessTokenPayload {
    sub : string,
    type  : 'access'
}

interface RefreshTokenPayload { 
    sub : string,
    sessionId : string,
    type  :'refresh'
}

export function createAccessToken(userId :string):string {
    const payload : AccessTokenPayload = {
        sub : userId ,
        type : 'access'
    }

    return jwt.sign(payload, env.JWT_ACCESS_SECRET , {
        expiresIn : env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn']
    })
}

export function createRefreshToken(userId:string,sessionId:string):string{
    const payload : RefreshTokenPayload = {
        sub : userId,
        sessionId : sessionId,
        type : 'refresh'
    }

    return jwt.sign(payload,env.JWT_REFRESH_SECRET , {
        expiresIn : env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn']
    })
}

export function verifyAccessToken(token:string):AccessTokenPayload {
    return jwt.verify(
        token,
        env.JWT_ACCESS_SECRET
    ) as AccessTokenPayload
}

export function refreshAccessToken( token:string ):RefreshTokenPayload {
    return jwt.verify(
        token,
        env.JWT_REFRESH_SECRET 
    ) as RefreshTokenPayload
}

export function hashToken(token:string):string{
    return crypto.createHash("sha256").update(token).digest('hex')
}

export function generateRandomToken( bytes = 32 ){
    return crypto.randomBytes(bytes).toString('hex')
}