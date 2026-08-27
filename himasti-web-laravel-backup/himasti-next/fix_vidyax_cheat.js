const fs = require('fs');
let content = fs.readFileSync('src/app/admin/modul/LearningHubClient.tsx', 'utf8');

const realSnippet = `    {
      title: "Vidyax: Swarm AI Agents",
      lang: "vidyax",
      code: \`use ai\\n\\n@tool(permissions="mutate")\\nfunc swarm_send(channel, message):\\n    shm_write(channel, message)\\n    print "SwarmMessenger [TX -> " + channel + "] Terkirim."\\n\\nagent s1:\\n    model "llama-3.1-8b-instant"\\n    system "Kamu adalah Planner Agent (s1). Tugasmu menganalisis strategi."\\n\\nagent s2:\\n    model "llama-3.1-8b-instant"\\n    system "Kamu adalah Executor Agent (s2). Tugasmu mengeksekusi aksi."\\n\\n# S1 mengirim instruksi ke S2 via shared memory\\nswarm_send("s2_inbox", "Plan Alpha Execute!")\`
    },`;

// Replace the dummy Hello World with this real one!
content = content.replace(
  /    \{\n      title: "Vidyax Lang: Hello World"[\s\S]*?    \},/g,
  realSnippet
);

fs.writeFileSync('src/app/admin/modul/LearningHubClient.tsx', content);
