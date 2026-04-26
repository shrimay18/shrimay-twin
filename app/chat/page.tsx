"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  Send, 
  ArrowLeft, 
  Code2, 
  User, 
  Bot, 
  Terminal as TerminalIcon,
  Sparkles,
  RefreshCcw
} from 'lucide-react';

// --- UI Components ---
const MessageBubble = ({ message, isUser }: { message: string, isUser: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    className={`flex gap-4 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
      isUser ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-900 border-slate-800 text-blue-500'
    }`}>
      {isUser ? <User size={20} /> : <Bot size={20} />}
    </div>
    
    <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-xl ${
      isUser 
        ? 'bg-blue-600 text-white rounded-tr-none' 
        : 'bg-slate-900/80 backdrop-blur-md border border-slate-800 text-slate-300 rounded-tl-none'
    }`}>
      {message}
    </div>
  </motion.div>
);

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { text: "There seems a connection b/w you & Shrimay Twin. What's the doubt, freshie?", isUser: false }
  ]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput("");
    
    // Add the user message to the UI immediately
    setMessages(prev => [...prev, { text: userMsg, isUser: true }]);

    try {
      // Call our new API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await response.json();

      // Add the real AI response to the UI
      setMessages(prev => [...prev, { text: data.text, isUser: false }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "Error 404: My senior wisdom is currently offline. Check your internet, junior.", 
        isUser: false 
      }]);
    }
  };

  return (
    <div className="h-screen bg-[#050810] text-slate-300 flex flex-col overflow-hidden font-sans">
      
      {/* --- BLUEPRINT BACKGROUND --- */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      {/* --- CHAT HEADER --- */}
      <header className="relative z-10 border-b border-slate-900/50 bg-[#050810]/80 backdrop-blur-xl p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/landing" className="p-2 hover:bg-slate-900 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <h1 className="text-sm font-black text-white tracking-tight uppercase">Shrimay_Agent.sh</h1>
            </div>
            <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">Encrypted_Session // SST_Network</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="p-2 text-slate-500 hover:text-white transition-colors">
              <RefreshCcw size={18} />
           </button>
           <div className="w-8 h-8 bg-blue-600/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-500">
             <Code2 size={16} />
           </div>
        </div>
      </header>

      {/* --- CHAT AREA --- */}
      <main 
        ref={scrollRef}
        className="relative z-10 flex-1 overflow-y-auto p-6 md:p-12 scrollbar-hide"
      >
        <div className="max-w-3xl mx-auto">
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg.text} isUser={msg.isUser} />
          ))}
        </div>
      </main>

      {/* --- INPUT AREA --- */}
      <footer className="relative z-10 p-6 bg-gradient-to-t from-[#050810] via-[#050810] to-transparent">
        <div className="max-w-3xl mx-auto relative">
          <div className="relative group">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your doubt (or don't, I'm just an AI)..."
              className="w-full bg-slate-900/50 border border-slate-800 text-white pl-6 pr-32 py-5 rounded-[2rem] focus:outline-none focus:border-blue-500/50 transition-all backdrop-blur-md"
            />
            
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {/* Sarcastic "Voice" trigger */}
              <button 
                onClick={() => setIsRecording(!isRecording)}
                className={`p-3 rounded-xl transition-all ${
                  isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-slate-400 hover:text-blue-400'
                }`}
              >
                <Mic size={20} />
              </button>
              
              <button 
                onClick={handleSend}
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center gap-4 text-[9px] font-mono text-slate-600 uppercase tracking-widest">
             <span>Press [Enter] to Execute</span>
             <span className="text-slate-800">|</span>
             <span>Status: Listening_for_Skill_Issues</span>
          </div>
        </div>
      </footer>
    </div>
  );
}