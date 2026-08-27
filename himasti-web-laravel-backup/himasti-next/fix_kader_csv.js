const fs = require('fs');
let content = fs.readFileSync('src/app/admin/kader/KaderTableClient.tsx', 'utf8');

const anchor = `  const filtered = kaders.filter(k => 
    k.nama.toLowerCase().includes(search.toLowerCase()) || 
    k.nim.toLowerCase().includes(search.toLowerCase()) ||
    k.angkatan.toLowerCase().includes(search.toLowerCase())
  );`;

const csvLogic = `
  const exportCSV = () => {
    const headers = ["ID", "Nama Lengkap", "NIM", "Email", "Angkatan", "No HP", "Jenis Kelamin", "Role", "Asal Sekolah", "Hobi"];
    const rows = filtered.map(k => [
      k.id,
      k.nama,
      k.nim,
      k.email,
      k.angkatan,
      k.no_hp,
      k.jenis_kelamin,
      k.role,
      k.asal_sekolah || "-",
      k.hobi || "-"
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(cell => \`"\${cell}"\`).join(","))].join("\\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", \`Data_Kader_HIMASTI_\${new Date().toISOString().split('T')[0]}.csv\`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };`;

content = content.replace(anchor, anchor + csvLogic);

// Replace the alert with the actual function call
content = content.replace(
  'onClick={() => alert("Fitur ekspor CSV akan segera hadir!")}',
  'onClick={exportCSV}'
);

fs.writeFileSync('src/app/admin/kader/KaderTableClient.tsx', content);
