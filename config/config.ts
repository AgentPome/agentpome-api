import { Config } from '../types/config.types';

// Only load dotenv in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgres://localhost:5432/mydb',
  resetTokenExpiryMinutes: Number(process.env.RESET_TOKEN_EXPIRY_MINUTES) || 30,
  jwtSecret: process.env.JWT_SECRET || "default_jwt_secret",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "default_refresh_token_secret",
};

// Validate required config in production
if (process.env.NODE_ENV === 'production') {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required in production');
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'default_jwt_secret') {
    throw new Error('JWT_SECRET environment variable is required in production');
  }
  if (!process.env.REFRESH_TOKEN_SECRET || process.env.REFRESH_TOKEN_SECRET === 'default_refresh_token_secret') {
    throw new Error('REFRESH_TOKEN_SECRET environment variable is required in production');
  }
}

export default config;