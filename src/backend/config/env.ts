/**
 * Environment Configuration & Safety Fallbacks
 * BeruangMakan Backend - Express + PostgreSQL Monorepo
 */

import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://beruang_user:beruang_pass@localhost:5432/beruangmakan_db',
  JWT_SECRET: process.env.JWT_SECRET || 'beruang_makan_jwt_secret_key_malaysia_2026_super_secure',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'beruang_makan_refresh_token_secret_key_2026',
  JWT_EXPIRES_IN: '1h',
  JWT_REFRESH_EXPIRES_IN: '7d',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'mock-google-client-id.apps.googleusercontent.com',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || 'mock-google-client-secret',
  PAYMENT_GATEWAY_API_KEY: process.env.PAYMENT_GATEWAY_API_KEY || 'pk_test_beruang_tokenization',
  OTP_SERVICE_API_KEY: process.env.OTP_SERVICE_API_KEY || 'otp_mock_key',
};
