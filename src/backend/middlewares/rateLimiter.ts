/**
 * Rate Limiting Middleware for OTP Endpoints
 * Prevents SMS abuse & brute-force attacks (Max 3 OTPs per 5 minutes per phone number)
 */

import { Request, Response, NextFunction } from 'express';

interface RateRecord {
  count: number;
  firstRequestTime: number;
}

const otpRateStore: Map<string, RateRecord> = new Map();

const WINDOW_MS = 5 * 60 * 1000; // 5 Minutes Window
const MAX_OTP_REQUESTS = 3; // Max 3 OTP requests allowed per window

export function otpRateLimiter(req: Request, res: Response, next: NextFunction) {
  const phoneNumber = req.body?.phoneNumber || req.body?.phone_number || req.ip;

  if (!phoneNumber) {
    return next();
  }

  const now = Date.now();
  const record = otpRateStore.get(phoneNumber);

  if (!record) {
    otpRateStore.set(phoneNumber, { count: 1, firstRequestTime: now });
    return next();
  }

  // Check if window has expired
  if (now - record.firstRequestTime > WINDOW_MS) {
    // Reset window
    otpRateStore.set(phoneNumber, { count: 1, firstRequestTime: now });
    return next();
  }

  // Within window
  if (record.count >= MAX_OTP_REQUESTS) {
    const remainingSecs = Math.ceil((WINDOW_MS - (now - record.firstRequestTime)) / 1000);
    return res.status(429).json({
      success: false,
      code: 'TOO_MANY_REQUESTS',
      message: `Had cubaan OTP dicapai (Maksimum ${MAX_OTP_REQUESTS} kali dalam 5 minit). Sila cuba lagi selepas ${remainingSecs} saat.`,
      retryAfterSeconds: remainingSecs,
    });
  }

  record.count += 1;
  next();
}
