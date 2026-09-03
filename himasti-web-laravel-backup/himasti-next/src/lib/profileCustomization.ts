export interface CosmeticItem {
  id: string;
  name: string;
  category: "frame" | "title" | "theme" | "nameEffect";
  minXp: number;
  description: string;
  previewClass?: string;
  badge?: string;
}

export interface UserCustomization {
  frameId: string;
  titleId: string;
  themeId: string;
  nameEffectId: string;
}

export const DEFAULT_CUSTOMIZATION: UserCustomization = {
  frameId: "none",
  titleId: "kader",
  themeId: "default",
  nameEffectId: "plain"
};

export const FRAMES: CosmeticItem[] = [
  {
    id: "none",
    name: "Klasik Polos",
    category: "frame",
    minXp: 0,
    description: "Bingkai avatar standar minimalis.",
    previewClass: "border-2 border-slate-200"
  },
  {
    id: "cyber_neon",
    name: "Cyberpunk Laser",
    category: "frame",
    minXp: 50,
    description: "Cincin laser neon berputar dengan aksen Cyan dan Rose.",
    badge: "50 XP"
  },
  {
    id: "matrix_emerald",
    name: "Matrix Hacker",
    category: "frame",
    minXp: 100,
    description: "Aura hijau terminal hacker dengan denyut konstan.",
    badge: "100 XP"
  },
  {
    id: "royal_gold",
    name: "HIMASTI Royal Gold",
    category: "frame",
    minXp: 150,
    description: "Aura emas berkilau lengkap dengan ikon mahkota kebesaran.",
    badge: "150 XP"
  },
  {
    id: "cosmic_nebula",
    name: "Cosmic Nebula",
    category: "frame",
    minXp: 200,
    description: "Partikel kosmik ungu luar angkasa dengan pendaran bintang.",
    badge: "200 XP"
  },
  {
    id: "flame_phoenix",
    name: "Api Phoenix",
    category: "frame",
    minXp: 250,
    description: "Lidah api membara melambangkan semangat juang kader.",
    badge: "250 XP"
  }
];

export const TITLES: CosmeticItem[] = [
  {
    id: "kader",
    name: "Kader Aktif HIMASTI",
    category: "title",
    minXp: 0,
    description: "Gelar kehormatan standar anggota himpunan."
  },
  {
    id: "frontend",
    name: "Ninja Antarmuka Web",
    category: "title",
    minXp: 50,
    description: "Ahli tata letak UI, animasi CSS, dan interaksi pengguna.",
    badge: "50 XP"
  },
  {
    id: "backend",
    name: "Arsitek Basis Data",
    category: "title",
    minXp: 100,
    description: "Pakar perancangan query SQL dan struktur basis data.",
    badge: "100 XP"
  },
  {
    id: "agentic",
    name: "Agentic AI Pioneer",
    category: "title",
    minXp: 150,
    description: "Pelopor otomatisasi AI Agent dan integrasi MCP.",
    badge: "150 XP"
  },
  {
    id: "grandmaster",
    name: "Dewa Algoritma UMMAT",
    category: "title",
    minXp: 250,
    description: "Peringkat tertinggi penyelesai masalah komputasi sulit.",
    badge: "250 XP"
  }
];

export const THEMES: CosmeticItem[] = [
  {
    id: "default",
    name: "Clean Minimalist",
    category: "theme",
    minXp: 0,
    description: "Tampilan putih bersih dan elegan berstandar korporat."
  },
  {
    id: "dark_obsidian",
    name: "Dark Obsidian",
    category: "theme",
    minXp: 50,
    description: "Palet gelap pekat modern dengan aksen abu-abu slate.",
    badge: "50 XP"
  },
  {
    id: "cyber_city",
    name: "Cyberpunk Night City",
    category: "theme",
    minXp: 100,
    description: "Gradien malam futuristik bernuansa biru dongker dan neon.",
    badge: "100 XP"
  },
  {
    id: "emerald_matrix",
    name: "Terminal Matrix",
    category: "theme",
    minXp: 150,
    description: "Nuansa hijau fosfor khas sistem komputer retro hacker.",
    badge: "150 XP"
  },
  {
    id: "cosmic_violet",
    name: "Cosmic Deep Space",
    category: "theme",
    minXp: 200,
    description: "Gradasi ungu gelap dan nebula kosmik bercahaya lembut.",
    badge: "200 XP"
  }
];

export const NAME_EFFECTS: CosmeticItem[] = [
  {
    id: "plain",
    name: "Standar Teks",
    category: "nameEffect",
    minXp: 0,
    description: "Tipografi teks standar tanpa animasi warna."
  },
  {
    id: "holo_grad",
    name: "Holographic Gradient",
    category: "nameEffect",
    minXp: 100,
    description: "Gradasi warna berkilau bergerak horizontal.",
    badge: "100 XP"
  },
  {
    id: "gold_shimmer",
    name: "Golden Royale",
    category: "nameEffect",
    minXp: 150,
    description: "Warna emas murni berkilau hangat.",
    badge: "150 XP"
  },
  {
    id: "neon_blue",
    name: "Neon Blue Glow",
    category: "nameEffect",
    minXp: 200,
    description: "Efek teks menyala bernuansa biru elektrik.",
    badge: "200 XP"
  }
];

/**
 * Card theme CSS classes based on themeId
 */
export function getThemeClasses(themeId: string = "default", isSuper: boolean = false): string {
  if (isSuper && themeId === "default") {
    return "bg-slate-950 text-white border-2 border-violet-500/40 shadow-2xl ring-1 ring-violet-500/20";
  }
  switch (themeId) {
    case "dark_obsidian":
      return "bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white border border-slate-700/80 shadow-2xl";
    case "cyber_city":
      return "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30";
    case "emerald_matrix":
      return "bg-gradient-to-b from-slate-950 via-emerald-950/80 to-slate-950 text-emerald-100 border-2 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30 font-mono";
    case "cosmic_violet":
      return "bg-gradient-to-br from-slate-950 via-purple-950/80 to-slate-950 text-purple-100 border-2 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/30";
    default:
      return "bg-white border border-slate-200/80 text-slate-900 shadow-sm";
  }
}

/**
 * Name typography CSS classes based on effectId
 */
export function getNameClasses(effectId: string = "plain", isSuper: boolean = false, themeId: string = "default"): string {
  switch (effectId) {
    case "holo_grad":
      return "bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-300 bg-clip-text text-transparent font-extrabold animate-holo-text";
    case "gold_shimmer":
      return "bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent font-extrabold animate-gold-sheen";
    case "neon_blue":
      return "text-cyan-300 font-extrabold animate-neon-pulse-text";
    default:
      return (isSuper || themeId !== "default") ? "text-white font-extrabold" : "text-slate-900 font-bold";
  }
}

