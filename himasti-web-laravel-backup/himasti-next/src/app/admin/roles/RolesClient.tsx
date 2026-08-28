"use client";
import { useState, useTransition } from "react";
import { updateUserRole } from "./actions";
import { User, Shield, Search, CheckCircle2, AlertCircle } from "lucide-react";

export default function RolesClient({ users, roles }: { users: any[], roles: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = (userId: number, newRoleId: number) => {
    startTransition(async () => {
      try {
        await updateUserRole(userId, newRoleId);
        setMessage({ type: 'success', text: 'Role berhasil diperbarui!' });
        setTimeout(() => setMessage(null), 3000);
      } catch (err: any) {
        setMessage({ type: 'error', text: err.message || 'Gagal mengubah role' });
        setTimeout(() => setMessage(null), 3000);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div><a href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg> Kembali</a></div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Cari nama atau email kader..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {message && (
          <div className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg border \${message.type === 'success' ? 'bg-gray-50 text-gray-900 border-gray-200' : 'bg-red-50 text-red-700 border-red-200'} animate-in fade-in slide-in-from-top-2`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium">Pengguna (Kader)</th>
                <th className="px-6 py-4 font-medium">NIM / Angkatan</th>
                <th className="px-6 py-4 font-medium">Role Saat Ini</th>
                <th className="px-6 py-4 font-medium">Ubah Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    Tidak ada kader yang ditemukan.
                  </td>
                </tr>
              ) : filteredUsers.map((u) => {
                const currentRoleId = u.roles[0]?.role_id;
                const currentRoleName = roles.find(r => r.id === currentRoleId)?.name || "kader";
                
                return (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 font-bold shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{u.name}</div>
                          <div className="text-gray-500 text-xs">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                      {u.DataKader[0] ? (
                        <>
                          <div className="font-medium text-gray-900">{u.DataKader[0].nim}</div>
                          <div>Angkatan {u.DataKader[0].angkatan}</div>
                        </>
                      ) : (
                        <span className="text-gray-400 italic">Belum melengkapi data</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border \${currentRoleName.includes('admin') || currentRoleName.includes('ketua') ? 'bg-red-50 text-red-600 border-red-100' : currentRoleName.includes('kabid') ? 'bg-gray-50 text-gray-900 border-gray-100' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        {(currentRoleName.includes('admin') || currentRoleName.includes('ketua') || currentRoleName.includes('kabid')) && <Shield className="w-3 h-3" />}
                        {currentRoleName.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select 
                        disabled={isPending || u.roles.some((r: any) => r.role.name === "super_admin")}
                        value={currentRoleId || ""}
                        onChange={(e) => handleRoleChange(u.id, parseInt(e.target.value))}
                        className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-gray-900 focus:border-gray-900 block w-full p-2 disabled:opacity-50"
                      >
                        {roles.filter(r => r.name !== "super_admin").map(role => (
                          <option key={role.id} value={role.id}>
                            {role.name.replace(/_/g, ' ').toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
