const fs = require('fs');
let content = fs.readFileSync('src/app/admin/adart/AdArtClient.tsx', 'utf8');

// Update input accept
content = content.replace(
  'accept="application/pdf"',
  'accept=".pdf,.docx"'
);
content = content.replace(
  'Pilih File PDF AD/ART Terbaru',
  'Pilih File PDF atau DOCX AD/ART Terbaru'
);

// Update PDF Viewer to handle DOCX
const searchIframe = `<iframe 
            src="/uploads/adart/adart_official.pdf#toolbar=0" 
            className="w-full flex-1 bg-gray-100"
            title="AD/ART HIMASTI"
          />`;
const replaceIframe = `{metadata?.extension === 'docx' ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50 p-12 text-center">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-200">
                <FileText className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Dokumen Microsoft Word (.docx)</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                Browser tidak dapat menampilkan file Microsoft Word secara langsung. Silakan unduh dokumen untuk membacanya.
              </p>
              <a 
                href="/uploads/adart/adart_official.docx" 
                download="AD-ART_HIMASTI_UMMAT.docx"
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
              >
                Unduh Dokumen AD/ART
              </a>
            </div>
          ) : (
            <iframe 
              src="/uploads/adart/adart_official.pdf#toolbar=0" 
              className="w-full flex-1 bg-gray-100"
              title="AD/ART HIMASTI"
            />
          )}`;

content = content.replace(searchIframe, replaceIframe);
fs.writeFileSync('src/app/admin/adart/AdArtClient.tsx', content);
