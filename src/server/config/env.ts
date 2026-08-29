import 'dotenv/config';
import { cleanEnv, str, url } from 'envalid';

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ['development', 'test', 'production'],
    default: 'development',
  }),
  NEXT_PUBLIC_APP_URL: url(),
  MONGODB_URI: str(),
  REDIS_URL: str(),
  JWT_ACCESS_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  JWT_ACCESS_EXPIRES_IN: str(),
  JWT_REFRESH_EXPIRES_IN: str(),
  S3_ENDPOINT: str(),
  S3_REGION: str(),
  S3_ACCESS_KEY: str(),
  S3_SECRET_KEY: str(),
  S3_BUCKET: str(),
  AI_API_KEY: str(),
  AI_MODEL: str(),
  EMAIL_FROM: str(),
  EMAIL_API_KEY: str(),
  EMAIL_FROM_ADDRESS: str(),
});
