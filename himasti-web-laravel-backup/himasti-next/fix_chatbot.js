const fs = require('fs');
let content = fs.readFileSync('src/components/chat/FloatingChatbot.tsx', 'utf8');

// Move the early return to the bottom of the hooks!
content = content.replace(
  '  const pathname = usePathname();\n  if (pathname === "/") return null;',
  '  const pathname = usePathname();'
);

content = content.replace(
  '  return (\n    <div className="fixed bottom-6 right-6 z-50">',
  '  if (pathname === "/") return null;\n\n  return (\n    <div className="fixed bottom-6 right-6 z-50">'
);

fs.writeFileSync('src/components/chat/FloatingChatbot.tsx', content);
