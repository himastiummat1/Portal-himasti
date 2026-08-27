const fs = require('fs');
let content = fs.readFileSync('src/app/LandingAnimation.tsx', 'utf8');

// Fix 1: The terminal initial message not changing
// Instead of using useState for the first message, let's keep it in the render if it's the only message,
// but it's easier to just use a useEffect to update the first message when lang changes!

const useEffectStr = `
  useEffect(() => {
    setMessages(prev => {
      const newArr = [...prev];
      if (newArr.length > 0 && newArr[0].role === 'bot' && prev.length === 1) {
        newArr[0].text = lang === 'en' ? 'Hello! I am the HIMASTI AI. How can I help you today?' : lang === 'ar' ? 'مرحباً! أنا ذكاء هيمساتي الاصطناعي. كيف يمكنني مساعدتك؟' : 'Halo! Saya AI Asisten HIMASTI. Ada yang bisa saya bantu tentang organisasi atau kampus?';
      }
      return newArr;
    });
  }, [lang]);
`;

content = content.replace('const chatEndRef = useRef<HTMLDivElement>(null);', 'const chatEndRef = useRef<HTMLDivElement>(null);\n' + useEffectStr);

// Fix 2: Overlapping inputs and layouts in RTL
// Let's replace absolute left-2 / right-2 with absolute end-2
content = content.replace(/\`absolute \\\$\{isRTL \? 'left-2' : 'right-2'\} (.*?)\`/g, '"absolute ltr:right-2 rtl:left-2 $1"');
content = content.replace(/\`w-full bg-gray-50 (.*?) \\\$\{isRTL \? 'pr-4 pl-12' : 'pl-4 pr-12'\}\`/g, '"w-full bg-gray-50 $1 rtl:pr-4 rtl:pl-12 ltr:pl-4 ltr:pr-12"');

// Fix 3: Global dir="rtl" on the root sometimes messes up flex containers if not handled. 
// Instead of complex logic, I'll just use 'rtl:flex-row-reverse' where needed.
// Actually, setting dir="rtl" on the wrapper is correct, but the navbar and other absolute things might break.
// Let's ensure the Hero section has gap.

fs.writeFileSync('src/app/LandingAnimation.tsx', content);
