/**
 * Admin Audit Trail & Security Express Routes
 * /api/admin
 */

import { Router } from 'express';
import { handleGetAuditLogs, handleGetPdpaDeclaration } from '../controllers/adminController.js';
import { authenticateJwt, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = Router();

// Admin Audit Logs (Strict RBAC - Admin only)
router.get('/audit-logs', authenticateJwt, authorizeRoles('admin'), handleGetAuditLogs);

// PDPA Compliance Declaration (Admin & System inspection)
router.get('/pdpa-declaration', authenticateJwt, authorizeRoles('admin'), handleGetPdpaDeclaration);

export default router;
