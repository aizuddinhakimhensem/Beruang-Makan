/**
 * Authentication & Role-Based Access Control (RBAC) Middleware
 * BeruangMakan Backend - Express + PostgreSQL Monorepo
 */

import { Request, Response, NextFunction } from 'express';
import { verifyJwtToken } from '../services/authService.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string | null;
    phone_number: string | null;
    role: 'customer' | 'rider' | 'merchant' | 'admin';
    auth_provider: string;
  };
}

/**
 * Middleware: Verify JWT Access Token in Authorization Header
 */
export function authenticateJwt(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      code: 'UNAUTHORIZED',
      message: 'Token akses JWT diperlukan dalam header Authorization: Bearer <token>',
    });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyJwtToken(token);

  if (!payload) {
    return res.status(401).json({
      success: false,
      code: 'INVALID_TOKEN',
      message: 'Token JWT tidak sah atau telah tamat tempoh. Sila log masuk semula.',
    });
  }

  req.user = payload;
  next();
}

/**
 * Middleware: Role-Based Access Control (RBAC)
 * Example usage: authorizeRoles('admin', 'merchant')
 */
export function authorizeRoles(...allowedRoles: Array<'customer' | 'rider' | 'merchant' | 'admin'>) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: 'UNAUTHORIZED',
        message: 'Pengesahan identiti diperlukan.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        code: 'FORBIDDEN_ROLE',
        message: `Akses ditolak. Peranan '${req.user.role}' tidak dibenarkan mengakses endpoint ini. Peranan dibenarkan: [${allowedRoles.join(', ')}].`,
      });
    }

    next();
  };
}
