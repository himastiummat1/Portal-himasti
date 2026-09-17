"use client";
import { useState, useTransition, useMemo } from "react";
import { updateUserRole } from "./actions";
import { Shield, Search, CheckCircle2, AlertCircle, Lock, Users, Loader2 } from "lucide-react";

export default function RolesClient({ users, roles }: { users: any[], roles: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("all");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Grouping roles into clean semantic categories for <optgroup>
  const bphNames = ["ketua_himpunan", "wakil_ketua_himpunan", "wakil_ketua", "sekretaris_umum", "bendahara_umum", "bendahara", "admin_humas", "admin_kaderisasi"];
  const bphRoles = roles.filter(r => bphNames.includes(r.name));
  const kabidRoles = roles.filter(r => r.name.startsWith("kabid_"));
  const wakilKabidRoles = roles.filter(r => r.name.startsWith("wakil_kabid_"));
  const anggotaRoles = roles.filter(r => r.name.startsWith("anggota_"));
  const umumRoles = roles.filter(r => r.name !== "super_admin" && !bphNames.includes(r.name) && !r.name.startsWith("kabid_") && !r.name.startsWith("wakil_kabid_") && !r.name.startsWith("anggota_"));

  // Quick stats
  const stats = useMemo(() => {
    let superAdminCount = 0;
    let bphCount = 0;
    let bidangCount = 0;
    let kaderCount = 0;

    users.forEach(u => {
      const r = u.roles[0]?.role?.name || "kader";
      if (r === "super_admin") superAdminCount++;
      else if (bphNames.includes(r)) bphCount++;
      else if (r.startsWith("kabid_") || r.startsWith("wakil_kabid_") || r.startsWith("anggota_")) bidangCount++;
      else kaderCount++;
    });

    return { total: users.length, superAdminCount, bphCount, bidangCount, kaderCount };
  }, [users]);

  // Search and filter logic
  const filteredUsers = useMemo(() => {
    const s = search.toLowerCase().trim();
    return users.filter(u => {
      const nameMatch = u.name.toLowerCase().includes(s);
      const emailMatch = u.email.toLowerCase().includes(s);
      const nimMatch = u.data_kader?.nim ? u.data_kader.nim.toLowerCase().includes(s) : false;
      const currentRole = u.roles[0]?.role?.name || "kader";
      const roleMatch = currentRole.toLowerCase().includes(s);
      const matchesSearch = !s || nameMatch || emailMatch || nimMatch || roleMatch;

      if (!matchesSearch) return false;

      if (selectedRoleFilter === "all") return true;
      if (selectedRoleFilter === "super_admin") return currentRole === "super_admin";
      if (selectedRoleFilter === "bph") return bphNames.includes(currentRole);
      if (selectedRoleFilter === "bidang") return currentRole.startsWith("kabid_") || currentRole.startsWith("wakil_kabid_") || currentRole.startsWith("anggota_");
      if (selectedRoleFilter === "kader") return currentRole === "kader" || currentRole === "demisioner";
      return true;
    });
  }, [users, search, selectedRoleFilter]);

  const handleRoleChange = (userId: number, newRoleId: number) => {
    setUpdatingUserId(userId);
    startTransition(async () => {
      try {
        await updateUserRole(userId, newRoleId);
        setMessage({ type: 'success', text: 'Role berhasil diperbarui!' });
        setTimeout(() => setMessage(null), 3000);
      } catch (err: any) {
        setMessage({ type: 'error', text: err.message || 'Gagal mengubah role' });
        setTimeout(() => setMessage(null), 3000);
      } finally {
        setUpdatingUserId(null);
      }
    });
  };

  const getRoleBadgeClass = (roleName: string) => {
    if (roleName === "super_admin") return "bg-rose-50 text-rose-700 border-rose-200";
    if (bphNames.includes(roleName)) return "bg-purple-50 text-purple-700 border-purple-200";
    if (roleName.startsWith("kabid_")) return "bg-blue-50 text-blue-700 border-blue-200";
    if (roleName.startsWith("wakil_kabid_") || roleName.startsWith("anggota_")) return "bg-cyan-50 text-cyan-700 border-cyan-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="space-y-6">
      {/* Top Stat Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Pengguna</span>
            <span className="text-xl font-bold text-slate-900 font-mono">{stats.total}</span>
          </div>
          <Users className="w-5 h-5 text-slate-400" />
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">BPH & Pimpinan</span>
            <span className="text-xl font-bold text-purple-600 font-mono">{stats.bphCount}</span>
          </div>
          <Shield className="w-5 h-5 text-purple-400" />
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Struktur Bidang</span>
            <span className="text-xl font-bold text-blue-600 font-mono">{stats.bidangCount}</span>
          </div>
          <Shield className="w-5 h-5 text-blue-400" />
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Kader Biasa</span>
            <span className="text-xl font-bold text-slate-700 font-mono">{stats.kaderCount}</span>
          </div>
          <Users className="w-5 h-5 text-slate-400" />
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Cari nama, email, NIM, atau role..." 
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all"
          >
            <option value="all">Semua Kategori</option>
            <option value="super_admin">Super Admin</option>
            <option value="bph">Pimpinan & BPH</option>
            <option value="bidang">Pengurus Bidang</option>
            <option value="kader">Kader Biasa</option>
          </select>
        </div>

        {message && (
          <div className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'} animate-in fade-in slide-in-from-top-2`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}
      </div>

      {/* Desktop Table View (Hidden on mobile) */}
      <div className="hidden sm:block bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider border-b border-slate-200 font-semibold">
              <tr>
                <th className="px-5 py-3.5">Pengguna</th>
                <th className="px-5 py-3.5">NIM / Angkatan</th>
                <th className="px-5 py-3.5">Role Saat Ini</th>
                <th className="px-5 py-3.5">Ubah Hak Akses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    Tidak ada kader yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : filteredUsers.map((u) => {
                const isSuper = u.roles.some((r: any) => r.role?.name === "super_admin");
                const currentRoleId = u.roles[0]?.role_id;
                const currentRoleName = u.roles[0]?.role?.name || "kader";
                const isUpdating = updatingUserId === u.id;

                return (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img 
                          src={`https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(u.name)}`} 
                          alt="Avatar" 
                          className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 shrink-0" 
                        />
                        <div className="min-w-0 max-w-xs">
                          <div className="font-semibold text-slate-900 truncate">{u.name}</div>
                          <div className="text-slate-400 text-xs truncate">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono text-xs">
                      {u.data_kader ? (
                        <>
                          <div className="font-medium text-slate-800">{u.data_kader.nim}</div>
                          <div className="text-slate-400">Angkatan {u.data_kader.angkatan || "-"}</div>
                        </>
                      ) : (
                        <span className="text-slate-400 italic">Belum melengkapi data</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider border ${getRoleBadgeClass(currentRoleName)}`}>
                        {isSuper ? <Lock className="w-3 h-3 text-rose-600" /> : <Shield className="w-3 h-3" />}
                        {currentRoleName.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {isSuper ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded-lg select-none">
                          <Lock className="w-3.5 h-3.5" /> Akses Permanen
                        </div>
                      ) : (
                        <div className="relative inline-block w-64">
                          <select 
                            disabled={isPending}
                            value={currentRoleId || ""}
                            onChange={(e) => handleRoleChange(u.id, parseInt(e.target.value))}
                            className="bg-white border border-slate-200 text-slate-800 text-xs font-medium rounded-lg px-3 py-2 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 block w-full transition-all disabled:opacity-50 cursor-pointer"
                          >
                            <optgroup label="─── Pimpinan & BPH ───">
                              {bphRoles.map(role => (
                                <option key={role.id} value={role.id}>
                                  {role.name.replace(/_/g, ' ').toUpperCase()}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="─── Ketua Bidang (Kabid) ───">
                              {kabidRoles.map(role => (
                                <option key={role.id} value={role.id}>
                                  {role.name.replace(/_/g, ' ').toUpperCase()}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="─── Wakil Ketua Bidang ───">
                              {wakilKabidRoles.map(role => (
                                <option key={role.id} value={role.id}>
                                  {role.name.replace(/_/g, ' ').toUpperCase()}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="─── Anggota Bidang ───">
                              {anggotaRoles.map(role => (
                                <option key={role.id} value={role.id}>
                                  {role.name.replace(/_/g, ' ').toUpperCase()}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="─── Kader & Lainnya ───">
                              {umumRoles.map(role => (
                                <option key={role.id} value={role.id}>
                                  {role.name.replace(/_/g, ' ').toUpperCase()}
                                </option>
                              ))}
                            </optgroup>
                          </select>
                          {isUpdating && (
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                              <Loader2 className="w-3.5 h-3.5 text-slate-500 animate-spin" />
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View (Shown strictly on mobile sm:hidden) */}
      <div className="block sm:hidden space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
            Tidak ada kader yang sesuai.
          </div>
        ) : filteredUsers.map((u) => {
          const isSuper = u.roles.some((r: any) => r.role?.name === "super_admin");
          const currentRoleId = u.roles[0]?.role_id;
          const currentRoleName = u.roles[0]?.role?.name || "kader";
          const isUpdating = updatingUserId === u.id;

          return (
            <div key={u.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <img 
                    src={`https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(u.name)}`} 
                    alt="Avatar" 
                    className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 shrink-0" 
                  />
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 text-sm truncate">{u.name}</div>
                    <div className="text-slate-400 text-xs truncate break-all">{u.email}</div>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border shrink-0 ${getRoleBadgeClass(currentRoleName)}`}>
                  {isSuper ? <Lock className="w-2.5 h-2.5" /> : <Shield className="w-2.5 h-2.5" />}
                  {currentRoleName.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5 font-mono">
                <span>NIM: <strong className="text-slate-800">{u.data_kader?.nim || "-"}</strong></span>
                <span>Angkatan: <strong className="text-slate-800">{u.data_kader?.angkatan || "-"}</strong></span>
              </div>

              <div className="pt-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Ubah Hak Akses:
                </label>
                {isSuper ? (
                  <div className="w-full text-center py-2 text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-200 rounded-lg">
                    Akses Super Admin Terkunci
                  </div>
                ) : (
                  <div className="relative">
                    <select 
                      disabled={isPending}
                      value={currentRoleId || ""}
                      onChange={(e) => handleRoleChange(u.id, parseInt(e.target.value))}
                      className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 block w-full transition-all disabled:opacity-50"
                    >
                      <optgroup label="─── Pimpinan & BPH ───">
                        {bphRoles.map(role => (
                          <option key={role.id} value={role.id}>
                            {role.name.replace(/_/g, ' ').toUpperCase()}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="─── Ketua Bidang (Kabid) ───">
                        {kabidRoles.map(role => (
                          <option key={role.id} value={role.id}>
                            {role.name.replace(/_/g, ' ').toUpperCase()}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="─── Wakil Ketua Bidang ───">
                        {wakilKabidRoles.map(role => (
                          <option key={role.id} value={role.id}>
                            {role.name.replace(/_/g, ' ').toUpperCase()}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="─── Anggota Bidang ───">
                        {anggotaRoles.map(role => (
                          <option key={role.id} value={role.id}>
                            {role.name.replace(/_/g, ' ').toUpperCase()}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="─── Kader & Lainnya ───">
                        {umumRoles.map(role => (
                          <option key={role.id} value={role.id}>
                            {role.name.replace(/_/g, ' ').toUpperCase()}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                    {isUpdating && (
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-3.5 h-3.5 text-slate-500 animate-spin" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
