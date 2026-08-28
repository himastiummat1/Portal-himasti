import { cookies } from "next/headers";

export type Language = 'id' | 'en' | 'ar';

export const dictionaries = {
  id: {
    login: "Login",
    register: "Daftar Akun",
    backToPortal: "Kembali ke Portal",
    welcome: "Selamat Datang",
    loginDesc: "Masuk menggunakan kredensial HIMASTI Anda.",
    email: "Email Akun",
    password: "Kata Sandi",
    forgotPass: "Lupa sandi?",
    enterPanel: "Masuk ke Panel",
    orLoginWith: "Atau masuk dengan",
    noAccount: "Belum memiliki akun kader?",
    registerNow: "Daftar Sekarang",
    menu: {
      overview: "Overview",
      org: "Profil & Organisasi",
      adart: "AD/ART & Konstitusi",
      main: "Manajemen Utama",
      kader: "Data Kader",
      finance: "Keuangan",
      letter: "Surat",
      meeting: "Rapat & Notulensi",
      academic: "Akademik & Publikasi",
      article: "Artikel Web",
      module: "Bank Modul",
      devtools: "DevTools",
      portfolio: "Katalog Karya",
      competition: "Info Lomba",
      division: "Kepanitiaan & Divisi",
      survey: "Survey & Riset",
      club: "Klub IT",
      merch: "Merchandise / Danus",
      profile: "Profil Saya",
      logout: "Logout"
    }
  },
  en: {
    login: "Login",
    register: "Register Account",
    backToPortal: "Back to Portal",
    welcome: "Welcome Back",
    loginDesc: "Sign in using your HIMASTI credentials.",
    email: "Account Email",
    password: "Password",
    forgotPass: "Forgot password?",
    enterPanel: "Enter Panel",
    orLoginWith: "Or login with",
    noAccount: "Don't have a cadre account yet?",
    registerNow: "Register Now",
    menu: {
      overview: "Overview",
      org: "Profile & Organization",
      adart: "Constitution (AD/ART)",
      main: "Main Management",
      kader: "Cadre Data",
      finance: "Finance",
      letter: "Letters",
      meeting: "Meetings & Minutes",
      academic: "Academic & Publications",
      article: "Web Articles",
      module: "Module Bank",
      devtools: "DevTools",
      portfolio: "Portfolio Catalog",
      competition: "Competition Info",
      division: "Committees & Divisions",
      survey: "Surveys & Research",
      club: "IT Clubs",
      merch: "Merchandise",
      profile: "My Profile",
      logout: "Logout"
    }
  },
  ar: {
    login: "تسجيل الدخول",
    register: "تسجيل حساب",
    backToPortal: "العودة إلى البوابة",
    welcome: "مرحباً بك",
    loginDesc: "تسجيل الدخول باستخدام بيانات اعتماد هيمساتي.",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    forgotPass: "نسيت كلمة المرور؟",
    enterPanel: "الدخول للوحة",
    orLoginWith: "أو الدخول باستخدام",
    noAccount: "ليس لديك حساب كادر بعد؟",
    registerNow: "سجل الآن",
    menu: {
      overview: "نظرة عامة",
      org: "الملف الشخصي والمنظمة",
      adart: "الدستور",
      main: "الإدارة الرئيسية",
      kader: "بيانات الكوادر",
      finance: "المالية",
      letter: "الرسائل",
      meeting: "الاجتماعات والمحاضر",
      academic: "الأكاديمية والمنشورات",
      article: "مقالات الويب",
      module: "بنك الوحدات",
      devtools: "أدوات التطوير",
      portfolio: "كتالوج الأعمال",
      competition: "معلومات المسابقات",
      division: "اللجان والأقسام",
      survey: "الاستطلاعات والبحوث",
      club: "نوادي تكنولوجيا المعلومات",
      merch: "البضائع",
      profile: "ملفي الشخصي",
      logout: "تسجيل الخروج"
    }
  }
};

export async function getLang(): Promise<Language> {
  const cookieStore = await cookies();
  const lang = cookieStore.get('himasti_lang')?.value as Language;
  return ['id', 'en', 'ar'].includes(lang) ? lang : 'id';
}

export async function getDict() {
  const lang = await getLang();
  return dictionaries[lang];
}
