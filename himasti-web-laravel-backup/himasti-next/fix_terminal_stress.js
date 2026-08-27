const fs = require('fs');
let content = fs.readFileSync('src/app/admin/TerminalEasterEgg.tsx', 'utf8');

// 1. Add `cwd` state
content = content.replace(
  'const [input, setInput] = useState("");',
  'const [input, setInput] = useState("");\n  const [cwd, setCwd] = useState("~");'
);

// 2. Update the prompt to use `cwd`
content = content.replace(
  /text: \`\[\$\{userName\}@himasti ~\]\$ \$\{cmd\}\`/g,
  'text: `[${userName}@himasti ${cwd}]$ ${cmd}`'
);
content = content.replace(
  '<span className="text-slate-300">[{userName}@himasti ~]$</span>',
  '<span className="text-slate-300">[{userName}@himasti {cwd}]$</span>'
);

// 3. Completely overhaul the command switch block
const oldLogicStart = 'const lowerCmd = cmd.toLowerCase();';
const oldLogicEnd = '    setHistory([...newHistory, { type: "output", text: output }]);';
const oldLogicRegex = new RegExp(oldLogicStart.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&') + '[\\\\s\\\\S]*?' + oldLogicEnd.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&'));

const newLogic = `const lowerCmd = cmd.toLowerCase();
    const args = cmd.split(' ').slice(1);
    
    if (lowerCmd.startsWith("sudo rm -rf")) {
      output = "Akses ditolak! Anda bukan super admin soo jadi ndak bisa yahh wkwkwk";
    } else if (lowerCmd.startsWith("cd")) {
      const target = args[0] || "~";
      if (target === ".." && cwd !== "~" && cwd !== "/") {
        setCwd("~");
        output = "";
      } else {
        setCwd(target === "/" ? "/" : (target.startsWith("~") ? target : cwd === "/" ? "/" + target : cwd + "/" + target));
        output = "";
      }
    } else if (lowerCmd.startsWith("mkdir")) {
      output = args[0] ? \`mkdir: created directory '\${args[0]}'\` : "mkdir: missing operand";
    } else if (lowerCmd.startsWith("touch")) {
      output = args[0] ? \`touch: created file '\${args[0]}'\` : "touch: missing file operand";
    } else if (lowerCmd.startsWith("echo")) {
      output = args.join(" ");
    } else if (lowerCmd.startsWith("ping")) {
      output = \`PING \${args[0] || "8.8.8.8"} (\${args[0] || "8.8.8.8"}) 56(84) bytes of data.\\n64 bytes from \${args[0] || "8.8.8.8"}: icmp_seq=1 ttl=117 time=14.2 ms\\n64 bytes from \${args[0] || "8.8.8.8"}: icmp_seq=2 ttl=117 time=13.8 ms\`;
    } else if (lowerCmd === "pwd") {
      output = cwd === "~" ? \`/home/\${userName.toLowerCase().replace(/\\s/g, "")}\` : \`/home/\${userName.toLowerCase().replace(/\\s/g, "")}/\${cwd.replace("~/", "")}\`;
    } else if (lowerCmd === "date") {
      output = new Date().toString();
    } else if (lowerCmd === "neofetch") {
      output = \`
       \\\\\\\\\\\\\\\\\\\\\\\\        \${userName}@himasti-server
      \\\\\\\\      \\\\\\\\       ---------------------
     \\\\\\\\  HIMASTI \\\\\\\\      OS: HIMASTI OS v2.0
    \\\\\\\\   PORTAL   \\\\\\\\     Host: Vidyax Swarm Engine
   \\\\\\\\              \\\\\\\\    Kernel: 5.15.0-generic
  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\     Uptime: 9999 days, 23 hours
                           Shell: bash 5.1.16
                           CPU: Intel i9-14900K (Bercanda)\`;
    } else {
      switch (lowerCmd) {
        case "help":
          output = "Perintah tersedia: whoami, ls, cd, pwd, mkdir, touch, echo, ping, date, neofetch, clear, vidyax, sudo rm -rf";
          break;
        case "whoami":
          output = \`\${userName} - Pengguna sah Portal HIMASTI\`;
          break;
        case "ls":
          if (cwd === "~" || cwd === "/") {
            output = "karya/  modul/  dev-tools/  surat-menyurat/  rahasia_negara/";
          } else if (cwd.includes("rahasia_negara")) {
            output = "skandal_organisasi.pdf  dana_himpunan.xlsx  password_superadmin.txt";
          } else {
            output = "Tidak ada file di direktori ini.";
          }
          break;
        case "clear":
          setHistory([]);
          setInput("");
          return;
        case "vidyax":
          output = "Vidyax Compiler Engine v1.0.0-rc... Ready for Swarm Orchestration.";
          break;
        case "exit":
          setIsOpen(false);
          setInput("");
          return;
        default:
          output = \`bash: \${cmd.split(' ')[0]}: command not found\`;
      }
    }

    setHistory([...newHistory, { type: "output", text: output }]);`;

content = content.replace(oldLogicRegex, newLogic);

fs.writeFileSync('src/app/admin/TerminalEasterEgg.tsx', content);
