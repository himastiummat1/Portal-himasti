import { prisma } from "@/lib/prisma";

export interface AuditEventParams {
  userId?: number;
  userName?: string;
  action: string;
  targetResource: string;
  details?: Record<string, any> | string;
  ipAddress?: string;
  userAgent?: string;
  status?: "success" | "denied" | "failed";
}

/**
 * Enterprise Audit Logger for HIMASTI Digital Platform.
 * Non-blocking, fault-tolerant write to immutable audit_logs ledger.
 */
export async function logAuditEvent(params: AuditEventParams) {
  try {
    const detailsString = typeof params.details === "object" 
      ? JSON.stringify(params.details) 
      : params.details || null;

    if ((prisma as any).auditLog?.create) {
      await (prisma as any).auditLog.create({
        data: {
          user_id: params.userId || null,
          user_name: params.userName || "System",
          action: params.action,
          target_resource: params.targetResource,
          details: detailsString,
          ip_address: params.ipAddress || null,
          user_agent: params.userAgent ? params.userAgent.slice(0, 255) : null,
          status: params.status || "success",
        }
      });
    } else {
      await prisma.$executeRaw`
        INSERT INTO audit_logs (user_id, user_name, action, target_resource, details, ip_address, user_agent, status, created_at)
        VALUES (${params.userId || null}, ${params.userName || "System"}, ${params.action}, ${params.targetResource}, ${detailsString}, ${params.ipAddress || null}, ${params.userAgent ? params.userAgent.slice(0, 255) : null}, ${params.status || "success"}, NOW())
      `;
    }
  } catch (error) {
    // Audit logging failure must never crash user actions
    console.error("[EnterpriseAuditLog] Failed to persist audit record:", error);
  }
}
