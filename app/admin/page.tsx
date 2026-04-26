"use client";
import { useState } from "react";

// Professional Modal Component
const AnswerModal = ({ question, isOpen, onClose, onSave }: any) => {
  const [ans, setAns] = useState("");
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl w-full max-w-lg shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-2">Resolve Doubt</h3>
        <p className="text-slate-400 text-sm mb-2">From: <span className="text-blue-400">{question.studentEmail}</span></p>
        <p className="text-slate-400 text-sm mb-6 italic">"{question.text}"</p>
        <textarea 
          className="w-full h-40 p-4 bg-slate-800 rounded-xl border border-slate-600 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          placeholder="Type your authentic senior response..."
          value={ans}
          onChange={(e) => setAns(e.target.value)}
        />
        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="px-5 py-2 text-slate-400 hover:text-white transition">Cancel</button>
          <button 
            onClick={() => { onSave(question.id, ans); setAns(""); }}
            disabled={!ans.trim()}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-2 rounded-xl font-bold text-white transition transform active:scale-95 disabled:opacity-40"
          >
            Inject Wisdom
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [secret, setSecret] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [doubts, setDoubts] = useState([]);
  const [activeDoubt, setActiveDoubt] = useState(null);
  const [dumpText, setDumpText] = useState("");
  const [loading, setLoading] = useState(false);

  // Server-side auth validation
  const handleLogin = async () => {
    if (!secret.trim()) return;
    setAuthLoading(true);
    setAuthError("");
    
    try {
      // Test the secret by making a real API call
      const res = await fetch(`/api/admin/doubts?secret=${encodeURIComponent(secret)}`);
      const data = await res.json();
      
      if (data.error) {
        setAuthError("Invalid secret key. Access denied.");
        setIsAuth(false);
      } else {
        setIsAuth(true);
        setDoubts(data);
      }
    } catch {
      setAuthError("Connection error. Try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchDoubts = async () => {
    const res = await fetch(`/api/admin/doubts?secret=${encodeURIComponent(secret)}`);
    const data = await res.json();
    if (!data.error) setDoubts(data);
  };

  const handleDump = async () => {
    setLoading(true);
    await fetch("/api/admin/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: dumpText, secret }),
    });
    setDumpText("");
    setLoading(false);
    alert("Knowledge chunks injected!");
  };

  const resolveDoubt = async (id: string, answerText: string) => {
    await fetch("/api/admin/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: id, answerText, secret }),
    });
    setActiveDoubt(null);
    fetchDoubts();
  };

  if (!isAuth) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-white">
        <h1 className="text-4xl font-black mb-6 tracking-tighter">COMMAND CENTER</h1>
        <input 
          type="password" 
          placeholder="Admin Secret Key" 
          className="p-4 rounded-xl bg-slate-900 border border-slate-800 w-64 text-center focus:ring-2 focus:ring-blue-500 outline-none"
          value={secret}
          onChange={(e) => { setSecret(e.target.value); setAuthError(""); }}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />
        {authError && (
          <p className="mt-3 text-red-400 text-sm font-medium">{authError}</p>
        )}
        <button 
          onClick={handleLogin} 
          disabled={authLoading}
          className="mt-6 bg-white text-black px-10 py-3 rounded-xl font-bold hover:bg-slate-200 transition disabled:opacity-50"
        >
          {authLoading ? "Verifying..." : "Login"}
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-slate-200">
      <AnswerModal isOpen={!!activeDoubt} question={activeDoubt} onClose={() => setActiveDoubt(null)} onSave={resolveDoubt} />
      
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-white">🧠 Command Center</h1>
          <button onClick={fetchDoubts} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition">
            Refresh Doubts
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
            <h2 className="text-2xl font-bold mb-2 text-blue-400">📂 Knowledge Dump</h2>
            <p className="text-sm text-slate-500 mb-6">Paste docs or notes. The AI will learn from this.</p>
            <textarea 
              className="w-full h-80 p-4 bg-slate-800/50 rounded-2xl border border-slate-700 mb-6 focus:ring-2 focus:ring-blue-500 outline-none text-white"
              value={dumpText}
              onChange={(e) => setDumpText(e.target.value)}
              placeholder="Ex: Scaler School of Technology placement data 2026..."
            />
            <button onClick={handleDump} disabled={loading || !dumpText.trim()} className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-bold transition disabled:opacity-40">
              {loading ? "Processing..." : "Sync Brain"}
            </button>
          </div>

          <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
            <h2 className="text-2xl font-bold mb-2 text-orange-400">🚨 Doubt Queue</h2>
            <p className="text-sm text-slate-500 mb-6">Verified questions from juniors. Answer = auto-email to them.</p>
            <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
              {doubts.length === 0 && (
                <p className="text-slate-600 text-center py-8">No pending doubts. 🎉</p>
              )}
              {doubts.map((d: any) => (
                <div key={d.id} className="p-5 bg-slate-800/40 rounded-2xl border border-slate-700/50 flex justify-between items-center group hover:border-slate-500 transition">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="font-medium text-slate-200 truncate">"{d.text}"</p>
                    <div className="flex gap-3 mt-2">
                      <p className="text-[10px] uppercase tracking-widest text-slate-500">
                        {new Date(d.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-[10px] uppercase tracking-widest text-blue-400">
                        {d.studentEmail}
                      </p>
                      {d.isVerified && (
                        <span className="text-[10px] uppercase tracking-widest text-green-400">✓ Verified</span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => setActiveDoubt(d)} className="bg-white text-black text-xs px-4 py-2 rounded-lg font-bold hover:bg-orange-500 hover:text-white transition shrink-0">Answer</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}