import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ShieldAlert, ShieldCheck, Clock, User, Activity, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = parseInt(session.user.id);
  const userRoles = await prisma.modelHasRole.findMany({
    where: { model_id: userId },
    include: { role: true }
  });

  const isSuperAdmin = userRoles.some(r => r.role.name === "super_admin");
  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Akses Ditolak</h2>
        <p className="text-gray-500 max-w-md">Hanya Super Admin yang memiliki hak akses untuk meninjau rekaman audit dan telemetri keamanan organisasi.</p>
        <Link href="/admin" className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  let logs: any[] = [];
  try {
    if ((prisma as any).auditLog?.findMany) {
      logs = await (prisma as any).auditLog.findMany({
        orderBy: { created_at: 'desc' },
        take: 100
      });
    } else {
      logs = await prisma.$queryRaw<any[]>`
        SELECT id, user_id, user_name, action, target_resource, details, ip_address, user_agent, status, created_at
        FROM audit_logs
        ORDER BY created_at DESC
        LIMIT 100
      `;
    }
  } catch (err) {
    console.error("[AuditLogs] Error fetching audit logs:", err);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-mono font-bold tracking-widest mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ENTERPRISE AUDIT TRAIL
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Audit Logs & Jejak Keamanan</h1>
          <p className="text-sm text-slate-500 mt-1">Rekaman aktivitas administratif yang kebal manipulasi (immutable ledger) secara real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Audit Engine Active ({logs.length} Rekaman)</span>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Waktu (UTC/WITA)</th>
                <th className="py-3.5 px-4">Operator</th>
                <th className="py-3.5 px-4">Aksi</th>
                <th className="py-3.5 px-4">Target Resource</th>
                <th className="py-3.5 px-4">Rincian Data</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-sans">
                    Belum ada rekaman log audit tercatat.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', second: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4 font-sans font-semibold text-slate-800 whitespace-nowrap">
                      {log.user_name}
                      {log.ip_address && (
                        <span className="block text-[10px] text-slate-400 font-mono">{log.ip_address}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider ${
                        log.action.includes('DELETE') 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : log.action.includes('ASSIGN') 
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : log.action.includes('UPDATE')
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap font-medium">
                      {log.target_resource}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-500 font-sans text-xs" title={log.details || ''}>
                      {log.details || "-"}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === 'success' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {log.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
