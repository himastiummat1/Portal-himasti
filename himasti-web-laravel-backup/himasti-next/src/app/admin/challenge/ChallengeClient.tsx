"use client";

import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { 
  Code2, Play, CheckCircle2, XCircle, Sparkles, Terminal, 
  RotateCcw, Trophy, Zap, ChevronRight, HelpCircle, Flame, 
  Layers, Check, Eye, EyeOff, BookOpen, Clock
} from "lucide-react";
import { challengesData, Challenge, TestCase } from "./challengesData";

interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  error?: string;
  isHidden?: boolean;
}

export default function ChallengeClient() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>(challengesData[0]);
  const [code, setCode] = useState<string>(challengesData[0].starterCode);
  const [activeTab, setActiveTab] = useState<"description" | "hint" | "sandbox">("description");
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [totalXp, setTotalXp] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [sandboxCode, setSandboxCode] = useState<string>(`// HIMASTI JavaScript Sandbox
// Tulis dan eksperimen kode JavaScript sesukamu di sini!

const pesan = "Halo dari Laboratorium Komputasi HIMASTI!";
console.log(pesan);

const angka = [10, 25, 40, 55, 70];
const total = angka.reduce((a, b) => a + b, 0);
console.log("Total penjumlahan:", total);
`);
  const [sandboxOutput, setSandboxOutput] = useState<string[]>([]);

  // Load solved challenges and XP from localStorage
  useEffect(() => {
    try {
      const savedSolved = localStorage.getItem("himasti_solved_challenges");
      if (savedSolved) {
        const parsed = JSON.parse(savedSolved);
        setSolvedIds(parsed);
        const xp = challengesData
          .filter(c => parsed.includes(c.id))
          .reduce((acc, curr) => acc + curr.xp, 0);
        setTotalXp(xp);
      }
    } catch (e) {}
  }, []);

  // When selected challenge changes, reset code
  const handleSelectChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setCode(challenge.starterCode);
    setTestResults(null);
    setConsoleOutput([]);
    setShowHint(false);
    setActiveTab("description");
  };

  // Safe Sandboxed Runner
  const runCode = (isSubmit: boolean = false) => {
    setIsRunning(true);
    setConsoleOutput([]);
    const logs: string[] = [];

    // Capture console.log safely
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      logs.push(args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" "));
      originalLog(...args);
    };

    try {
      // 1. Evaluate User Code in a Function scope
      const userFunctionFactory = new Function(`
        ${code}
        if (typeof ${selectedChallenge.functionName} !== 'function') {
          throw new Error("Fungsi '${selectedChallenge.functionName}' tidak ditemukan.");
        }
        return ${selectedChallenge.functionName};
      `);

      const userFn = userFunctionFactory();

      // 2. Select Test Cases (Sample tests if Run, All tests if Submit)
      const casesToRun = isSubmit 
        ? selectedChallenge.testCases 
        : selectedChallenge.testCases.filter(tc => !tc.isHidden);

      const results: TestResult[] = [];
      let allPassed = true;

      for (const tc of casesToRun) {
        try {
          // Deep clone input to avoid mutation
          const inputClone = JSON.parse(JSON.stringify(tc.input));
          const startTime = performance.now();
          const actual = userFn(...inputClone);
          const duration = Math.round(performance.now() - startTime);

          const isMatch = JSON.stringify(actual) === JSON.stringify(tc.expected);
          if (!isMatch) allPassed = false;

          results.push({
            passed: isMatch,
            input: JSON.stringify(tc.input),
            expected: JSON.stringify(tc.expected),
            actual: JSON.stringify(actual),
            isHidden: tc.isHidden
          });
        } catch (execErr: any) {
          allPassed = false;
          results.push({
            passed: false,
            input: JSON.stringify(tc.input),
            expected: JSON.stringify(tc.expected),
            actual: "Error",
            error: execErr.message || "Runtime Error",
            isHidden: tc.isHidden
          });
        }
      }

      setTestResults(results);
      setConsoleOutput(logs);

      // If submitted and all passed
      if (isSubmit && allPassed) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        if (!solvedIds.includes(selectedChallenge.id)) {
          const newSolved = [...solvedIds, selectedChallenge.id];
          setSolvedIds(newSolved);
          const newXp = totalXp + selectedChallenge.xp;
          setTotalXp(newXp);
          localStorage.setItem("himasti_solved_challenges", JSON.stringify(newSolved));
        }
      }
    } catch (syntaxErr: any) {
      setConsoleOutput([...logs, `Syntax Error: ${syntaxErr.message}`]);
      setTestResults([{
        passed: false,
        input: "-",
        expected: "-",
        actual: "-",
        error: syntaxErr.message
      }]);
    } finally {
      console.log = originalLog;
      setIsRunning(false);
    }
  };

  // Run Freeform Sandbox
  const runSandbox = () => {
    setSandboxOutput([]);
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      logs.push(args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" "));
      originalLog(...args);
    };

    try {
      const runner = new Function(sandboxCode);
      runner();
      setSandboxOutput(logs.length > 0 ? logs : ["Program selesai dieksekusi tanpa keluaran console."]);
    } catch (e: any) {
      setSandboxOutput([`Error: ${e.message}`]);
    } finally {
      console.log = originalLog;
    }
  };

  const getRank = (xp: number) => {
    if (xp >= 300) return { title: "Dewa Algoritma HIMASTI", color: "text-amber-500", bg: "bg-amber-100 border-amber-300" };
    if (xp >= 150) return { title: "Hacker Madya", color: "text-violet-600", bg: "bg-violet-100 border-violet-300" };
    if (xp >= 50) return { title: "Junior Coder", color: "text-emerald-600", bg: "bg-emerald-100 border-emerald-300" };
    return { title: "Calon Coder", color: "text-slate-600", bg: "bg-slate-100 border-slate-300" };
  };

  const rank = getRank(totalXp);
  const isCurrentSolved = solvedIds.includes(selectedChallenge.id);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* HEADER & XP PROGRESS HUD */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-violet-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-mono font-bold tracking-widest text-violet-300 mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> ARENA KODING HIMASTI
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
              Tantangan Algoritma & Sandbox
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-xl">
              Asah logika pemrograman dan pecahkan soal algoritma langsung di peramban web tanpa perlu instalasi compiler!
            </p>
          </div>

          {/* User Scorecard */}
          <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-lg">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block">Peringkat Koding</span>
                <span className="text-sm font-extrabold text-white block">{rank.title}</span>
                <span className="text-xs font-mono text-amber-300 font-bold">{totalXp} XP • {solvedIds.length} / {challengesData.length} Soal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOP NAVIGATION: TANTANGAN vs SANDBOX */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit border border-slate-200">
        <button
          onClick={() => setActiveTab("description")}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab !== "sandbox" 
              ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Tantangan Algoritma</span>
        </button>

        <button
          onClick={() => setActiveTab("sandbox")}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "sandbox" 
              ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Bebas Sandbox</span>
        </button>
      </div>

      {/* MAIN VIEW: CHALLENGE ARENA */}
      {activeTab !== "sandbox" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Challenge Picker & Problem Statement (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Quick Challenge Selector (Horizontal scroll on mobile) */}
            <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm overflow-x-auto flex gap-2">
              {challengesData.map((ch) => {
                const isSolved = solvedIds.includes(ch.id);
                const isSelected = selectedChallenge.id === ch.id;

                return (
                  <button
                    key={ch.id}
                    onClick={() => handleSelectChallenge(ch)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 border ${
                      isSelected 
                        ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {isSolved ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                    <span>{ch.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Problem Details Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    selectedChallenge.difficulty === "Mudah" 
                      ? "bg-emerald-100 text-emerald-700" 
                      : selectedChallenge.difficulty === "Sedang" 
                      ? "bg-amber-100 text-amber-700" 
                      : "bg-rose-100 text-rose-700"
                  }`}>
                    {selectedChallenge.difficulty}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">• {selectedChallenge.category}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-100">
                  <Zap className="w-3.5 h-3.5" />
                  <span>+{selectedChallenge.xp} XP</span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedChallenge.title}</h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                  {selectedChallenge.description}
                </p>
              </div>

              {/* Examples */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Contoh Kasus</h3>
                {selectedChallenge.examples.map((ex, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-1">
                    <div><span className="text-slate-400">Masukan:</span> <span className="text-slate-800 font-bold">{ex.input}</span></div>
                    <div><span className="text-slate-400">Keluaran:</span> <span className="text-emerald-600 font-bold">{ex.output}</span></div>
                    {ex.explanation && (
                      <div className="text-[11px] text-slate-500 font-sans mt-1 italic">Penjelasan: {ex.explanation}</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Batasan (Constraints)</h3>
                <ul className="list-disc ml-5 space-y-1 text-xs text-slate-600">
                  {selectedChallenge.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              {/* Hint Box */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-2 text-xs font-bold text-violet-600 hover:text-violet-800 transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{showHint ? "Sembunyikan Petunjuk" : "Butuh Petunjuk Logika?"}</span>
                </button>
                {showHint && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-violet-50/70 border border-violet-100 text-xs text-violet-900 leading-relaxed animate-in fade-in duration-200">
                    💡 <strong>Tips:</strong> {selectedChallenge.hint}
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: Code Editor & Test Evaluator (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Editor Container */}
            <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
              
              {/* Editor Header Bar */}
              <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>solution.js</span>
                  {isCurrentSolved && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800 font-bold ml-2">
                      <Check className="w-3 h-3" /> SELESAI
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCode(selectedChallenge.starterCode)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
                    title="Kembalikan ke kode awal"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Code Textarea with Line Numbers Feel */}
              <div className="relative p-4 font-mono text-xs sm:text-sm bg-slate-950">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={14}
                  spellCheck={false}
                  className="w-full bg-transparent text-emerald-400 font-mono focus:outline-none resize-y leading-relaxed"
                />
              </div>

              {/* Editor Actions Footer */}
              <div className="p-4 bg-slate-900/70 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-slate-500 font-mono">
                  Engine: Sandboxed ECMAScript
                </span>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    disabled={isRunning}
                    onClick={() => runCode(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50 border border-slate-700"
                  >
                    <Play className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Uji Kasus Sampel</span>
                  </button>

                  <button
                    type="button"
                    disabled={isRunning}
                    onClick={() => runCode(true)}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-emerald-950 active:scale-95 disabled:opacity-50"
                  >
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>Submit Solusi (Semua Tes)</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Test Results & Console Log Box */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-slate-600" />
                  <span>Hasil Evaluasi & Output</span>
                </h3>
                {testResults && (
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    testResults.every(r => r.passed) 
                      ? "bg-emerald-100 text-emerald-800" 
                      : "bg-rose-100 text-rose-800"
                  }`}>
                    {testResults.filter(r => r.passed).length} / {testResults.length} Lolos
                  </span>
                )}
              </div>

              {/* Celebration Banner if All Passed */}
              {testResults && testResults.every(r => r.passed) && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 animate-in zoom-in-95 duration-200">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Luar Biasa! Semua Test Case Berhasil!</h4>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Logika kodingmu 100% tepat. Kamu telah mengklaim {selectedChallenge.xp} XP untuk tantangan ini!
                    </p>
                  </div>
                </div>
              )}

              {/* Test Cases Accordion / List */}
              {testResults ? (
                <div className="space-y-2">
                  {testResults.map((res, i) => (
                    <div 
                      key={i} 
                      className={`p-3.5 rounded-2xl border text-xs font-mono transition-all ${
                        res.passed 
                          ? "bg-emerald-50/40 border-emerald-200 text-slate-800" 
                          : "bg-rose-50/40 border-rose-200 text-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {res.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                          <span className="font-bold">
                            Kasus #{i + 1} {res.isHidden ? "(Uji Tersembunyi)" : ""}
                          </span>
                        </div>
                        <span className={`text-[11px] font-bold ${res.passed ? "text-emerald-600" : "text-rose-600"}`}>
                          {res.passed ? "PASSED" : "FAILED"}
                        </span>
                      </div>

                      {!res.passed && (
                        <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 space-y-1 text-[11px]">
                          {!res.isHidden && <div><span className="text-slate-400">Input:</span> {res.input}</div>}
                          <div><span className="text-slate-400">Diharapkan:</span> <span className="text-emerald-700 font-bold">{res.expected}</span></div>
                          <div><span className="text-slate-400">Dihasilkan:</span> <span className="text-rose-700 font-bold">{res.actual}</span></div>
                          {res.error && <div className="text-rose-600 font-sans mt-1">Pesan Error: {res.error}</div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs font-mono">
                  Klik &quot;Uji Kasus Sampel&quot; atau &quot;Submit Solusi&quot; untuk menjalankan kode.
                </div>
              )}

              {/* Console Logs */}
              {consoleOutput.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-mono text-slate-400 block mb-1.5">Console Output:</span>
                  <div className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs space-y-0.5 overflow-x-auto">
                    {consoleOutput.map((log, i) => (
                      <div key={i}>{log}</div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      ) : (
        // FREEFORM SANDBOX VIEW
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Laboratorium Kode Bebas (Sandbox)</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Gunakan editor di bawah untuk mencoba potongan kode JavaScript apa pun secara bebas. Hasil eksekusi akan ditampilkan di terminal konsol.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Editor */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
              <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-xs font-mono text-slate-400">
                <span>sandbox.js</span>
                <button
                  type="button"
                  onClick={runSandbox}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all flex items-center gap-1.5 text-xs shadow-sm active:scale-95"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Jalankan Script</span>
                </button>
              </div>

              <textarea
                value={sandboxCode}
                onChange={(e) => setSandboxCode(e.target.value)}
                rows={16}
                spellCheck={false}
                className="p-4 bg-transparent text-emerald-400 font-mono text-xs sm:text-sm focus:outline-none resize-y leading-relaxed w-full"
              />
            </div>

            {/* Console Output */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
              <div className="p-3 bg-slate-950 border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Console Terminal</span>
              </div>

              <div className="p-4 font-mono text-xs sm:text-sm text-slate-200 flex-1 overflow-y-auto space-y-1.5 min-h-[300px]">
                {sandboxOutput.length > 0 ? (
                  sandboxOutput.map((out, i) => (
                    <div key={i} className="text-emerald-400 leading-relaxed font-mono">
                      &gt; {out}
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500 italic">
                    Belum ada keluaran. Klik &quot;Jalankan Script&quot; untuk melihat log.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
