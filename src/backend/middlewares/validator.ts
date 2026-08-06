/**
 * Input Sanitization & Parameter Validation Middleware
 * Mitigates SQL Injection, XSS, and Malformed Request Payloads
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Basic Sanitization Helper to strip dangerous HTML / SQL keywords from string inputs
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return input;
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Strip script tags
    .replace(/['";\\]/g, (match) => { // Escape SQL quote characters if passed un-parameterized
      switch (match) {
        case "'": return "''";
        case '"': return '""';
        case '\\': return '\\\\';
        default: return match;
      }
    });
}

/**
 * Middleware: Sanitize req.body strings
 */
export function sanitizeInputMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeString(req.body[key]);
      }
    }
  }
  next();
}

/**
 * Validate Phone Number format (Malaysian format e.g. +60123456789 or 0123456789)
 */
export function validateMalaysianPhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s-]/g, '');
  return /^(\+?60|0)1[0-9]{8,9}$/.test(cleaned);
}
