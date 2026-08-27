const fs = require('fs');

// 1. Update LandingAnimation.tsx to pass 'lang'
let frontend = fs.readFileSync('src/app/LandingAnimation.tsx', 'utf8');
frontend = frontend.replace(
  'body: JSON.stringify({ messages: [...messages, { role: \'user\', text: userMsg }] })',
  'body: JSON.stringify({ lang, messages: [...messages, { role: \'user\', text: userMsg }] })'
);
fs.writeFileSync('src/app/LandingAnimation.tsx', frontend);

// 2. Update route.ts to read 'lang' and append to system prompt
let backend = fs.readFileSync('src/app/api/chat/route.ts', 'utf8');
backend = backend.replace(
  'const { messages } = await req.json();',
  'const { messages, lang } = await req.json();\n    let langInstruction = "";\n    if(lang === "en") langInstruction = "\\nMohon jawab dalam BAHASA INGGRIS (English).";\n    if(lang === "ar") langInstruction = "\\nMohon jawab dalam BAHASA ARAB (Arabic).";'
);
backend = backend.replace(
  'Jawab dengan ramah, informatif, singkat, dan profesional. Jangan mengarang fakta.`',
  'Jawab dengan ramah, informatif, singkat, dan profesional. Jangan mengarang fakta.` + langInstruction'
);
fs.writeFileSync('src/app/api/chat/route.ts', backend);

