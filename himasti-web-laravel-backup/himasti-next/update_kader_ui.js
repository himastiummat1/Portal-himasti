const fs = require('fs');
let content = fs.readFileSync('src/app/admin/kader/KaderTableClient.tsx', 'utf8');

const replacement = `
              <div>
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">Latar Belakang</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                  <div>
                    <span className="text-gray-500 block mb-0.5">Asal Sekolah</span>
                    <span className="font-medium text-gray-900">{selectedKader.asal_sekolah || "-"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-0.5">Jenis Kelamin</span>
                    <span className="font-medium text-gray-900">{selectedKader.jenis_kelamin || "-"}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-500 block mb-0.5">Hobi / Minat</span>
                    <span className="font-medium text-gray-900">{selectedKader.hobi || "-"}</span>
                  </div>
                </div>
              </div>

              {/* UBAH ROLE (Khusus Super Admin) */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-6">
                <h4 className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-3">Manajemen Hak Akses (Role)</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select 
                    id="roleSelect"
                    defaultValue={selectedKader.role} 
                    className="flex-1 bg-white border border-blue-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="kader">Kader Biasa</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="ketua_umum">Ketua Umum</option>
                    <option value="sekretaris">Sekretaris Umum</option>
                    <option value="bendahara">Bendahara Umum</option>
                    <option value="kabid_kaderisasi">Kabid Kaderisasi</option>
                    <option value="kabid_humas">Kabid Humas</option>
                    <option value="admin_sekretariat">Admin Sekretariat</option>
                  </select>
                  <button 
                    onClick={async () => {
                      const newRole = (document.getElementById('roleSelect') as HTMLSelectElement).value;
                      if(newRole === selectedKader.role) return;
                      const res = await fetch('/api/admin/kader/role', {
                        method: 'POST', body: JSON.stringify({ userId: selectedKader.user_id, newRoleName: newRole })
                      });
                      if(res.ok) {
                        alert('Berhasil mengubah role! Silakan refresh halaman.');
                        window.location.reload();
                      } else {
                        alert('Gagal mengubah role. (Pastikan Anda Super Admin)');
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    Terapkan Role
                  </button>
                </div>
              </div>
`;

const searchStr = `
              <div>
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">Latar Belakang</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                  <div>
                    <span className="text-gray-500 block mb-0.5">Asal Sekolah</span>
                    <span className="font-medium text-gray-900">{selectedKader.asal_sekolah || "-"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-0.5">Jenis Kelamin</span>
                    <span className="font-medium text-gray-900">{selectedKader.jenis_kelamin || "-"}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-500 block mb-0.5">Hobi / Minat</span>
                    <span className="font-medium text-gray-900">{selectedKader.hobi || "-"}</span>
                  </div>
                </div>
              </div>
`;

content = content.replace(searchStr, replacement);
fs.writeFileSync('src/app/admin/kader/KaderTableClient.tsx', content);
