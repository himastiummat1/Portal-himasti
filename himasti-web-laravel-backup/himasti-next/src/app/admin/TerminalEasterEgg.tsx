"use client";

import { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, X } from "lucide-react";

export default function TerminalEasterEgg({ userName }: { userName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<{ type: "input" | "output"; text: string }[]>([
    { type: "output", text: "HIMASTI OS v2.0 (tty1)" },
    { type: "output", text: "Ketik 'help' untuk melihat daftar perintah." }
  ]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("~");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [history, isOpen]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    const newHistory = [...history, { type: "input", text: `[${userName}@himasti ${cwd}]$ ${cmd}` } as const];

    let output = "";
    const lowerCmd = cmd.toLowerCase();
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
      output = args[0] ? `mkdir: created directory '${args[0]}'` : "mkdir: missing operand";
    } else if (lowerCmd.startsWith("touch")) {
      output = args[0] ? `touch: created file '${args[0]}'` : "touch: missing file operand";
    } else if (lowerCmd.startsWith("echo")) {
      output = args.join(" ");
    } else if (lowerCmd.startsWith("ping")) {
      output = `PING ${args[0] || "8.8.8.8"} (${args[0] || "8.8.8.8"}) 56(84) bytes of data.\n64 bytes from ${args[0] || "8.8.8.8"}: icmp_seq=1 ttl=117 time=14.2 ms\n64 bytes from ${args[0] || "8.8.8.8"}: icmp_seq=2 ttl=117 time=13.8 ms`;
    } else if (lowerCmd === "pwd") {
      output = cwd === "~" ? `/home/${userName.toLowerCase().replace(/\s/g, "")}` : `/home/${userName.toLowerCase().replace(/\s/g, "")}/${cwd.replace("~/", "")}`;
    } else if (lowerCmd === "date") {
      output = new Date().toString();
    } else if (lowerCmd === "neofetch") {
      output = `
       \\\\\\\\\\\\        ${userName}@himasti-server
      \\\\      \\\\       ---------------------
     \\\\  HIMASTI \\\\      OS: HIMASTI OS v2.0
    \\\\   PORTAL   \\\\     Host: Vidyax Swarm Engine
   \\\\              \\\\    Kernel: 5.15.0-generic
  \\\\\\\\\\\\\\\\\\\\\\\\     Uptime: 9999 days, 23 hours
                           Shell: bash 5.1.16
                           CPU: Intel i9-14900K (Bercanda)`;
    } else {
      switch (lowerCmd) {
        case "help":
          output = "Perintah tersedia: whoami, ls, cd, pwd, mkdir, touch, echo, ping, date, neofetch, clear, vidyax, sudo rm -rf";
          break;
        case "whoami":
          output = `${userName} - Pengguna sah Portal HIMASTI`;
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
          output = `bash: ${cmd.split(' ')[0]}: command not found`;
      }
    }

    setHistory([...newHistory, { type: "output", text: output }]);
    setInput("");
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 p-4 bg-slate-900 text-green-400 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:scale-110 transition-transform z-50 group border border-slate-700"
      >
        <TerminalIcon className="w-6 h-6 group-hover:animate-pulse" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-sm z-[100] p-4 md:p-12 flex flex-col font-mono text-sm">
      <div className="max-w-4xl w-full mx-auto bg-black border border-slate-800 rounded-xl shadow-2xl h-full flex flex-col overflow-hidden">
        
        {/* Terminal Header */}
        <div className="bg-slate-900 px-4 py-2 flex justify-between items-center border-b border-slate-800 cursor-default">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-slate-400 text-xs">root@himasti-server:~</span>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 p-4 overflow-y-auto text-green-500 space-y-1">
          {history.map((line, i) => (
            <div key={i} className={line.type === "input" ? "text-slate-300" : "text-green-400 whitespace-pre-wrap font-mono"}>
              {line.text}
            </div>
          ))}
          <form onSubmit={handleCommand} className="flex gap-2 mt-2">
            <span className="text-slate-300">[{userName}@himasti {cwd}]$</span>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none border-none text-white caret-green-500"
              autoFocus
              autoComplete="off"
            />
          </form>
          <div ref={endRef} />
        </div>
      </div>
    </div>
  );
}
