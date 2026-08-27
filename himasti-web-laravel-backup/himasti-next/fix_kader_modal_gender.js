const fs = require('fs');
let content = fs.readFileSync('src/app/admin/kader/KaderTableClient.tsx', 'utf8');

const search = `<div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Jenis Kelamin</label>
                  <div className="text-gray-900 font-medium">{selectedKader.jenis_kelamin === 'L' ? 'Laki-laki' : selectedKader.jenis_kelamin === 'P' ? 'Perempuan' : '-'}</div>
                </div>`;

const replace = `<div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Jenis Kelamin</label>
                  {isEditing ? (
                    <select name="jenis_kelamin" defaultValue={selectedKader.jenis_kelamin} className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none">
                      <option value="">Pilih</option>
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  ) : (
                    <div className="text-gray-900 font-medium">{selectedKader.jenis_kelamin === 'L' ? 'Laki-laki' : selectedKader.jenis_kelamin === 'P' ? 'Perempuan' : '-'}</div>
                  )}
                </div>`;

content = content.replace(search, replace);
fs.writeFileSync('src/app/admin/kader/KaderTableClient.tsx', content);
