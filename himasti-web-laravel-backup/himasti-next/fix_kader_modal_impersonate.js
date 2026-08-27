const fs = require('fs');
let content = fs.readFileSync('src/app/admin/kader/KaderTableClient.tsx', 'utf8');

const searchImports = 'import { updateKader, deleteKader } from "./actions";';
const replaceImports = 'import { updateKader, deleteKader, impersonateUser } from "./actions";\nimport { LogIn } from "lucide-react";';
content = content.replace(searchImports, replaceImports);

const searchFunc = 'const handleDelete = async (userId: number) => {';
const replaceFunc = `const handleImpersonate = async (userId: number) => {
    if (!confirm("Login sebagai kader ini? (Anda akan mendapatkan akses sesuai jabatan mereka untuk sementara waktu)")) return;
    startTransition(async () => {
      const res = await impersonateUser(userId);
      if (res.success) {
        window.location.href = "/admin"; // Redirect to dashboard to reload session
      } else {
        alert(res.error);
      }
    });
  };

  const handleDelete = async (userId: number) => {`;
content = content.replace(searchFunc, replaceFunc);

const searchUI = '<button onClick={() => setIsEditing(!isEditing)}';
const replaceUI = `<button onClick={() => handleImpersonate(selectedKader.user_id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Login Sebagai Akun Ini">
                  <LogIn className="w-5 h-5" />
                </button>
                <button onClick={() => setIsEditing(!isEditing)}`;
content = content.replace(searchUI, replaceUI);

fs.writeFileSync('src/app/admin/kader/KaderTableClient.tsx', content);
