"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Mic, 
  Zap, 
  MessageSquare, 
  ArrowRight, 
  ShieldAlert, 
  Code2, 
  Database, 
  BrainCircuit, 
  Sparkles 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050810] text-slate-300 selection:bg-blue-500/30 font-sans overflow-x-hidden">
      
      {/* --- THE BLUEPRINT BACKGROUND --- */}
      {/* Custom grid overlay to give it that "Engineering Draft" look */}
      <div className="fixed inset-0 z-0 opacity-[0.04] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)`, backgroundSize: '45px 45px' }} />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-transparent via-[#050810]/80 to-[#050810]" />

      {/* --- NAVBAR --- */}
      <nav className="relative flex justify-between items-center p-6 md:p-8 max-w-7xl mx-auto z-50">
        {/* Premium Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white transform group-hover:rotate-6 transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            <Code2 size={20} strokeWidth={3} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black tracking-tighter text-white uppercase">SHRIMAY</span>
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-blue-500 uppercase">Digital_Twin</span>
          </div>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Link 
            href="https://www.thedelta.co.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-slate-800 bg-slate-900/50 text-[10px] sm:text-sm font-bold text-slate-300 hover:text-white hover:border-blue-500/50 transition-all uppercase tracking-tight"
          >
            PREPARE_FOR_NSET <ArrowRight size={14} className="text-blue-500" />
          </Link>
          
          <Link 
            href="/chat" 
            className="hidden sm:block text-sm font-bold text-white bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-full hover:bg-blue-600/20 transition-all uppercase tracking-widest"
          >
            EXECUTE_CHAT
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-12 md:pt-16 pb-24">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 text-left">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-[10px] font-bold tracking-widest text-blue-400 uppercase border border-blue-500/20 bg-blue-500/5 rounded-full backdrop-blur-sm"
            >
              <ShieldAlert size={12} className="text-blue-500" /> System Status: 3rd Year Sarcasm Enabled
            </motion.div>
            
            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter text-white leading-[0.9]">
              Ask my twin. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600">
                I'm busy graduating.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 mb-14 max-w-2xl leading-relaxed">
              The closest you'll get to a senior's brain without buying them a coffee. 
              Real SST insights, filtered through <span className="text-blue-400 font-semibold tracking-wide">3 years of hustle</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
              <Link 
                href="/chat" 
                className="group relative flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-4 md:px-12 md:py-5 rounded-2xl font-black text-lg md:text-xl hover:bg-blue-500 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(37,99,235,0.2)]"
              >
                Ask the Twin <Mic size={24} className="group-hover:animate-pulse" />
              </Link>
              
              <div className="relative group">
                {/* 50% Off Sticker */}
                <div className="absolute -top-5 -right-3 z-10 bg-yellow-400 text-slate-950 text-[11px] font-black px-2.5 py-1 rounded-md rotate-12 shadow-xl animate-bounce pointer-events-none">
                  USE CODE: DELTA50
                </div>
                
                <Link 
                  href="https://www.scaler.com/school-of-technology/application/?rce=efdb36467c61&rcy=1" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-white text-slate-950 px-10 py-4 md:px-12 md:py-5 rounded-2xl font-black text-lg md:text-xl hover:bg-slate-100 transition-all hover:scale-[1.02]"
                >
                  Register for NSET <ArrowRight size={24} className="text-blue-600" />
                </Link>
              </div>
            </div>
          </div>

          {/* --- THE METRICS CARD --- */}
          <div className="lg:col-span-5 relative mt-12 lg:mt-0">
            <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full" />
            <div className="relative border border-slate-800 bg-slate-950/60 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl" />
               
              <div className="flex justify-between items-center mb-10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500/30" />
                  <div className="w-3 h-3 rounded-full bg-blue-500/20" />
                  <div className="w-3 h-3 rounded-full bg-blue-500/10" />
                </div>
                <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Twin_Metrics.log</span>
              </div>
              
              <div className="space-y-10">
                {/* Sarcasm Level Metric */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                    <span>Sarcasm_Level</span>
                    <span className="text-blue-500">96%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden border border-slate-800">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: '96%' }} 
                      transition={{ duration: 2, ease: "easeOut" }} 
                      className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]" 
                    />
                  </div>
                </div>

                {/* Bhai Level Advice Metric */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                    <span>Bhai_Level_Advice</span>
                    <span className="text-indigo-400">MAX</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden border border-slate-800">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: '100%' }} 
                      transition={{ duration: 2.5, ease: "easeOut" }} 
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]" 
                    />
                  </div>
                </div>
                
                <div className="pt-6 border-t border-slate-800/50">
                  <p className="text-sm font-mono text-blue-400/80 leading-relaxed italic">
                    // "If the student asks about mess food, it triggers the 'Emotional Damage' protocol automatically."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- BENTO FEATURES --- */}
      <section className="relative z-10 px-8 py-24 bg-[#070b14]/50 border-y border-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            
            <div className="md:col-span-2 p-8 rounded-[2rem] bg-slate-900/30 border border-slate-800/50 hover:border-blue-500/50 transition-all duration-500 group">
              <Database className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={28} />
              <h3 className="text-xl font-black text-white mb-3">Memory.db</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Stores everything I’ve learned in 3 years at SST. Placements, faculty vibes, and the best places to study (or hide).
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-slate-900/30 border border-slate-800/50 hover:border-indigo-500/50 transition-all duration-500 group">
              <BrainCircuit className="text-indigo-500 mb-6 group-hover:scale-110 transition-transform" size={28} />
              <h3 className="text-xl font-black text-white mb-3">RAG Brain</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Retrieval Augmented Generation. No hallucinations, just hard-coded senior facts.
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-slate-900/30 border border-slate-800/50 hover:border-yellow-500/50 transition-all duration-500 group">
              <Zap className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={28} />
              <h3 className="text-xl font-black text-white mb-3">Delta_Sync</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Direct pipe into the Delta ecosystem for NSET prep shortcuts and resources.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col md:flex-row items-center justify-between p-10 rounded-[2.5rem] bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 backdrop-blur-md">
              <div className="mb-6 md:mb-0 text-left">
                <h3 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">Stumped the AI?</h3>
                <p className="text-slate-400 font-medium">I'll get an email immediately. Real Shrimay {'>'} AI Twin.</p>
              </div>
              <Link href="/chat" className="bg-white text-slate-950 px-10 py-4 rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5">
                Challenge the Bot
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 p-16 text-center">
        <div className="flex flex-col items-center gap-6">
          <p className="text-[10px] font-bold text-slate-700 uppercase tracking-[0.6em]">Designed for Future Scaler Legends // 2026</p>
          <div className="h-px w-12 bg-blue-600/30" />
        </div>
      </footer>

    </div>
  );
}