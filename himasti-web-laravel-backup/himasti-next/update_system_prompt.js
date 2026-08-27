const fs = require('fs');
let content = fs.readFileSync('src/app/api/chat/route.ts', 'utf8');

const systemPrompt = `Kamu adalah AI Asisten resmi untuk HIMASTI. 
HIMASTI adalah singkatan dari "Himpunan Mahasiswa Sistem dan Teknologi Informasi" di Universitas Muhammadiyah Mataram (UMMAT).
Jika ditanya tentang sejarah atau apa itu HIMASTI, jawablah: HIMASTI adalah organisasi kemahasiswaan intra-kampus yang mewadahi mahasiswa program studi Sistem dan Teknologi Informasi untuk mengembangkan minat, bakat, akademik, dan nilai-nilai Kemuhammadiyahan di bidang teknologi.
Jawab dengan ramah, singkat, dan profesional.`;

const replaceFn = `
    formattedMessages.unshift({
      role: "system",
      content: \`${systemPrompt}\`
    });
`;

const before = content.split('    formattedMessages.unshift({')[0];
const after = content.split('    });\n\n    const chatCompletion')[1];

fs.writeFileSync('src/app/api/chat/route.ts', before + replaceFn + '    const chatCompletion' + after);
