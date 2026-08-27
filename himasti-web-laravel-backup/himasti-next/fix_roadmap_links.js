const fs = require('fs');
let content = fs.readFileSync('src/app/admin/modul/LearningHubClient.tsx', 'utf8');

// First, I need to add a `link` property to each roadmap object.
content = content.replace(
  'id: "frontend",',
  'id: "frontend",\n      link: "https://roadmap.sh/frontend",'
);
content = content.replace(
  'id: "backend",',
  'id: "backend",\n      link: "https://roadmap.sh/backend",'
);
content = content.replace(
  'id: "data",',
  'id: "data",\n      link: "https://roadmap.sh/ai-data-scientist",'
);
content = content.replace(
  'id: "systems",',
  'id: "systems",\n      link: "https://roadmap.sh/computer-science",'
);

// Then, replace the button element with an anchor tag using the `link` property.
content = content.replace(
  /<button className="mt-8 w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm flex justify-center items-center gap-2">\s*Mulai Jalur Ini <ChevronRight className="w-4 h-4" \/>\s*<\/button>/g,
  '<a href={road.link} target="_blank" className="mt-8 w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm flex justify-center items-center gap-2">\n                  Mulai Jalur Ini <ChevronRight className="w-4 h-4" />\n                </a>'
);

fs.writeFileSync('src/app/admin/modul/LearningHubClient.tsx', content);
