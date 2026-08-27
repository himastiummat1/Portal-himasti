"use client";

import { useState, useTransition } from "react";
import { updateProfil, changePassword } from "./actions";
import { User, Lock, Save, AlertCircle, CheckCircle2 } from "lucide-react";

type ProfileData = {
  id: number;
  name: string;
  email: string;
  nim: string;
  angkatan: string;
  no_hp: string;
  jenis_kelamin: string;
  status_kaderisasi: string;
  roles: string;
};

export default function ProfilClient({ initialData }: { initialData: ProfileData }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);
  const [pwdMessage, setPwdMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      setMessage(null);
      const res = await updateProfil(formData);
      if (res.success) {
        setMessage({ type: 'success', text: 'Profil berhasil diperbarui.' });
      } else {
        setMessage({ type: 'error', text: res.error || 'Terjadi kesalahan.' });
      }
    });
  };

  const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const form = e.currentTarget;
    startTransition(async () => {
      setPwdMessage(null);
      const res = await changePassword(formData);
      if (res.success) {
        setPwdMessage({ type: 'success', text: 'Password berhasil diubah.' });
        form.reset();
      } else {
        setPwdMessage({ type: 'error', text: res.error || 'Terjadi kesalahan.' });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <User className="w-6 h-6" />
          Profil Saya
        </h1>
        <p className="text-sm text-gray-500 mt-1">Kelola data pribadi dan keamanan akun Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Read-only Data */}
        <div className="col-span-1 space-y-4">
          <div className="bg-white border border-gray-200 p-6">
            <div className="w-20 h-20 bg-gray-100 border border-gray-200 mx-auto flex items-center justify-center text-2xl font-mono font-bold mb-4">
              {initialData.name.charAt(0)}
            </div>
            <div className="text-center mb-6">
              <h3 className="font-bold text-gray-900">{initialData.name}</h3>
              <p className="text-xs font-mono text-gray-500 mt-1">{initialData.roles}</p>
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">NIM</label>
                <div className="font-mono text-gray-900 bg-gray-50 px-2 py-1 border border-gray-100 mt-1">{initialData.nim}</div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Angkatan</label>
                <div className="font-mono text-gray-900 bg-gray-50 px-2 py-1 border border-gray-100 mt-1">{initialData.angkatan}</div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Status</label>
                <div className="font-mono text-gray-900 bg-gray-50 px-2 py-1 border border-gray-100 mt-1">{initialData.status_kaderisasi}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Forms */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          
          {/* Edit Profile Form */}
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
              <User className="w-4 h-4" /> Informasi Dasar
            </h3>
            
            {message && (
              <div className={`p-3 mb-4 text-sm flex items-start gap-2 border \${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 mt-0.5" /> : <AlertCircle className="w-4 h-4 mt-0.5" />}
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nama Lengkap</label>
                  <input type="text" name="name" defaultValue={initialData.name} required className="w-full text-sm p-2 border border-gray-300 focus:outline-none focus:border-gray-500 bg-gray-50 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                  <input type="email" name="email" defaultValue={initialData.email} required className="w-full text-sm p-2 border border-gray-300 focus:outline-none focus:border-gray-500 bg-gray-50 focus:bg-white transition-colors" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nomor HP</label>
                  <input type="text" name="no_hp" defaultValue={initialData.no_hp} className="w-full text-sm p-2 border border-gray-300 focus:outline-none focus:border-gray-500 bg-gray-50 focus:bg-white transition-colors font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Jenis Kelamin</label>
                  <select name="jenis_kelamin" defaultValue={initialData.jenis_kelamin} className="w-full text-sm p-2 border border-gray-300 focus:outline-none focus:border-gray-500 bg-gray-50 focus:bg-white transition-colors">
                    <option value="">-- Pilih --</option>
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button type="submit" disabled={isPending} className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50 border border-gray-900">
                  <Save className="w-4 h-4" />
                  {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Ganti Password
            </h3>

            {pwdMessage && (
              <div className={`p-3 mb-4 text-sm flex items-start gap-2 border \${pwdMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                {pwdMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 mt-0.5" /> : <AlertCircle className="w-4 h-4 mt-0.5" />}
                {pwdMessage.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password Lama</label>
                <input type="password" name="oldPassword" required className="w-full text-sm p-2 border border-gray-300 focus:outline-none focus:border-gray-500 bg-gray-50 focus:bg-white transition-colors font-mono" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password Baru</label>
                  <input type="password" name="newPassword" required minLength={8} className="w-full text-sm p-2 border border-gray-300 focus:outline-none focus:border-gray-500 bg-gray-50 focus:bg-white transition-colors font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Konfirmasi Password Baru</label>
                  <input type="password" name="confirmPassword" required minLength={8} className="w-full text-sm p-2 border border-gray-300 focus:outline-none focus:border-gray-500 bg-gray-50 focus:bg-white transition-colors font-mono" />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button type="submit" disabled={isPending} className="bg-white hover:bg-gray-50 text-gray-900 px-4 py-2 text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50 border border-gray-300">
                  <Lock className="w-4 h-4" />
                  {isPending ? 'Memproses...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
