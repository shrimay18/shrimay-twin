"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Send, 
  ArrowLeft, 
  Code2, 
  User, 
  Bot, 
  RefreshCcw,
  Mail,
  ShieldCheck,
  Loader2
} from 'lucide-react';

// --- Types ---
type Message = {
  text: string;
  isUser: boolean;
};

type ChatState = "chatting" | "awaiting_email" | "awaiting_otp" | "doubt_forwarded";

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

const TypingIndicator = () => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }}
    className="flex gap-4 mb-6"
  >
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border bg-slate-900 border-slate-800 text-blue-500">
      <Bot size={20} />
    </div>
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl rounded-tl-none px-5 py-4 flex items-center gap-1.5">
      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  </motion.div>
);

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hey! 👋 I'm Shrimay's Digital Twin. Ask me anything while he's busy graduating! What's your doubt, freshie?", isUser: false }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatState, setChatState] = useState<ChatState>("chatting");
  const [pendingDoubt, setPendingDoubt] = useState("");
  const [questionId, setQuestionId] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const addBotMessage = (text: string) => {
    setMessages(prev => [...prev, { text, isUser: false }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { text, isUser: true }]);
  };

  // --- Main send handler ---
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput("");
    addUserMessage(userMsg);

    // Route to the right handler based on state
    if (chatState === "awaiting_email") {
      await handleEmailSubmit(userMsg);
    } else if (chatState === "awaiting_otp") {
      await handleOtpSubmit(userMsg);
    } else {
      await handleChat(userMsg);
    }
  };

  // --- Normal chat ---
  const handleChat = async (userMsg: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();

      if (data.status === "needs_email") {
        setPendingDoubt(data.pendingDoubt || userMsg);
        setChatState("awaiting_email");
        addBotMessage(data.text);
      } else {
        addBotMessage(data.text);
      }
    } catch {
      addBotMessage("Network error — check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Email collection ---
  const handleEmailSubmit = async (email: string) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      addBotMessage("That doesn't look like a valid email. Try again? 🤔");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/chat/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, doubt: pendingDoubt }),
      });
      const data = await res.json();

      if (data.success) {
        setQuestionId(data.questionId);
        setChatState("awaiting_otp");
        addBotMessage(`OTP sent to ${email}! 📬 Enter the 6-digit code to verify.`);
      } else {
        addBotMessage("Couldn't send OTP — double check your email and try again.");
      }
    } catch {
      addBotMessage("Something went wrong sending the OTP. Try again?");
    } finally {
      setIsLoading(false);
    }
  };

  // --- OTP verification ---
  const handleOtpSubmit = async (otp: string) => {
    if (!/^\d{6}$/.test(otp)) {
      addBotMessage("That's not a 6-digit code. Check your email and try again.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/chat/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, otp }),
      });
      const data = await res.json();

      if (data.success) {
        setChatState("doubt_forwarded");
        addBotMessage("✅ Email verified! Your doubt has been forwarded to Shrimay. He'll get back to you via email. Meanwhile, feel free to ask me anything else!");
        // Reset state for further chatting
        setTimeout(() => {
          setChatState("chatting");
          setPendingDoubt("");
          setQuestionId("");
        }, 1000);
      } else {
        addBotMessage(`Wrong OTP: ${data.error || "Try again."}`);
      }
    } catch {
      addBotMessage("Verification failed. Try entering the OTP again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Get placeholder text based on state ---
  const getPlaceholder = () => {
    switch (chatState) {
      case "awaiting_email": return "Enter your email address...";
      case "awaiting_otp": return "Enter 6-digit OTP from your email...";
      default: return "Type your doubt...";
    }
  };

  // --- Get status icon ---
  const getStatusIcon = () => {
    switch (chatState) {
      case "awaiting_email": return <Mail size={14} />;
      case "awaiting_otp": return <ShieldCheck size={14} />;
      default: return null;
    }
  };

  return (
    <div className="h-screen bg-[#050810] text-slate-300 flex flex-col overflow-hidden font-sans">
      
      {/* Blueprint background */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-900/50 bg-[#050810]/80 backdrop-blur-xl p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-slate-900 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <h1 className="text-sm font-black text-white tracking-tight uppercase">Shrimay_Agent.sh</h1>
            </div>
            <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">
              {chatState === "awaiting_email" ? "📧 Email_Verification" 
               : chatState === "awaiting_otp" ? "🔐 OTP_Verification"
               : "Encrypted_Session // SST_Network"}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <button 
             onClick={() => {
               setMessages([{ text: "Hey! 👋 Fresh session! What's your doubt, freshie?", isUser: false }]);
               setChatState("chatting");
               setPendingDoubt("");
               setQuestionId("");
             }}
             className="p-2 text-slate-500 hover:text-white transition-colors"
             title="New chat"
           >
              <RefreshCcw size={18} />
           </button>
           <div className="w-8 h-8 bg-blue-600/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-500">
             <Code2 size={16} />
           </div>
        </div>
      </header>

      {/* Chat area */}
      <main ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto p-6 md:p-12 scrollbar-hide">
        <div className="max-w-3xl mx-auto">
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg.text} isUser={msg.isUser} />
          ))}
          {isLoading && <TypingIndicator />}
        </div>
      </main>

      {/* Input area */}
      <footer className="relative z-10 p-6 bg-gradient-to-t from-[#050810] via-[#050810] to-transparent">
        <div className="max-w-3xl mx-auto relative">
          <div className="relative group">
            <input 
              type={chatState === "awaiting_otp" ? "text" : chatState === "awaiting_email" ? "email" : "text"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={getPlaceholder()}
              disabled={isLoading}
              className="w-full bg-slate-900/50 border border-slate-800 text-white pl-6 pr-20 py-5 rounded-[2rem] focus:outline-none focus:border-blue-500/50 transition-all backdrop-blur-md disabled:opacity-50"
            />
            
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center items-center gap-4 text-[9px] font-mono text-slate-600 uppercase tracking-widest">
             {getStatusIcon()}
             <span>
               {chatState === "awaiting_email" ? "Enter email to verify" 
                : chatState === "awaiting_otp" ? "Check inbox for OTP"
                : "Press [Enter] to send"}
             </span>
             <span className="text-slate-800">|</span>
             <span>Status: {chatState === "chatting" ? "Ready" : chatState.replace("_", " ")}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}