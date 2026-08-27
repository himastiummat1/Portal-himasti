const fs = require('fs');
let content = fs.readFileSync('src/app/admin/kader/KaderTableClient.tsx', 'utf8');

const oldSelect = `<option value="kader">Kader Biasa</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="ketua_umum">Ketua Umum</option>
                    <option value="sekretaris">Sekretaris Umum</option>
                    <option value="bendahara">Bendahara Umum</option>
                    <option value="kabid_kaderisasi">Kabid Kaderisasi</option>
                    <option value="kabid_humas">Kabid Humas</option>
                    <option value="admin_sekretariat">Admin Sekretariat</option>`;

const newSelect = `<option value="kader">Kader Biasa</option>
                    <option value="ketua_himpunan">Ketua Himpunan</option>
                    <option value="wakil_ketua">Wakil Ketua</option>
                    <option value="sekretaris_umum">Sekretaris Umum</option>
                    <option value="bendahara_umum">Bendahara Umum</option>
                    <optgroup label="Kepala Bidang">
                      <option value="kabid_rnd">Kabid R&D</option>
                      <option value="kabid_kaderisasi">Kabid Kaderisasi</option>
                      <option value="kabid_kominfo">Kabid Kominfo</option>
                      <option value="kabid_psdm">Kabid PSDM</option>
                    </optgroup>
                    <optgroup label="Wakil Kepala Bidang">
                      <option value="wakil_kabid_rnd">Wakil Kabid R&D</option>
                      <option value="wakil_kabid_kaderisasi">Wakil Kabid Kaderisasi</option>
                      <option value="wakil_kabid_kominfo">Wakil Kabid Kominfo</option>
                      <option value="wakil_kabid_psdm">Wakil Kabid PSDM</option>
                    </optgroup>
                    <optgroup label="Anggota Divisi">
                      <option value="anggota_rnd">Anggota R&D</option>
                      <option value="anggota_kaderisasi">Anggota Kaderisasi</option>
                      <option value="anggota_kominfo">Anggota Kominfo</option>
                      <option value="anggota_psdm">Anggota PSDM</option>
                    </optgroup>
                    <optgroup label="Lainnya">
                      <option value="panitia_sementara">Panitia Sementara</option>
                      <option value="demisioner">Demisioner</option>
                    </optgroup>`;

content = content.replace(oldSelect, newSelect);
fs.writeFileSync('src/app/admin/kader/KaderTableClient.tsx', content);
