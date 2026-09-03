"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
  Fingerprint
} from 'lucide-react';
import Link from 'next/link';
import CompetitionMarquee from './CompetitionMarquee';
import BrutalistCore from '@/components/ui/BrutalistCore';
import AiRobotAnimation from '@/components/ui/AiRobotAnimation';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

type Lang = 'id' | 'en' | 'ar';

const translations = {
  id: {
    login: "Masuk Portal",
    heroBadge: "Ekosistem Otonom • HIMASTI UMMAT",
    heroTitle: "Satu Ekosistem. Tanpa Batas.",
    heroDesc: "Platform digital terpadu untuk orkestrasi 18 modul divisi, presensi hardware anti-joki FIDO2, bank modul IT, dan asisten cerdas mahasiswa Sistem & Teknologi Informasi.",
    startBtn: "Mulai Akses Portal",
    presensiBtn: "Presensi Biometrik",
    aiPrompt: "Tanyakan sesuatu tentang kurikulum, divisi, atau kampus...",
    demoLimit: "Batas percakapan demo (5/5) tercapai. Silakan login untuk akses tanpa batas.",
    demoLeft: "Sisa Kuota Demo",
    histTitle: "Jejak Langkah Organisasi",
    histDesc: "HIMASTI didirikan pada 21 April 2022 oleh 8 orang mahasiswa perintis melalui Mubes Pertama di Universitas Muhammadiyah Mataram. Kami lahir dari tekad mandiri untuk memimpin transformasi teknologi digital kampus.",
    divTitle: "Modul Divisi & Kepanitiaan",
    divDesc: "Infrastruktur utama yang menggerakkan seluruh program kerja, riset, dan kaderisasi himpunan.",
    divs: [
      { name: 'Kemuhammadiyahan', desc: 'Menanamkan nilai-nilai Islam dan moral peradaban di lingkungan mahasiswa teknologi.' },
      { name: 'Kaderisasi & SDM', desc: 'Membentuk kepemimpinan tangguh, soliditas kader, dan regenerasi kepengurusan himpunan.' },
      { name: 'Litbang & Riset', desc: 'Fokus pada kajian akademik, riset teknologi masa depan, dan kurikulum open-source.' },
      { name: 'Media & Komunikasi', desc: 'Mengelola desain visual, siaran digital, dokumentasi multimedia, dan branding himpunan.' },
      { name: 'Hubungan Masyarakat', desc: 'Menjalin kolaborasi strategis dengan rektorat, industri teknologi, dan ormawa luar kampus.' },
      { name: 'Kewirausahaan & Danus', desc: 'Membangun kemandirian finansial ekosistem melalui unit bisnis dan official merchandise.' },
      { name: 'Minat & Bakat', desc: 'Mewadahi kompetisi dan potensi mahasiswa di bidang e-sports, riset kreatif, dan inovasi.' },
      { name: 'Aksi & Advokasi', desc: 'Menampung aspirasi mahasiswa dan mengawal kebijakan strategis kampus secara konstruktif.' }
    ]
  },
  en: {
    login: "Sign In",
    heroBadge: "Autonomous Ecosystem • HIMASTI UMMAT",
    heroTitle: "One Ecosystem. Zero Limits.",
    heroDesc: "A unified digital platform for 18 division modules, hardware-grade FIDO2 attendance, IT module bank, and intelligent AI assistant for Information Systems & Technology students.",
    startBtn: "Launch Ecosystem",
    presensiBtn: "Biometric Attendance",
    aiPrompt: "Ask anything about curriculum, divisions, or campus...",
    demoLimit: "Demo conversation limit (5/5) reached. Please sign in for full access.",
    demoLeft: "Demo Queries Remaining",
    histTitle: "Organizational Heritage",
    histDesc: "HIMASTI was founded on April 21, 2022, by 8 pioneering students through the First Grand Assembly at Universitas Muhammadiyah Mataram. Dedicated to digital transformation.",
    divTitle: "Division Modules",
    divDesc: "Core infrastructure driving work programs, research, and cadre development.",
    divs: [
      { name: 'Muhammadiyah Values', desc: 'Instilling ethical foundations and Islamic principles in the tech community.' },
      { name: 'Cadre & Leadership', desc: 'Shaping future tech leaders, organizational solidarity, and management regeneration.' },
      { name: 'R&D Innovation', desc: 'Focusing on cutting-edge research, tech benchmarking, and open-source curriculums.' },
      { name: 'Media & Communication', desc: 'Managing multimedia design, digital broadcasting, and cyber presence.' },
      { name: 'Public Relations', desc: 'Orchestrating strategic external partnerships with tech industries and institutions.' },
      { name: 'Entrepreneurship', desc: 'Building financial autonomy through digital business units and merchandise.' },
      { name: 'Talent & Esports', desc: 'Channeling student competitive potential in esports, creative media, and arts.' },
      { name: 'Advocacy & Action', desc: 'Voicing student aspirations and constructive strategic policy development.' }
    ]
  },
  ar: {
    login: "تسجيل الدخول",
    heroBadge: "المنظومة الرقمية المستقلة • هيمساتي",
    heroTitle: "نظام بيئي واحد. بلا حدود.",
    heroDesc: "منصة رقمية موحدة لإدارة 18 وحدة تنظيمية، وحضور بيومتري آمن ضد التزوير، وبنك المعرفة التقنية، ومساعد ذكاء اصطناعي تفاعلي متقدم.",
    startBtn: "دخول النظام",
    presensiBtn: "تسجيل الحضور البيومتري",
    aiPrompt: "اسأل عن المناهج أو الأنشطة أو المنظمة...",
    demoLimit: "تم الوصول إلى الحد الأقصى للمحادثات (٥/٥). يرجى تسجيل الدخول للوصول الكامل.",
    demoLeft: "المحادثات المتبقية",
    histTitle: "أصولنا التاريخية",
    histDesc: "تأسست هيمساتي في ٢١ أبريل ٢٠٢٢ على يد ٨ طلاب رواد خلال الجمعية الكبرى الأولى في جامعة محمدية ماتارام لقيادة التحول التقني.",
    divTitle: "الوحدات التنظيمية",
    divDesc: "البنية التحتية الأساسية التي تقود برامج العمل وإعداد الكوادر.",
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
    { role: 'bot', text: lang === 'en' ? 'Hello! I am the HIMASTI AI Assistant. How can I assist you with programs or academics today?' : lang === 'ar' ? 'مرحباً! أنا مساعد هيمساتي الذكي. كيف يمكنني مساعدتك اليوم؟' : 'Halo! Saya Asisten Cerdas HIMASTI. Ada yang bisa saya bantu seputar organisasi, kurikulum, atau kegiatan?' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(prev => {
      const newArr = [...prev];
      if (newArr.length > 0 && newArr[0].role === 'bot' && prev.length === 1) {
        newArr[0] = { ...newArr[0], text: lang === 'en' ? 'Hello! I am the HIMASTI AI Assistant. How can I assist you with programs or academics today?' : lang === 'ar' ? 'مرحباً! أنا مساعد هيمساتي الذكي. كيف يمكنني مساعدتك اليوم؟' : 'Halo! Saya Asisten Cerdas HIMASTI. Ada yang bisa saya bantu seputar organisasi, kurikulum, atau kegiatan?' };
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
    <div className={`w-full min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 relative overflow-x-hidden ${isRTL ? 'dir-rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* CSS-Only Lightweight Animations */}
      <style>{`
        @keyframes gentleBreathe {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes shimmerGlow {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-gentle-float {
          animation: gentleBreathe 6s ease-in-out infinite;
          will-change: transform;
        }
        .animate-shimmer-badge {
          background: linear-gradient(90deg, rgba(239, 246, 255, 1) 0%, rgba(219, 234, 254, 0.8) 50%, rgba(239, 246, 255, 1) 100%);
          background-size: 200% 100%;
          animation: shimmerGlow 4s linear infinite;
        }
      `}</style>

      {/* Subtle Dot Matrix Canvas */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] -z-10" />

      {/* Floating Crisp Glass Navbar */}
      <motion.header 
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[94%] max-w-5xl z-50"
      >
        <nav className="backdrop-blur-xl bg-white/85 border border-slate-200/80 rounded-full px-5 py-3 shadow-[0_4px_25px_rgba(0,0,0,0.06)] flex justify-between items-center transition-all">
          <div className="flex items-center gap-2.5">
            <img src="/images/logo_himasti.jpg" alt="Logo HIMASTI" className="w-8 h-8 object-contain rounded-full border border-slate-200 shadow-sm" />
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
              HIMASTI
            </span>
          </div>

          <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#divisions" className="hover:text-blue-600 transition-colors">Divisi</a>
            <Link href="/absen" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
              <Fingerprint className="w-3.5 h-3.5 text-blue-600" /> Presensi FIDO2
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setLangOpen(!langOpen)} 
                className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full transition text-slate-600 flex items-center gap-1.5 text-xs font-mono active:scale-95"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline uppercase">{lang}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden z-50 text-xs py-1">
                  <button onClick={() => { changeLang('id'); setLangOpen(false); }} className={`block w-full text-left px-3.5 py-2 hover:bg-slate-50 ${lang === 'id' ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}>🇮🇩 Indonesia</button>
                  <button onClick={() => { changeLang('en'); setLangOpen(false); }} className={`block w-full text-left px-3.5 py-2 hover:bg-slate-50 ${lang === 'en' ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}>🇬🇧 English</button>
                  <button onClick={() => { changeLang('ar'); setLangOpen(false); }} className={`block w-full text-left px-3.5 py-2 hover:bg-slate-50 ${lang === 'ar' ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}>🇸🇦 عربي</button>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <Link 
              href="/login" 
              className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm hover:shadow transition transform active:scale-95 whitespace-nowrap"
            >
              {t.login}
            </Link>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <section className="relative w-full min-h-[92dvh] flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-36 pb-16 max-w-5xl mx-auto gap-8">
        
        {/* Soft Ripple Reactor */}
        <BrutalistCore />

        {/* Hero Content */}
        <div className="flex flex-col items-center justify-center z-10 w-full">
          
          {/* Animated Shimmer Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full animate-shimmer-badge border border-blue-200/80 text-blue-700 text-xs font-semibold tracking-wide shadow-sm mb-6 cursor-default"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{t.heroBadge}</span>
          </motion.div>

          {/* Interactive HIMASTI Particle Text */}
          <AiRobotAnimation />

          {/* Clean Headline with Fade-in */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-slate-900 max-w-4xl mt-2 mb-5"
          >
            {t.heroTitle}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mb-8 leading-relaxed mx-auto font-normal"
          >
            {t.heroDesc}
          </motion.p>

          {/* Clean Animated Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-3.5 z-20"
          >
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group active:scale-95"
            >
              <span>{t.startBtn}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
              href="/absen" 
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm sm:text-base font-semibold shadow-sm hover:shadow transition flex items-center justify-center gap-2 active:scale-95"
            >
              <Fingerprint className="w-4 h-4 text-blue-600" />
              <span>{t.presensiBtn}</span>
            </Link>
          </motion.div>
        </div>

        {/* Clean Floating AI Assistant Terminal */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="w-full max-w-2xl relative z-40 mt-4 animate-gentle-float"
        >
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col h-[400px] sm:h-[460px] w-full text-left">
             
             {/* Window Bar */}
             <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className={`${isRTL ? 'mr-3' : 'ml-3'} text-xs font-mono text-slate-600 flex items-center gap-2 font-medium`}>
                    <Terminal className="w-3.5 h-3.5 text-blue-600"/>
                    <span>HIMASTI AI Assistant v2.4</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Siap Membantu</span>
                </div>
             </div>

             {/* Chat Stream */}
             <div className="flex-1 p-5 overflow-y-auto bg-slate-50/50 space-y-4 font-sans text-sm">
                {messages.map((msg, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    key={idx} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-slate-900 text-white rounded-tr-sm shadow-sm' 
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-2.5 text-xs text-slate-500 flex items-center gap-2 shadow-sm">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span>{lang === "en" ? "AI is thinking..." : lang === "ar" ? "الذكاء الاصطناعي يفكر..." : "AI sedang berpikir..."}</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
             </div>

             {/* Prompt Input */}
             <div className="p-3.5 bg-white border-t border-slate-200 shrink-0">
               {chatCount >= 5 ? (
                 <div className="text-center p-2.5 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-xl">
                   {t.demoLimit}
                 </div>
               ) : (
                 <form onSubmit={handleSend} className="flex items-center gap-2 w-full relative z-50">
                   <input
                     type="text"
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     disabled={isLoading}
                     placeholder={t.aiPrompt}
                     className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 h-11 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all disabled:opacity-50"
                     dir={isRTL ? 'rtl' : 'ltr'}
                   />
                   <button 
                     type="submit" 
                     disabled={!input.trim() || isLoading}
                     className="w-11 h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl disabled:opacity-30 transition-colors flex items-center justify-center shrink-0 shadow-sm active:scale-95"
                   >
                     <Send className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                   </button>
                 </form>
               )}
               <div className="text-center mt-2 text-[10px] text-slate-400 font-medium">
                 {t.demoLeft}: {5 - chatCount}/5 • Didukung oleh Llama-3 AI Engine
               </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Clean Bento Metrics Bar with Animated Counters */}
      <section className="relative w-full py-16 px-6 bg-slate-50/80 border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                Ekosistem Digital HIMASTI • Statistik Terkini
              </span>
            </div>
            <div className="text-xs font-semibold text-blue-700 flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Presensi Biometrik & Sinkronisasi Aula
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                <AnimatedCounter end={33} suffix="+" />
              </div>
              <div className="text-xs font-bold text-slate-500 mt-1.5 uppercase tracking-wider">
                Kader Aktif
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Terverifikasi Sistem
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                <AnimatedCounter end={8} />
              </div>
              <div className="text-xs font-bold text-slate-500 mt-1.5 uppercase tracking-wider">
                Divisi Kerja
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Paralel & Otonom
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                <AnimatedCounter end={124} suffix="+" />
              </div>
              <div className="text-xs font-bold text-slate-500 mt-1.5 uppercase tracking-wider">
                Modul IT
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Bank Materi Terbuka
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-600">
                <AnimatedCounter end={99.9} decimals={1} suffix="%" />
              </div>
              <div className="text-xs font-bold text-slate-500 mt-1.5 uppercase tracking-wider">
                Uptime Presensi
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Anti-Joki Hardware
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <CompetitionMarquee competitions={competitions || []} />

      {/* History Section with Entrance Animation */}
      <section className="w-full py-24 px-6 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">Sejarah Singkat</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">{t.histTitle}</h2>
            <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
              {t.histDesc}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 flex-1 w-full">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: 0.1 }}
               whileHover={{ y: -3 }}
               className="bg-slate-50 p-7 rounded-2xl border border-slate-200/80 shadow-sm text-center"
             >
                <Building2 className="w-8 h-8 mx-auto text-slate-900 mb-2" />
                <div className="text-3xl font-extrabold text-slate-900">
                  <AnimatedCounter end={2022} duration={1200} />
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Tahun Berdiri</div>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: 0.2 }}
               whileHover={{ y: -3 }}
               className="bg-slate-50 p-7 rounded-2xl border border-slate-200/80 shadow-sm text-center"
             >
                <Users className="w-8 h-8 mx-auto text-slate-900 mb-2" />
                <div className="text-3xl font-extrabold text-slate-900">
                  <AnimatedCounter end={8} duration={1200} />
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Pionir Mubes</div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Divisions Section with Staggered Entrance */}
      <section id="divisions" className="w-full py-24 px-6 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">Struktur Organisasi</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-slate-900">{t.divTitle}</h2>
            <p className="text-slate-600 text-base max-w-xl mx-auto">{t.divDesc}</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-5xl mx-auto">
            {t.divs.map((d, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="group p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-default"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={divIcons[index]} />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5 flex items-center gap-2">
                      <span>{d.name}</span>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-blue-600" />
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{d.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="w-full py-12 px-6 bg-white text-slate-500 text-xs">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>© 2026 HIMASTI Universitas Muhammadiyah Mataram. Hak cipta dilindungi.</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/login" className="hover:text-slate-900 transition">Masuk</Link>
            <Link href="/absen" className="text-blue-600 hover:underline transition font-semibold">Presensi FIDO2</Link>
            <a href="https://github.com/himastiummat1/Portal-himasti" target="_blank" rel="noreferrer" className="hover:text-slate-900 transition flex items-center gap-1">
              GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
