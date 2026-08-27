const fs = require('fs');
let content = fs.readFileSync('src/app/admin/TerminalEasterEgg.tsx', 'utf8');

// Replace the switch statement logic to catch more robust patterns before the switch
const oldLogic = `    switch (cmd.toLowerCase()) {
      case "help":
        output = "Perintah tersedia: whoami, ls, clear, vidyax, sudo rm -rf /";
        break;
      case "whoami":
        output = \`\${userName} - Pengguna sah Portal HIMASTI\`;
        break;
      case "ls":
        output = "karya/  modul/  dev-tools/  surat-menyurat/  rahasia_negara/";
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      case "vidyax":
        output = "Vidyax Compiler Engine v1.0.0-rc... Ready for Swarm Orchestration.";
        break;
      case "sudo rm -rf /":
      case "sudo rm -rf":
        output = "Akses ditolak! Anda bukan super admin soo jadi ndak bisa yahh wkwkwk";
        break;
      case "exit":
        setIsOpen(false);
        setInput("");
        return;
      default:
        output = \`bash: \${cmd}: command not found\`;
    }`;

const newLogic = `    const lowerCmd = cmd.toLowerCase();
    
    if (lowerCmd.startsWith("sudo rm -rf")) {
      output = "Akses ditolak! Anda bukan super admin soo jadi ndak bisa yahh wkwkwk";
    } else {
      switch (lowerCmd) {
        case "help":
          output = "Perintah tersedia: whoami, ls, clear, vidyax, sudo rm -rf /";
          break;
        case "whoami":
          output = \`\${userName} - Pengguna sah Portal HIMASTI\`;
          break;
        case "ls":
          output = "karya/  modul/  dev-tools/  surat-menyurat/  rahasia_negara/";
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
          output = \`bash: \${cmd}: command not found\`;
      }
    }`;

content = content.replace(oldLogic, newLogic);

fs.writeFileSync('src/app/admin/TerminalEasterEgg.tsx', content);
