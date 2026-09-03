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
