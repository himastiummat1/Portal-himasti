"use client";

import { useState } from "react";
import { Code, Hash, AlignLeft, Lock, FileJson, ArrowRight } from "lucide-react";

export default function DevToolsClient() {
  const [activeTool, setActiveTool] = useState<"json" | "base64" | "hash">("json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleJsonFormat = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const handleBase64 = (mode: "encode" | "decode") => {
    try {
      if (mode === "encode") setOutput(btoa(input));
      else setOutput(atob(input));
      setError("");
    } catch (e: any) {
      setError("Invalid Base64 string");
      setOutput("");
    }
  };

  // Simple Hash mockup (Client-side real SHA-256 requires subtle crypto, we'll use a simple fallback or just simulated for now)
  const handleHash = async () => {
    try {
      const msgBuffer = new TextEncoder().encode(input);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setOutput(hashHex);
      setError("");
    } catch(e) {
      setError("Crypto API not supported in this browser environment.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="border-b border-slate-200/60 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">Developer Tools</h1>
          <p className="text-sm text-slate-500 mt-1">Kumpulan utilitas ringan (JSON, Base64, Crypto) untuk mempercepat alur kerja mahasiswa IT.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Sidebar Tools Menu */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm h-fit">
          <div className="space-y-2">
            {[
              { id: "json", label: "JSON Formatter", icon: <FileJson className="w-4 h-4" /> },
              { id: "base64", label: "Base64 Encode/Decode", icon: <AlignLeft className="w-4 h-4" /> },
              { id: "hash", label: "SHA-256 Generator", icon: <Hash className="w-4 h-4" /> },
            ].map(tool => (
              <button 
                key={tool.id} 
                onClick={() => { setActiveTool(tool.id as any); setInput(""); setOutput(""); setError(""); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTool === tool.id ? "bg-sky-50 text-sky-700 border border-sky-200" : "text-slate-600 hover:bg-slate-50 border border-transparent"}`}
              >
                {tool.icon} {tool.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tool Workspace */}
        <div className="md:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px]">
            
            {/* Input Area */}
            <div className="flex flex-col h-full">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Input</label>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-mono focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 resize-none"
                placeholder={activeTool === "json" ? '{"nama": "HIMASTI"}' : "Ketik teks di sini..."}
              ></textarea>
              
              <div className="flex gap-2 mt-4">
                {activeTool === "json" && (
                  <button onClick={handleJsonFormat} className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-semibold transition-colors flex-1">Format JSON</button>
                )}
                {activeTool === "base64" && (
                  <>
                    <button onClick={() => handleBase64('encode')} className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-semibold transition-colors flex-1">Encode</button>
                    <button onClick={() => handleBase64('decode')} className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-semibold transition-colors flex-1">Decode</button>
                  </>
                )}
                {activeTool === "hash" && (
                  <button onClick={handleHash} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors flex-1">Generate SHA-256</button>
                )}
              </div>
            </div>

            {/* Output Area */}
            <div className="flex flex-col h-full relative">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Output</label>
              <textarea 
                value={output}
                readOnly
                className="flex-1 w-full bg-slate-900 border border-slate-800 text-sky-400 rounded-xl p-4 text-sm font-mono focus:outline-none resize-none"
                placeholder="Hasil akan muncul di sini..."
              ></textarea>
              {error && (
                <div className="absolute bottom-4 left-4 right-4 bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-xs font-mono">
                  {error}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
