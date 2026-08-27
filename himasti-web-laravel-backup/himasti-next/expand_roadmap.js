const fs = require('fs');
let content = fs.readFileSync('src/app/admin/modul/LearningHubClient.tsx', 'utf8');

const newRoadmaps = `
  const roadmaps = [
    {
      id: "frontend",
      title: "Frontend Engineer",
      icon: <Layout className="w-8 h-8 text-sky-500" />,
      desc: "Bangun antarmuka visual yang interaktif, responsif, dan mutakhir.",
      steps: [
        "1. Fundamental: HTML5, CSS3, & Semantic Web",
        "2. JavaScript ES6+: DOM, Fetch API, Async/Await",
        "3. Git & GitHub: Version Control Dasar",
        "4. Styling Modern: Tailwind CSS & Framer Motion",
        "5. Framework Inti: React.js (Hooks, Context, State)",
        "6. Meta-Framework: Next.js (SSR, SSG, App Router)",
        "7. Tools: TypeScript, Zod, & React Query"
      ]
    },
    {
      id: "backend",
      title: "Backend Engineer",
      icon: <Server className="w-8 h-8 text-emerald-500" />,
      desc: "Rancang arsitektur server, API, dan sistem keamanan yang tangguh.",
      steps: [
        "1. Internet Basic: HTTP/HTTPS, DNS, & Hosting",
        "2. Bahasa Inti: Node.js, Go, atau PHP (Laravel)",
        "3. Relational DB: PostgreSQL, MySQL, Normalisasi",
        "4. API Design: RESTful API, GraphQL, Postman",
        "5. ORM & Query Builder: Prisma, Sequelize",
        "6. Keamanan: JWT Auth, OAuth, CORS, & Hashing",
        "7. Arsitektur Lanjut: Redis Caching, Docker, CI/CD"
      ]
    },
    {
      id: "data",
      title: "Data Science & AI",
      icon: <Cpu className="w-8 h-8 text-purple-500" />,
      desc: "Olah data menjadi wawasan, latih model AI, dan prediksi masa depan.",
      steps: [
        "1. Dasar Pemrograman: Python Dasar & Algoritma",
        "2. Matematika AI: Aljabar Linier & Statistika",
        "3. Data Wrangling: Pandas, Numpy, & SQL Lanjut",
        "4. Visualisasi: Matplotlib, Seaborn, Tableau",
        "5. Machine Learning Basic: Scikit-Learn, Regresi",
        "6. Deep Learning: TensorFlow, PyTorch, Neural Nets",
        "7. Generative AI: LangChain, RAG, & HuggingFace"
      ]
    }
  ];
`;

content = content.replace(/const roadmaps = \[[\s\S]*?\];/m, newRoadmaps.trim());
fs.writeFileSync('src/app/admin/modul/LearningHubClient.tsx', content);
