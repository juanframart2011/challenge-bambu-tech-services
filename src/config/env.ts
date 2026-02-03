import { config } from 'dotenv';

config();

export const ENV = {
  PORT: process.env.PORT || '3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432'),
  DB_USERNAME: process.env.DB_USERNAME || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'todo_db',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
};
