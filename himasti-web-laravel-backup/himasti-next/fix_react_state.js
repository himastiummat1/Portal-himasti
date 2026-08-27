const fs = require('fs');
let content = fs.readFileSync('src/app/LandingAnimation.tsx', 'utf8');

content = content.replace(
  "newArr[0].text = lang === 'en' ? 'Hello! I am the HIMASTI AI. How can I help you today?' : lang === 'ar' ? 'مرحباً! أنا ذكاء هيمساتي الاصطناعي. كيف يمكنني مساعدتك؟' : 'Halo! Saya AI Asisten HIMASTI. Ada yang bisa saya bantu tentang organisasi atau kampus?';",
  "newArr[0] = { ...newArr[0], text: lang === 'en' ? 'Hello! I am the HIMASTI AI. How can I help you today?' : lang === 'ar' ? 'مرحباً! أنا ذكاء هيمساتي الاصطناعي. كيف يمكنني مساعدتك؟' : 'Halo! Saya AI Asisten HIMASTI. Ada yang bisa saya bantu tentang organisasi atau kampus?' };"
);

// Let's also translate the terminal header!
content = content.replace(
  '<Terminal className="w-3 h-3"/> HIMASTI_AI_CORE_v2.0',
  '<Terminal className="w-3 h-3"/> {lang === "en" ? "HIMASTI_AI_CORE_v2.0" : lang === "ar" ? "نظام_هيمساتي_للذكاء_الاصطناعي" : "HIMASTI_AI_CORE_v2.0"}'
);

content = content.replace(
  '<Loader2 className="w-4 h-4 animate-spin text-blue-500" />',
  '<Loader2 className="w-4 h-4 animate-spin text-blue-500" />\n                      <span className="text-xs text-gray-500">{lang === "en" ? "AI is thinking..." : lang === "ar" ? "الذكاء الاصطناعي يفكر..." : "AI sedang berpikir..."}</span>'
);

fs.writeFileSync('src/app/LandingAnimation.tsx', content);
