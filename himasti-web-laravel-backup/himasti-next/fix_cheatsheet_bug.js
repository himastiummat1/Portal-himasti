const fs = require('fs');
let content = fs.readFileSync('src/app/admin/modul/LearningHubClient.tsx', 'utf8');

// The errant object looks like this in the cheatsheets array:
//     },
//     {
//       id: "systems",
//       title: "Systems & Compiler Engineer",
//       icon: <Terminal className="w-8 h-8 text-rose-500" />,
//       desc: "Jalur 'Dewa' (Expert): Bangun bahasa pemrograman, OS, dan infrastruktur tingkat rendah.",
//       steps: [
//         "1. Low-Level: C, C++, Rust, atau Zig",
//         "2. Arsitektur Komputer & OS Internals",
//         "3. Teori Kompilator & AST (Contoh: Vidyax)",
//         "4. Code Generation & Runtime (Studi: Vidyax)",
//         "5. Sistem Memori & Garbage Collection",
//         "6. High-Performance Computing (HPC)",
//         "7. Sistem Terdistribusi Skala Masif"
//       ]
//     }
//   ];

// We only want to remove it from the cheatsheets array. The cheatsheets array ends right before the return statement.
// Let's just find the last occurrence and remove it.

const lastIndex = content.lastIndexOf('id: "systems"');
if (lastIndex > -1) {
  // Find the start of this object, which is '{' before id: "systems"
  const startOfObject = content.lastIndexOf('{', lastIndex);
  
  // Find the end of the array, which is '];' after this object
  const endOfArray = content.indexOf('];', startOfObject);
  
  if (startOfObject > -1 && endOfArray > -1) {
    // Remove from the comma before the object to the end of the object
    const commaBefore = content.lastIndexOf(',', startOfObject);
    if (commaBefore > -1) {
        content = content.substring(0, commaBefore) + '\n  ];' + content.substring(endOfArray + 2);
    }
  }
}

fs.writeFileSync('src/app/admin/modul/LearningHubClient.tsx', content);
