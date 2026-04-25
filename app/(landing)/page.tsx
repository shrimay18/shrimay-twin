// app/landing/page.tsx
import Link from 'next/link';
import { Mic, Zap, MessageSquare, ArrowRight, ShieldAlert, Code2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050810] text-slate-200 selection:bg-blue-500/30 font-sans">
      {/* Background Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-600/5 blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative flex justify-between items-center p-6 max-w-7xl mx-auto z-50">
        {/* New Tech-Vibe Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white transform group-hover:rotate-6 transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            <Code2 size={20} strokeWidth={3} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black tracking-tighter text-white">SHRIMAY</span>
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-blue-500 uppercase">Digital_Twin</span>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          {/* New Delta Redirection */}
          <Link 
            href="https://www.thedelta.co.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-slate-800 bg-slate-900/50 text-sm font-bold text-slate-300 hover:text-white hover:border-blue-500/50 transition-all"
          >
            Prepare for NSET <ArrowRight size={14} className="text-blue-500" />
          </Link>
          
          <Link href="/chat" className="text-sm font-bold text-white bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-full hover:bg-blue-600/20 transition-all">
            Chat Now
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative px-6 pt-24 pb-32 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-10 text-[10px] font-bold tracking-widest text-blue-400 uppercase border border-blue-500/20 bg-blue-500/5 rounded-full backdrop-blur-sm">
          <ShieldAlert size={12} className="text-blue-500" /> System Status: 3rd Year Sarcasm Enabled
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-white leading-[0.9]">
          Ask my twin. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600">
            I'm busy graduating.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-14 max-w-2xl mx-auto leading-relaxed">
          The closest you'll get to a senior's brain without buying him a coffee. 
          Real SST insights, filtered through <span className="text-blue-400 font-semibold tracking-wide">3 years of hustle</span>.
        </p>
        
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          <Link 
            href="/chat"
            target="_blank" 
            rel="noopener noreferrer" 
            className="group relative flex items-center justify-center gap-3 bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-blue-500 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(37,99,235,0.2)]"
          >
            Ask the Twin <Mic size={24} className="group-hover:animate-pulse" />
          </Link>

          {/* NSET Button with the 50% Off Sticker */}
          <div className="relative group">
            {/* The "Sticker" badge */}
            <div className="absolute -top-5 -right-3 z-10 bg-yellow-400 text-slate-950 text-[11px] font-black px-2.5 py-1 rounded-md rotate-12 shadow-xl animate-bounce">
              USE CODE: DELTA50
            </div>
            
            <Link 
              href="https://www.scaler.com/school-of-technology/application/?rce=efdb36467c61&rcy=1" 
              className="flex items-center justify-center gap-3 bg-white text-slate-950 px-12 py-5 rounded-2xl font-black text-xl hover:bg-slate-100 transition-all hover:scale-[1.02]"
            >
              Register for NSET <ArrowRight size={24} className="text-blue-600" />
            </Link>
          </div>
        </div>
      </header>

      {/* Bottom Features */}
      <section className="relative py-24 border-t border-slate-900/50 bg-[#070b14]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          <div className="p-8 rounded-[2rem] bg-slate-900/30 border border-slate-800/50 hover:border-blue-500/30 transition-all duration-500">
            <div className="w-12 h-12 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white tracking-tight">Instant Truths</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">Real answers about placement stats and mess food. No sugarcoating, I don't work for HR.</p>
          </div>

          <div className="p-8 rounded-[2rem] bg-slate-900/30 border border-slate-800/50 hover:border-blue-500/30 transition-all duration-500">
            <div className="w-12 h-12 bg-indigo-600/10 text-indigo-500 rounded-2xl flex items-center justify-center mb-6">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white tracking-tight">Hinglish Core</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">"Bhai, NSET crack hoga?" Yes, it understands your late-night panic in proper Hinglish.</p>
          </div>

          <div className="p-8 rounded-[2rem] bg-slate-900/30 border border-slate-800/50 hover:border-blue-500/30 transition-all duration-500">
            <div className="w-12 h-12 bg-emerald-600/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-6">
              <ShieldAlert size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white tracking-tight">Human Fallback</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">If the AI gets confused (rare, but happens), I'll personally get pinged via email to answer.</p>
          </div>
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="p-16 text-center border-t border-slate-900/50">
        <div className="flex flex-col items-center gap-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">Designed for Future Scaler Legends</p>
          <div className="h-px w-8 bg-blue-500/50" />
        </div>
      </footer>
    </div>
  );
}