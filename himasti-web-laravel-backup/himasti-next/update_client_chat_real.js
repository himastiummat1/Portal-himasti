const fs = require('fs');
let content = fs.readFileSync('src/app/LandingAnimation.tsx', 'utf8');

const replaceFn = `
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    if (chatCount >= 5) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', text: userMsg }] })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
      setChatCount(prev => prev + 1);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Maaf, koneksi ke server AI terputus.' }]);
    } finally {
      setIsLoading(false);
    }
  };
`;

const before = content.split('  const handleSend =')[0];
const after = content.split('  return (')[1];

fs.writeFileSync('src/app/LandingAnimation.tsx', before + replaceFn + '  return (' + after);
