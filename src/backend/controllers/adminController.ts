/**
 * Admin Audit Trail & Compliance Controller
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';
import { logAdminAction, getAdminAuditLogs, getPdpaComplianceDeclaration } from '../services/auditService.js';

/**
 * GET /api/admin/audit-logs
 */
export async function handleGetAuditLogs(req: AuthenticatedRequest, res: Response) {
  try {
    const adminId = req.user?.id || 'u-admin-001';
    
    // Log this admin inspection action itself
    await logAdminAction(adminId, 'INSPECT_AUDIT_LOGS', 'admin_audit_logs', { viewer: req.user?.email }, req.ip);

    const logs = await getAdminAuditLogs();
    return res.status(200).json({
      success: true,
      count: logs.length,
      auditLogs: logs,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * GET /api/admin/pdpa-declaration
 */
export async function handleGetPdpaDeclaration(req: AuthenticatedRequest, res: Response) {
  try {
    const declaration = getPdpaComplianceDeclaration();
    return res.status(200).json({
      success: true,
      pdpa: declaration,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
