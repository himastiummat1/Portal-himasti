const fs = require('fs');
let content = fs.readFileSync('src/components/chat/FloatingChatbot.tsx', 'utf8');

const anchor = `    setIsTyping(true);\n\n    try {`;
const easterEgg = `    setIsTyping(true);

    const lower = userText.toLowerCase();
    if (lower.includes("daffa") || lower.includes("vidyax") || lower.includes("kabid")) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: "bot",
          text: "M N DAFFA (Sang Architect) adalah pembuat bahasa Vidyax dan Dewa Kode dari HIMASTI! Beliau menciptakan Vidyax dengan arsitektur Swarm AI yang jauh lebih canggih melampaui zamannya. Semua kader wajib sungkem! 👑✨"
        }]);
        setIsTyping(false);
      }, 1500);
      return;
    }

    try {`;

content = content.replace(anchor, easterEgg);
fs.writeFileSync('src/components/chat/FloatingChatbot.tsx', content);
