const fs = require('fs');
let content = fs.readFileSync('src/app/LandingAnimation.tsx', 'utf8');

const replacement = `
          <div className="flex flex-col gap-16 sm:gap-24 mt-12">
            {[
              { name: 'Kemuhammadiyahan', desc: 'Menanamkan nilai-nilai Islam dan moral Kemuhammadiyahan di lingkungan mahasiswa IT. Memastikan setiap langkah organisasi sejalan dengan nilai luhur persyarikatan.', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
              { name: 'Kaderisasi', desc: 'Membentuk jiwa kepemimpinan, soliditas, dan regenerasi kepengurusan himpunan. Membangun pondasi kader yang tangguh dan adaptif terhadap tantangan teknologi.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
              { name: 'Penelitian & Pengembangan', desc: 'Fokus pada kajian akademik, riset teknologi, dan pengembangan kurikulum (Litbang). Mendorong inovasi dan kompetisi mahasiswa di tingkat nasional.', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
              { name: 'Media & Komunikasi', desc: 'Mengelola desain visual, dokumentasi, dan infrastruktur digital HIMASTI (Metkom). Memastikan branding organisasi tampil profesional di dunia maya.', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' }
            ].map((divisi, i) => (
              <div key={i} className={\`flex flex-col sm:flex-row gap-8 lg:gap-16 items-center \${i % 2 !== 0 ? 'sm:flex-row-reverse' : ''}\`}>
                <div className="flex-1 w-full relative">
                  <div className="absolute inset-0 bg-purple-700/5 transform rotate-3 rounded-3xl"></div>
                  <div className="relative bg-white border border-gray-200 p-8 sm:p-12 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center text-center min-h-[300px]">
                    <div className="w-16 h-16 bg-purple-50 text-purple-700 rounded-2xl flex items-center justify-center mb-6">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={divisi.icon} />
                      </svg>
                    </div>
                    <div className="text-8xl font-black text-gray-50 absolute top-4 left-6 pointer-events-none select-none tracking-tighter">0{i+1}</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2 relative z-10">Sistem & Tata Kelola</h4>
                    <p className="text-sm text-gray-500 max-w-xs relative z-10">Dirancang secara spesifik untuk menangani {divisi.name} dengan skalabilitas tinggi.</p>
                  </div>
                </div>
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-purple-700 uppercase tracking-widest">
                    Divisi 0{i+1}
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-purple-950 tracking-tight leading-tight">{divisi.name}</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">{divisi.desc}</p>
                  <ul className="space-y-3 pt-4 border-t border-gray-100">
                    <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                      Program Kerja Unggulan & Strategis
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                      Pengembangan Kapasitas Anggota
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                      Integrasi dengan Ekosistem Digital HIMASTI
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
`;

// Extract before and after the grid gap-4 div
const before = content.split('<div className="grid gap-4">')[0];
const after = content.split('</details>\n            ))}\n          </div>')[1];

fs.writeFileSync('src/app/LandingAnimation.tsx', before + replacement + after);
