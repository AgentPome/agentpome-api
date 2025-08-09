import dotenv from 'dotenv';
import { Config } from '../types/config.types';

dotenv.config();


const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgres://localhost:5432/mydb',
  resetTokenExpiryMinutes: Number(process.env.RESET_TOKEN_EXPIRY_MINUTES) || 30,
  jwtSecret: process.env.JWT_SECRET || "default_jwt_secret",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "default_refresh_token_secret",
};

export default config;