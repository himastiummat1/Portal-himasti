const fs = require('fs');
let content = fs.readFileSync('src/app/admin/modul/LearningHubClient.tsx', 'utf8');

// The roadmaps array is defined between:
// const roadmaps = [
// ...
// ];

const newTrack = `    {
      id: "systems",
      title: "Systems & Compiler Engineer",
      icon: <Terminal className="w-8 h-8 text-rose-500" />,
      desc: "Jalur 'Dewa' (Expert): Bangun bahasa pemrograman, OS, dan infrastruktur tingkat rendah.",
      steps: [
        "1. Low-Level: C, C++, Rust, atau Zig",
        "2. Arsitektur Komputer & OS Internals",
        "3. Teori Kompilator: Lexer, Parser, AST",
        "4. Code Generation: LLVM & GCC Internals",
        "5. Sistem Memori & Garbage Collection",
        "6. High-Performance Computing (HPC)",
        "7. Sistem Terdistribusi Skala Masif"
      ]
    }
  ];`;

// Replace the end of the roadmaps array
content = content.replace(
  /    \}\n  \];/g,
  `    },\n${newTrack}`
);

// We need to change the grid layout to support 4 items beautifully!
// Old: <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// New: <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
content = content.replace(
  '<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">',
  '<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">'
);

fs.writeFileSync('src/app/admin/modul/LearningHubClient.tsx', content);
