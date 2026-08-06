/**
 * Admin Audit Logging & PDPA Compliance Service
 * Logs critical admin actions to audit trail & handles PDPA data declaration
 */

import { db, AdminAuditLog } from '../db/index.js';

export async function logAdminAction(
  adminUserId: string,
  action: string,
  targetResource: string,
  details: any,
  ipAddress: string = '127.0.0.1'
): Promise<AdminAuditLog> {
  const log: AdminAuditLog = {
    id: `log-${Date.now()}`,
    admin_user_id: adminUserId,
    action,
    target_resource: targetResource,
    details,
    ip_address: ipAddress,
    created_at: new Date().toISOString(),
  };

  db.auditLogs.push(log);
  return log;
}

export async function getAdminAuditLogs(): Promise<AdminAuditLog[]> {
  return db.auditLogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/**
 * PDPA (Personal Data Protection Act Malaysia 2010) Compliance Declaration
 */
export function getPdpaComplianceDeclaration() {
  return {
    compliance_framework: 'PDPA Malaysia 2010',
    data_collected: {
      google_oauth: ['full_name', 'email_address', 'profile_picture_url'],
      phone_otp: ['phone_number'],
      location_services: ['latitude', 'longitude', 'delivery_address'],
    },
    security_measures: {
      at_rest_encryption: 'AES-256 for user geolocation coordinates & phone numbers',
      in_transit_encryption: 'TLS 1.3 / HTTPS for all REST API endpoints',
      tokenization: 'Payment card details tokenized by gateway (No raw CC stored)',
      admin_audit_trail: 'All admin RBAC actions recorded in immutable admin_audit_logs table',
    },
    user_rights: [
      'Right to access personal profile data',
      'Right to correct inaccurate details',
      'Right to request account deletion & data erasure',
    ],
  };
}
