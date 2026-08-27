const fs = require('fs');
let content = fs.readFileSync('src/app/LandingAnimation.tsx', 'utf8');

const replaceFn = `
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Halo! Saya AI Asisten HIMASTI. Ada yang bisa saya bantu tentang organisasi atau kampus?' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatCount, setChatCount] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load chat count from localStorage on mount
  useEffect(() => {
    const savedCount = localStorage.getItem('himasti_chat_count');
    if (savedCount) {
      setChatCount(parseInt(savedCount, 10));
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      
      const newCount = chatCount + 1;
      setChatCount(newCount);
      localStorage.setItem('himasti_chat_count', newCount.toString());
      
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Maaf, koneksi ke server AI terputus.' }]);
    } finally {
      setIsLoading(false);
    }
  };
`;

const before = content.split('  const [messages, setMessages] = useState')[0];
const after = content.split('  return (')[1];

fs.writeFileSync('src/app/LandingAnimation.tsx', before + replaceFn + '  return (' + after);
