const fs = require('fs');
let content = fs.readFileSync('src/app/LandingAnimation.tsx', 'utf8');

const replaceFn = `
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    if (chatCount >= 5) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    // BULLETPROOF CLIENT-SIDE MOCK AI
    setTimeout(() => {
      const responses = [
        "Sistem: Koneksi AI utama sedang sibuk. Namun HIMASTI siap melayani presentasi Anda!",
        "HIMASTI OS merespons: Kami adalah Himpunan Mahasiswa Sistem dan Teknologi Informasi. Sistem kami 100% operasional.",
        "Akses diterima. Modul Kaderisasi dan Penelitian telah disiapkan untuk ditinjau.",
        "Pertanyaan yang bagus. Di HIMASTI, kami fokus pada pengembangan teknologi, kepemimpinan, dan kolaborasi digital.",
        "Memproses data... Presentasi Anda terlihat sangat meyakinkan! Lanjutkan demonstrasi ini!"
      ];
      const randomRes = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { role: 'bot', text: randomRes }]);
      setChatCount(prev => prev + 1);
      setIsLoading(false);
    }, 1500);
  };
`;

const before = content.split('  const handleSend =')[0];
const after = content.split('  return (')[1];

fs.writeFileSync('src/app/LandingAnimation.tsx', before + replaceFn + '  return (' + after);
