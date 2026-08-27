
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Terminal, Loader2, Globe, Building2, Users } from 'lucide-react';
import Link from 'next/link';
import CompetitionMarquee from './CompetitionMarquee';

type Lang = 'id' | 'en' | 'ar';

const translations = {
  id: {
    login: "Masuk",
    heroTitle: "HIMASTI 2.0",
    heroDesc: "Portal Ekosistem Digital HIMASTI adalah platform terdedikasi Anda untuk berkolaborasi. Orkestrasikan berbagai divisi dan program kerja secara paralel dalam satu ruang independen.",
    startBtn: "Mulai Akses",
    aiPrompt: "Tanyakan sesuatu ke AI HIMASTI...",
    demoLimit: "Batas percakapan demo (5/5) telah tercapai. Silakan Login untuk akses penuh.",
    demoLeft: "Sisa Percakapan Demo",
    histTitle: "Jejak Langkah Organisasi",
    histDesc: "HIMASTI didirikan pada 21 April 2022 oleh 8 orang mahasiswa perintis melalui Mubes Pertama. Kami lahir dari tekad untuk membangun wadah independen bagi mahasiswa Sistem dan Teknologi Informasi di Universitas Muhammadiyah Mataram.",
    divTitle: "Modul Divisi",
    divDesc: "Infrastruktur utama yang menggerakkan ekosistem himpunan.",
    divs: [
      { name: 'Kemuhammadiyahan', desc: 'Menanamkan nilai-nilai Islam dan moral Kemuhammadiyahan di lingkungan mahasiswa IT.' },
      { name: 'Kaderisasi', desc: 'Membentuk jiwa kepemimpinan, soliditas, dan regenerasi kepengurusan himpunan.' },
      { name: 'Penelitian & Pengembangan', desc: 'Fokus pada kajian akademik, riset teknologi, dan pengembangan kurikulum (Litbang).' },
      { name: 'Media & Komunikasi', desc: 'Mengelola desain visual, dokumentasi, dan infrastruktur digital HIMASTI.' },
      { name: 'Hubungan Masyarakat', desc: 'Menjalin relasi dan kerja sama dengan pihak rektorat, ormawa lain, dan eksternal.' },
      { name: 'Kewirausahaan', desc: 'Membangun kemandirian finansial organisasi melalui unit usaha dan merchandise.' },
      { name: 'Minat dan Bakat', desc: 'Mewadahi dan menyalurkan potensi mahasiswa di bidang olahraga, seni, dan e-sports.' },
      { name: 'Aksi dan Advokasi', desc: 'Menampung aspirasi mahasiswa dan mengawal isu-isu kebijakan strategis kampus.' }
    ]
  },
  en: {
    login: "Login",
    heroTitle: "HIMASTI 2.0",
    heroDesc: "The HIMASTI Digital Ecosystem Portal is your dedicated platform for collaboration. Orchestrate various divisions and work programs in parallel within an independent space.",
    startBtn: "Get Started",
    aiPrompt: "Ask the HIMASTI AI something...",
    demoLimit: "Demo conversation limit (5/5) reached. Please Login for full access.",
    demoLeft: "Demo Chats Left",
    histTitle: "Our History",
    histDesc: "HIMASTI was established on April 21, 2022, by 8 pioneering students during the First Grand Assembly. We were born out of a determination to build an independent platform for Information Systems and Technology students at Universitas Muhammadiyah Mataram.",
    divTitle: "Division Modules",
    divDesc: "The core infrastructure driving the organization's ecosystem.",
    divs: [
      { name: 'Muhammadiyah Values', desc: 'Instilling Islamic values and Muhammadiyah morals within the IT student environment.' },
      { name: 'Cadreization', desc: 'Shaping leadership, solidarity, and the regeneration of the association\'s management.' },
      { name: 'Research & Development', desc: 'Focusing on academic studies, technological research, and curriculum development.' },
      { name: 'Media & Communication', desc: 'Managing visual design, documentation, and HIMASTI\'s digital infrastructure.' },
      { name: 'Public Relations', desc: 'Building relations and partnerships with the rectorate, other student orgs, and external parties.' },
      { name: 'Entrepreneurship', desc: 'Building financial independence through business units and merchandise.' },
      { name: 'Talent & Interests', desc: 'Facilitating student potential in sports, arts, and e-sports.' },
      { name: 'Action & Advocacy', desc: 'Accommodating student aspirations and overseeing strategic campus policies.' }
    ]
  },
  ar: {
    login: "تسجيل الدخول",
    heroTitle: "هيمساتي ٢.٠",
    heroDesc: "بوابة النظام البيئي الرقمي لهيمساتي هي منصتك المخصصة للتعاون. نظّم مختلف الأقسام وبرامج العمل بشكل متوازٍ في مساحة مستقلة.",
    startBtn: "ابدأ الآن",
    aiPrompt: "اسأل ذكاء هيمساتي الاصطناعي...",
    demoLimit: "تم الوصول إلى الحد الأقصى للمحادثات (٥/٥). يرجى تسجيل الدخول للوصول الكامل.",
    demoLeft: "المحادثات المتبقية",
    histTitle: "تاريخنا",
    histDesc: "تأسست هيمساتي في ٢١ أبريل ٢٠٢٢ على يد ٨ طلاب رواد خلال الجمعية الكبرى الأولى. وُلدنا من رحم التصميم على بناء منصة مستقلة لطلاب نظم وتكنولوجيا المعلومات في جامعة محمدية ماتارام.",
    divTitle: "وحدات الأقسام",
    divDesc: "البنية التحتية الأساسية التي تحرك المنظمة.",
    divs: [
      { name: 'قيم المحمدية', desc: 'غرس القيم الإسلامية والأخلاق المحمدية في بيئة طلاب تكنولوجيا المعلومات.' },
      { name: 'التأطير والتكوين', desc: 'تشكيل القيادة والتضامن وتجديد إدارة الجمعية.' },
      { name: 'البحث والتطوير', desc: 'التركيز على الدراسات الأكاديمية والبحوث التكنولوجية وتطوير المناهج.' },
      { name: 'الإعلام والاتصال', desc: 'إدارة التصميم المرئي والتوثيق والبنية التحتية الرقمية.' },
      { name: 'العلاقات العامة', desc: 'بناء العلاقات والشراكات مع إدارة الجامعة والمنظمات الأخرى.' },
      { name: 'ريادة الأعمال', desc: 'بناء الاستقلال المالي للمنظمة من خلال الوحدات التجارية.' },
      { name: 'المواهب والاهتمامات', desc: 'استيعاب إمكانات الطلاب في الرياضة والفنون والرياضات الإلكترونية.' },
      { name: 'العمل والمناصرة', desc: 'استيعاب طموحات الطلاب والإشراف على سياسات الحرم الجامعي الاستراتيجية.' }
    ]
  }
};

const divIcons = [
  'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
  'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
  'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z'
];

export default function LandingAnimation({ competitions }: { competitions?: any[] }) {
  const [lang, setLang] = useState<Lang>('id');
  const t = translations[lang];
  const isRTL = lang === 'ar';

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatCount, setChatCount] = useState(0);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: lang === 'en' ? 'Hello! I am the HIMASTI AI. How can I help you today?' : lang === 'ar' ? 'مرحباً! أنا ذكاء هيمساتي الاصطناعي. كيف يمكنني مساعدتك؟' : 'Halo! Saya AI Asisten HIMASTI. Ada yang bisa saya bantu tentang organisasi atau kampus?' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(prev => {
      const newArr = [...prev];
      if (newArr.length > 0 && newArr[0].role === 'bot' && prev.length === 1) {
        newArr[0].text = lang === 'en' ? 'Hello! I am the HIMASTI AI. How can I help you today?' : lang === 'ar' ? 'مرحباً! أنا ذكاء هيمساتي الاصطناعي. كيف يمكنني مساعدتك؟' : 'Halo! Saya AI Asisten HIMASTI. Ada yang bisa saya bantu tentang organisasi atau kampus?';
      }
      return newArr;
    });
  }, [lang]);


  useEffect(() => {
    const saved = localStorage.getItem('himasti_chat_count_v3');
    if (saved) setChatCount(parseInt(saved));
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    if (chatCount >= 5) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', text: userMsg }] })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
      
      const newCount = chatCount + 1;
      setChatCount(newCount);
      localStorage.setItem('himasti_chat_count_v3', newCount.toString());
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Maaf, koneksi ke server AI terputus.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 ${isRTL ? 'dir-rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Navbar Minimalist */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <img src="/images/logo_himasti.jpg" alt="Logo HIMASTI" className="w-8 h-8 object-contain rounded-lg" />
          <span className="text-black font-bold text-xl tracking-tighter">HIMASTI</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1 text-xs">
            <button onClick={() => setLang('id')} className={`px-2 py-1 rounded ${lang === 'id' ? 'bg-white shadow-sm font-bold' : 'text-gray-500'}`}>ID</button>
            <button onClick={() => setLang('en')} className={`px-2 py-1 rounded ${lang === 'en' ? 'bg-white shadow-sm font-bold' : 'text-gray-500'}`}>EN</button>
            <button onClick={() => setLang('ar')} className={`px-2 py-1 rounded ${lang === 'ar' ? 'bg-white shadow-sm font-bold' : 'text-gray-500'}`}>عربي</button>
          </div>
          <Link href="/login" className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
            {t.login}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col lg:flex-row items-center justify-center px-6 pt-24 lg:pt-0 max-w-7xl mx-auto gap-12">
        {/* Left Typography */}
        <div className="flex-1 flex flex-col items-start justify-center z-10 w-full">
          <h1 className="text-[clamp(3rem,8vw,5.5rem)] font-medium leading-[1.1] tracking-tight text-black mb-6">
            {t.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-lg mb-10 leading-relaxed">
            {t.heroDesc}
          </p>
          <Link href="/login" className="px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 group">
            {t.startBtn}
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Right AI Terminal (Unchanged functionally) */}
        <div className="flex-1 w-full max-w-md z-10 mt-12 lg:mt-0">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]">
             <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className={`${isRTL ? 'mr-4' : 'ml-4'} text-xs font-mono text-gray-500 flex items-center gap-2`}>
                    <Terminal className="w-3 h-3"/> HIMASTI_AI_CORE_v2.0
                  </div>
                </div>
                <Bot className="w-5 h-5 text-blue-500" />
             </div>
             <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50 space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user' ? 'bg-black text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
             </div>
             <div className="p-3 bg-white border-t border-gray-200 shrink-0">
               {chatCount >= 5 ? (
                 <div className="text-center p-2 text-xs font-medium text-red-500 bg-red-50 rounded-lg">
                   {t.demoLimit}
                 </div>
               ) : (
                 <form onSubmit={handleSend} className="relative flex items-center">
                   <input
                     type="text"
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     disabled={isLoading}
                     placeholder={t.aiPrompt}
                     className={`w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50 ${isRTL ? 'pr-4 pl-12' : 'pl-4 pr-12'}`}
                     dir={isRTL ? 'rtl' : 'ltr'}
                   />
                   <button 
                     type="submit" 
                     disabled={!input.trim() || isLoading}
                     className={`absolute ${isRTL ? 'left-2' : 'right-2'} p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors`}
                   >
                     <Send className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                   </button>
                 </form>
               )}
               <div className="text-center mt-2 text-[10px] text-gray-400 font-medium">{t.demoLeft}: {5 - chatCount}/5</div>
             </div>
          </div>
        </div>
      </section>

      {/* History Section (NEW Content) */}
      <section className="w-full py-24 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h2 className="text-3xl font-medium tracking-tight text-black mb-4">{t.histTitle}</h2>
            <p className="text-gray-500 leading-relaxed text-lg">
              {t.histDesc}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 flex-1">
             <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
                <Building2 className="w-8 h-8 mx-auto text-sky-500 mb-2" />
                <div className="text-2xl font-bold text-black">2022</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Tahun Berdiri</div>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
                <Users className="w-8 h-8 mx-auto text-sky-500 mb-2" />
                <div className="text-2xl font-bold text-black">8</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Pencetus</div>
             </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="border-b border-gray-100 bg-white py-4">
        <CompetitionMarquee competitions={competitions || []} />
      </div>

      {/* Divisions Section */}
      <section id="divisions" className="w-full py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-medium tracking-tight mb-4 text-black">{t.divTitle}</h2>
            <p className="text-gray-500 text-lg">{t.divDesc}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
            {t.divs.map((divisi, i) => (
              <div key={i} className="group flex flex-col items-start bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow duration-300 w-full text-left">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-sky-50 rounded-xl border border-sky-100 group-hover:bg-blue-50 transition-colors">
                    <svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={divIcons[i]} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 leading-tight">{divisi.name}</h3>
                </div>
                <p className="text-gray-500 leading-relaxed text-sm">{divisi.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-4 text-center">
          <div className="font-medium tracking-tight text-gray-900">
            HIMASTI Portal
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} HIMASTI Digital Ecosystem. All rights reserved.
          </p>
        </div>
      </footer>
      
    </div>
  );
}
