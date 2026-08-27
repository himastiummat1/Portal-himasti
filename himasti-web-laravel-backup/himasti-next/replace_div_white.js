const fs = require('fs');
let content = fs.readFileSync('src/app/LandingAnimation.tsx', 'utf8');

const replacement = `
          <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
            {[
              { name: 'Kemuhammadiyahan', desc: 'Menanamkan nilai-nilai Islam dan moral Kemuhammadiyahan di lingkungan mahasiswa IT. Memastikan setiap langkah organisasi sejalan dengan nilai luhur persyarikatan.', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
              { name: 'Kaderisasi', desc: 'Membentuk jiwa kepemimpinan, soliditas, dan regenerasi kepengurusan himpunan. Membangun pondasi kader yang tangguh dan adaptif terhadap tantangan teknologi.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
              { name: 'Penelitian & Pengembangan', desc: 'Fokus pada kajian akademik, riset teknologi, dan pengembangan kurikulum (Litbang). Mendorong inovasi dan kompetisi mahasiswa di tingkat nasional.', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
              { name: 'Media & Komunikasi', desc: 'Mengelola desain visual, dokumentasi, dan infrastruktur digital HIMASTI (Metkom). Memastikan branding organisasi tampil profesional di dunia maya.', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
              { name: 'Hubungan Masyarakat', desc: 'Menjalin relasi dan kerja sama dengan pihak rektorat, ormawa lain, dan eksternal. Mewakili suara HIMASTI di kancah yang lebih luas.', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
              { name: 'Kewirausahaan', desc: 'Membangun kemandirian finansial organisasi melalui unit usaha dan merchandise. Melatih jiwa entrepreneurship kader IT.', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              { name: 'Minat dan Bakat', desc: 'Mewadahi dan menyalurkan potensi mahasiswa di bidang olahraga, seni, dan e-sports. Menjaga keseimbangan antara akademik dan kreativitas.', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              { name: 'Aksi dan Advokasi', desc: 'Menampung aspirasi mahasiswa dan mengawal isu-isu kebijakan strategis kampus. Garda terdepan dalam memperjuangkan hak mahasiswa.', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' }
            ].map((divisi, i) => (
              <div key={i} className="group flex flex-col sm:flex-row items-center sm:items-start bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 hover:shadow-md transition-shadow duration-300 w-full">
                {/* Visual Icon (Left on Desktop, Top on Mobile) */}
                <div className="flex-shrink-0 mb-6 sm:mb-0 sm:mr-8 flex flex-col items-center justify-center w-24 h-24 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-blue-50 transition-colors">
                   <svg className="w-8 h-8 text-gray-700 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                     <path strokeLinecap="round" strokeLinejoin="round" d={divisi.icon} />
                   </svg>
                   <div className="mt-2 text-xs font-bold text-gray-400 group-hover:text-blue-400">0{i+1}</div>
                </div>

                {/* Text Content */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-2xl font-medium text-gray-900 mb-2">{divisi.name}</h3>
                  <p className="text-gray-500 leading-relaxed">{divisi.desc}</p>
                </div>
              </div>
            ))}
          </div>
`;

const before = content.split('<div className="flex flex-col gap-24 w-full">')[0];
const after = content.split('</div>\n        </div>\n      </section>')[1];

fs.writeFileSync('src/app/LandingAnimation.tsx', before + replacement + '</div>\n        </div>\n      </section>' + after);
