"use client";
import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Terminal,
  Loader2,
  Globe,
  Building2,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Radio,
  Fingerprint
} from 'lucide-react';
import Link from 'next/link';
import CompetitionMarquee from './CompetitionMarquee';
import BrutalistCore from '@/components/ui/BrutalistCore';
import AiRobotAnimation from '@/components/ui/AiRobotAnimation';

type Lang = 'id' | 'en' | 'ar';

const translations = {
  id: {
    login: "Masuk Portal",
    heroBadge: "Antigravity Autonomous Platform • HIMASTI UMMAT",
    heroTitle: "Satu Ekosistem. Tanpa Batas.",
    heroDesc: "Orkestrasikan masa depan Sistem & Teknologi Informasi. Platform otonom terpadu untuk kolaborasi 18 modul divisi, presensi hardware anti-joki FIDO2, dan ekosistem AI cerdas.",
    startBtn: "Mulai Akses Portal",
    presensiBtn: "Presensi Biometrik",
    aiPrompt: "Tanyakan sesuatu ke AI Neural HIMASTI...",
    demoLimit: "Batas percakapan demo (5/5) tercapai. Silakan masuk untuk akses tanpa batas.",
    demoLeft: "Sisa Kuota Demo",
    histTitle: "Jejak Langkah Arsitektur",
    histDesc: "HIMASTI didirikan pada 21 April 2022 oleh 8 orang mahasiswa perintis melalui Mubes Pertama di Universitas Muhammadiyah Mataram. Kami lahir dari tekad mandiri untuk memimpin transformasi teknologi digital kampus.",
    divTitle: "Modul Divisi & Kepanitiaan",
    divDesc: "Infrastruktur otonom yang menggerakkan seluruh program kerja dan kaderisasi himpunan.",
    divs: [
      { name: 'Kemuhammadiyahan', desc: 'Menanamkan nilai-nilai Islam dan moral peradaban di lingkungan mahasiswa teknologi.' },
      { name: 'Kaderisasi & SDM', desc: 'Membentuk kepemimpinan tangguh, soliditas kader, dan regenerasi kepengurusan otonom.' },
      { name: 'Litbang & Riset', desc: 'Fokus pada kajian akademik, riset teknologi masa depan, dan open-source curriculum.' },
      { name: 'Media & Komunikasi', desc: 'Mengelola desain visual, siaran digital, dokumentasi multimedia, dan branding himpunan.' },
      { name: 'Hubungan Masyarakat', desc: 'Menjalin kolaborasi strategis dengan rektorat, industri teknologi, dan organisasi luar kampus.' },
      { name: 'Kewirausahaan & Danus', desc: 'Membangun kemandirian finansial ekosistem melalui unit bisnis dan official merchandise.' },
      { name: 'Minat & Bakat', desc: 'Mewadahi kompetisi dan potensi mahasiswa di bidang e-sports, riset kreatif, dan inovasi.' },
      { name: 'Aksi & Advokasi', desc: 'Menampung aspirasi mahasiswa dan mengawal kebijakan strategis kampus secara konstruktif.' }
    ]
  },
  en: {
    login: "Portal Access",
    heroBadge: "Antigravity Autonomous Platform • HIMASTI UMMAT",
    heroTitle: "One Ecosystem. Zero Limits.",
    heroDesc: "Orchestrate the future of Information Systems & Technology. An autonomous unified platform for 18 division modules, hardware-grade FIDO2 attendance, and intelligent AI kernel.",
    startBtn: "Launch Ecosystem",
    presensiBtn: "Biometric Attendance",
    aiPrompt: "Ask HIMASTI Neural AI anything...",
    demoLimit: "Demo conversation limit (5/5) reached. Please sign in for unlimited access.",
    demoLeft: "Demo Queries Remaining",
    histTitle: "Architectural Heritage",
    histDesc: "HIMASTI was founded on April 21, 2022, by 8 pioneering students through the First Grand Assembly at Universitas Muhammadiyah Mataram. Born to lead digital transformation.",
    divTitle: "Division Modules",
    divDesc: "Autonomous infrastructure driving work programs and cadre development.",
    divs: [
      { name: 'Muhammadiyah Values', desc: 'Instilling ethical foundations and Islamic principles in the tech community.' },
      { name: 'Cadre & Leadership', desc: 'Shaping future tech leaders, organizational solidarity, and autonomous management.' },
      { name: 'R&D Innovation', desc: 'Focusing on cutting-edge research, tech benchmarking, and open-source curriculums.' },
      { name: 'Media & Communication', desc: 'Managing multimedia design, digital broadcasting, and cyber presence.' },
      { name: 'Public Relations', desc: 'Orchestrating strategic external partnerships with tech industries and institutions.' },
      { name: 'Entrepreneurship', desc: 'Building financial autonomy through digital business units and merchandise.' },
      { name: 'Talent & Esports', desc: 'Channeling student competitive potential in esports, creative media, and arts.' },
      { name: 'Advocacy & Action', desc: 'Voicing student aspirations and constructive strategic policy development.' }
    ]
  },
  ar: {
    login: "دخول البوابة",
    heroBadge: "منصة هيمساتي المستقلة للتقنية المتقدمة",
    heroTitle: "نظام بيئي واحد. بلا حدود.",
    heroDesc: "قم بتوجيه مستقبل نظم وتكنولوجيا المعلومات. منصة مستقلة وموحدة لـ 18 وحدة تنظيمية، وحضور بيومتري آمن ضد التزوير، وذكاء اصطناعي تفاعلي متقدم.",
    startBtn: "دخول النظام",
    presensiBtn: "تسجيل الحضور البيومتري",
    aiPrompt: "اسأل ذكاء هيمساتي العصبي...",
    demoLimit: "تم الوصول إلى الحد الأقصى للمحادثات (٥/٥). يرجى تسجيل الدخول للوصول الكامل.",
    demoLeft: "المحادثات المتبقية",
    histTitle: "أصولنا التاريخية",
    histDesc: "تأسست هيمساتي في ٢١ أبريل ٢٠٢٢ على يد ٨ طلاب رواد خلال الجمعية الكبرى الأولى في جامعة محمدية ماتارام، لقيادة التحول الرقمي.",
    divTitle: "الوحدات التنظيمية",
    divDesc: "البنية التحتية المستقلة التي تدير برامج العمل وإعداد الكوادر.",
    divs: [
      { name: 'قيم المحمدية', desc: 'غرس المبادئ الأخلاقية والقيم الإسلامية في بيئة طلاب التقنية.' },
      { name: 'إعداد الكوادر', desc: 'بناء القيادة والعمل الجماعي والتجديد المستمر للجمعية.' },
      { name: 'البحث والتطوير', desc: 'التركيز على الأبحاث الأكاديمية والتقنيات الحديثة والمناهج المفتوحة.' },
      { name: 'الإعلام والاتصال', desc: 'إدارة التصاميم الرقمية والتوثيق والمنظومة الإعلامية.' },
      { name: 'العلاقات العامة', desc: 'بناء الشراكات مع قطاع التقنية والجامعات والمؤسسات الخارجية.' },
      { name: 'ريادة الأعمال', desc: 'تحقيق الاستقلال المالي للمنظمة عبر الوحدات التجارية.' },
      { name: 'المواهب والرياضة', desc: 'رعاية إمكانات الطلاب في الرياضات الإلكترونية والمشاريع الإبداعية.' },
      { name: 'المناصرة والدفاع', desc: 'تبني تطلعات الطلاب والسياسات الجامعية البناءة.' }
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
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )himasti_lang=([^;]+)'));
    if (match && ['id', 'en', 'ar'].includes(match[2])) {
      setLang(match[2] as Lang);
    }
  }, []);

  const changeLang = (l: Lang) => {
    setLang(l);
    document.cookie = `himasti_lang=${l}; path=/; max-age=31536000`;
  };

  const t = translations[lang];
  const isRTL = lang === 'ar';

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatCount, setChatCount] = useState(0);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: lang === 'en' ? 'Hello! I am the HIMASTI AI. How can I help you today?' : lang === 'ar' ? 'مرحباً! أنا ذكاء هيمساتي الاصطناعي. كيف يمكنني مساعدتك؟' : 'Halo! Saya AI Asisten HIMASTI. Tanyakan apa saja tentang kurikulum, kegiatan, atau organisasi kami.' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(prev => {
      const newArr = [...prev];
      if (newArr.length > 0 && newArr[0].role === 'bot' && prev.length === 1) {
        newArr[0] = { ...newArr[0], text: lang === 'en' ? 'Hello! I am the HIMASTI AI. How can I help you today?' : lang === 'ar' ? 'مرحباً! أنا ذكاء هيمساتي الاصطناعي. كيف يمكنني مساعدتك؟' : 'Halo! Saya AI Asisten HIMASTI. Tanyakan apa saja tentang kurikulum, kegiatan, atau organisasi kami.' };
      }
      return newArr;
    });
  }, [lang]);

  useEffect(() => {
    const saved = localStorage.getItem('himasti_chat_count_v4');
    if (saved) setChatCount(parseInt(saved));
  }, []);

  const handleSend = async (e: React.FormEvent | React.PointerEvent) => {
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
        body: JSON.stringify({ lang, messages: [...messages, { role: 'user', text: userMsg }] })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
      
      const newCount = chatCount + 1;
      setChatCount(newCount);
      localStorage.setItem('himasti_chat_count_v4', newCount.toString());
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Maaf, koneksi ke server AI terputus.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden ${isRTL ? 'dir-rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Background Starfield & Subtle Matrix Grid */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))] -z-10" />
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] -z-10" />

      {/* Floating Antigravity Glass Navbar */}
      <header className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[94%] max-w-5xl z-50">
        <nav className="backdrop-blur-2xl bg-slate-950/70 border border-white/10 rounded-full px-4 sm:px-6 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex justify-between items-center transition-all">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-8 h-8 rounded-full bg-cyan-500/30 animate-ping opacity-60 pointer-events-none" />
              <img src="/images/logo_himasti.jpg" alt="Logo HIMASTI" className="w-8 h-8 object-contain rounded-full border border-cyan-500/40 relative z-10 shadow-sm" />
            </div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
              HIMASTI
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
            <a href="#divisions" className="hover:text-white transition-colors">Divisi</a>
            <Link href="/absen" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
              <Fingerprint className="w-3.5 h-3.5 text-cyan-400" /> Presensi FIDO2
            </Link>
            <Link href="/admin/kader" className="hover:text-white transition-colors">Portal Admin</Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setLangOpen(!langOpen)} 
                className="p-2 bg-white/[0.04] border border-white/10 rounded-full hover:bg-white/[0.08] transition text-slate-300 flex items-center gap-1.5 text-xs font-mono"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline uppercase">{lang}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden z-50 text-xs py-1">
                  <button onClick={() => { changeLang('id'); setLangOpen(false); }} className={`block w-full text-left px-3.5 py-2 hover:bg-white/10 ${lang === 'id' ? 'font-bold text-cyan-400 bg-white/[0.05]' : 'text-slate-300'}`}>🇮🇩 Indonesia</button>
                  <button onClick={() => { changeLang('en'); setLangOpen(false); }} className={`block w-full text-left px-3.5 py-2 hover:bg-white/10 ${lang === 'en' ? 'font-bold text-cyan-400 bg-white/[0.05]' : 'text-slate-300'}`}>🇬🇧 English</button>
                  <button onClick={() => { changeLang('ar'); setLangOpen(false); }} className={`block w-full text-left px-3.5 py-2 hover:bg-white/10 ${lang === 'ar' ? 'font-bold text-cyan-400 bg-white/[0.05]' : 'text-slate-300'}`}>🇸🇦 عربي</button>
                </div>
              )}
            </div>

            {/* CTA Login Button */}
            <Link 
              href="/login" 
              className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] transition transform active:scale-95 whitespace-nowrap"
            >
              {t.login}
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-36 pb-20 max-w-5xl mx-auto gap-8 md:gap-12">
        
        {/* Luminous Core Reactor */}
        <BrutalistCore />

        {/* Hero Typography & Badges */}
        <div className="flex flex-col items-center justify-center z-10 w-full">
          
          {/* Antigravity Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.15)] mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.heroBadge}</span>
          </div>

          <AiRobotAnimation />

          {/* Majestic Hero Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] max-w-4xl mt-2 mb-5">
            <span className="bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent block">
              {t.heroTitle}
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mb-8 leading-relaxed mx-auto">
            {t.heroDesc}
          </p>

          {/* Antigravity Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 z-20">
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-full font-bold text-sm sm:text-base shadow-[0_0_35px_rgba(56,189,248,0.35)] hover:shadow-[0_0_45px_rgba(56,189,248,0.5)] transition-all flex items-center justify-center gap-2 group"
            >
              <span>{t.startBtn}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
              href="/absen" 
              className="w-full sm:w-auto px-7 py-4 rounded-full backdrop-blur-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/40 text-slate-200 text-sm sm:text-base font-semibold transition flex items-center justify-center gap-2"
            >
              <Fingerprint className="w-4 h-4 text-cyan-400" />
              <span>{t.presensiBtn}</span>
            </Link>
          </div>
        </div>

        {/* Antigravity Cyber Terminal / AI Console */}
        <div className="w-full max-w-2xl relative z-40 mt-4">
          <div className="backdrop-blur-2xl bg-slate-900/80 border border-white/10 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden flex flex-col h-[420px] sm:h-[480px] w-full text-left">
             
             {/* Terminal Header */}
             <div className="bg-slate-950/80 px-5 py-3.5 border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  </div>
                  <div className={`${isRTL ? 'mr-4' : 'ml-4'} text-xs font-mono text-cyan-400 flex items-center gap-2 tracking-wide`}>
                    <Terminal className="w-3.5 h-3.5 text-cyan-400"/>
                    <span>HIMASTI_NEURAL_KERNEL_v2.4</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>ONLINE</span>
                </div>
             </div>

             {/* Terminal Chat Stream */}
             <div className="flex-1 p-5 overflow-y-auto bg-slate-950/40 space-y-4 font-sans text-sm">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-sm shadow-md' 
                        : 'bg-white/[0.04] border border-white/10 text-slate-200 rounded-tl-sm backdrop-blur-md'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/[0.04] border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                      <span className="font-mono text-xs">{lang === "en" ? "Processing neural response..." : lang === "ar" ? "جاري معالجة الاستجابة..." : "Memproses respon neural..."}</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
             </div>

             {/* Terminal Prompt Bar */}
             <div className="p-3 bg-slate-950/90 border-t border-white/10 shrink-0">
               {chatCount >= 5 ? (
                 <div className="text-center p-3 text-xs font-mono text-rose-400 bg-rose-950/30 border border-rose-900/40 rounded-xl">
                   {t.demoLimit}
                 </div>
               ) : (
                 <form onSubmit={handleSend} className="flex items-center gap-2 w-full relative z-50">
                   <div className="relative flex-1">
                     <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400 font-mono text-xs pointer-events-none">$&gt;</span>
                     <input
                       type="text"
                       value={input}
                       onChange={(e) => setInput(e.target.value)}
                       disabled={isLoading}
                       placeholder={t.aiPrompt}
                       className="w-full bg-slate-900 border border-white/10 rounded-xl pl-8 pr-4 h-11 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all disabled:opacity-50"
                       dir={isRTL ? 'rtl' : 'ltr'}
                     />
                   </div>
                   <button 
                     type="submit" 
                     disabled={!input.trim() || isLoading}
                     className="w-11 h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl disabled:opacity-40 transition-colors flex items-center justify-center shrink-0 cursor-pointer shadow-md"
                   >
                     <Send className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                   </button>
                 </form>
               )}
               <div className="text-center mt-2 text-[10px] text-slate-500 font-mono">
                 {t.demoLeft}: {5 - chatCount}/5 • Powered by Groq Llama-3 Fast Inference
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Antigravity Live Metrics Bento Bar */}
      <section className="relative w-full py-16 px-6 bg-[#060913] text-white overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">
                HIMASTI Autonomous Ecosystem • Live Metrics
              </span>
            </div>
            <div className="text-xs font-mono text-cyan-400 flex items-center gap-1.5 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/50">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> FIDO2 Biometric & Zero-Internet Mesh
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] hover:border-cyan-500/40 backdrop-blur-md transition-all group hover:-translate-y-0.5">
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                33+
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-1.5 uppercase tracking-wider">
                Kader Aktif
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                Terverifikasi Sistem
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] hover:border-indigo-500/40 backdrop-blur-md transition-all group hover:-translate-y-0.5">
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                8
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-1.5 uppercase tracking-wider">
                Divisi Kerja
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                Paralel & Otonom
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] hover:border-blue-500/40 backdrop-blur-md transition-all group hover:-translate-y-0.5">
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">
                124+
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-1.5 uppercase tracking-wider">
                Modul IT
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                Kurikulum Terbuka
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] hover:border-emerald-500/40 backdrop-blur-md transition-all group hover:-translate-y-0.5">
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-emerald-400 transition-colors">
                99.9%
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-1.5 uppercase tracking-wider">
                Uptime Presensi
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                Anti-Joki Hardware
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <CompetitionMarquee competitions={competitions || []} />

      {/* History & Architectural Pillar */}
      <section className="w-full py-24 px-6 bg-[#030712] relative">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2">Heritage • 2022</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">{t.histTitle}</h2>
            <p className="text-slate-400 leading-relaxed text-base sm:text-lg">
              {t.histDesc}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 flex-1 w-full">
             <div className="bg-white/[0.03] p-7 rounded-3xl border border-white/10 shadow-lg text-center backdrop-blur-md hover:border-cyan-500/30 transition">
                <Building2 className="w-8 h-8 mx-auto text-cyan-400 mb-2" />
                <div className="text-3xl font-extrabold text-white font-mono">2022</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Tahun Berdiri</div>
             </div>
             <div className="bg-white/[0.03] p-7 rounded-3xl border border-white/10 shadow-lg text-center backdrop-blur-md hover:border-indigo-500/30 transition">
                <Users className="w-8 h-8 mx-auto text-indigo-400 mb-2" />
                <div className="text-3xl font-extrabold text-white font-mono">8</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Pionir Mubes</div>
             </div>
          </div>
        </div>
      </section>

      {/* Divisions Bento Grid Section */}
      <section id="divisions" className="w-full py-24 px-6 bg-[#050811] relative border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2">Infrastructure Modules</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-white">{t.divTitle}</h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">{t.divDesc}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-5xl mx-auto">
            {t.divs.map((d, index) => (
              <div 
                key={index} 
                className="group p-6 rounded-3xl bg-white/[0.02] border border-white/[0.07] hover:border-cyan-500/40 hover:bg-white/[0.04] backdrop-blur-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={divIcons[index]} />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-1.5 flex items-center gap-2">
                      <span>{d.name}</span>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-cyan-400" />
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{d.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Antigravity Footer */}
      <footer className="w-full py-12 px-6 bg-[#02050b] border-t border-white/5 text-slate-500 text-xs font-mono">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-slate-400">© 2026 HIMASTI Universitas Muhammadiyah Mataram. All Rights Reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-slate-400 hover:text-white transition">Masuk</Link>
            <Link href="/absen" className="text-cyan-400 hover:text-cyan-300 transition">Presensi FIDO2</Link>
            <a href="https://github.com/himastiummat1/Portal-himasti" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition flex items-center gap-1">
              GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
