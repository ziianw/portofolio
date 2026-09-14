import { motion } from "framer-motion";
import { Mail, Download, Linkedin, Instagram, Send, Bot, User, Sparkles, Loader2, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Magnetic from "./Magnetic";
import Tilt3D from "./Tilt3D";
import Reveal from "./Reveal";
import { askLocalAI, type AIAnswer } from "@/lib/local-ai";
import AIAnswerView from "./AIAnswerView";

interface Message {
  role: "user" | "assistant";
  content: AIAnswer;
}

const CHAT_GREETING: AIAnswer = {
  lead: "Halo! Saya asisten virtual dari **Zian Wahidi**. Silakan tanya seputar kompetensi teknis, sertifikasi, atau projectnya. Saya jawab per topik biar ringkas.",
  chips: [
    "Apa keahlian teknis Zian?",
    "Project apa saja yang pernah dikerjakan?",
    "Sertifikasi apa saja yang dimiliki Zian?",
    "Bagaimana cara menghubungi Zian?",
  ],
};

function InlineAIChat() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: CHAT_GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [chatOpen]);

  const handleSend = (textToSend?: string) => {
    const msg = (textToSend || input).trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: { lead: msg } }]);
    setLoading(true);

    // Simulasi delay agar terasa seperti AI berpikir
    setTimeout(() => {
      const reply = askLocalAI(msg);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="mt-8">
      {/* ── Toggle AI Chat ── */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className={`group w-full rounded-2xl p-4 transition-all duration-300 border ${
          chatOpen
            ? "glass-strong border-primary/30"
            : "glass border-white/10 hover:border-primary/30 hover:bg-white/[0.08]"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-hero-gradient text-primary-foreground shadow-[0_0_20px_rgba(58,138,154,0.3)] group-hover:shadow-[0_0_30px_rgba(58,138,154,0.5)] transition-shadow">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">
                {chatOpen ? "AI Assistant" : "Tanya AI tentang Zian"}
              </p>
              <p className="text-xs text-muted-foreground">
                {chatOpen
                  ? "Klik untuk menutup"
                  : "Seputar pengalaman, skill, project & sertifikasi"}
              </p>
            </div>
          </div>
          <div
            className={`grid h-8 w-8 place-items-center rounded-full transition-all duration-300 ${
              chatOpen ? "bg-hero-gradient text-primary-foreground rotate-180" : "glass text-muted-foreground"
            }`}
          >
            <ChevronDown className="h-5 w-5 transition-transform duration-300" />
          </div>
        </div>
      </button>

      {/* ── Chat Panel ── */}
      <motion.div
        initial={false}
        animate={{
          height: chatOpen ? "auto" : 0,
          opacity: chatOpen ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="mt-3 glass-strong rounded-3xl overflow-hidden border border-white/10 shadow-[0_10px_50px_rgba(0,0,0,0.3)]">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-white/[0.04]">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-hero-gradient text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">AI Assistant</p>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online — Local AI
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[300px] overflow-y-auto px-5 py-4 space-y-4 scroll-smooth">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full shadow-lg ${
                    m.role === "user"
                      ? "bg-primary/20 text-primary"
                      : "bg-hero-gradient text-primary-foreground"
                  }`}
                >
                  {m.role === "user" ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                </div>
                {m.role === "user" ? (
                  <div className="max-w-[82%] rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap bg-hero-gradient text-primary-foreground">
                    {m.content.lead}
                  </div>
                ) : (
                  <div className="flex-1 min-w-0">
                    <AIAnswerView
                      answer={m.content}
                      onChip={(q) => handleSend(q)}
                      chipsDisabled={loading}
                    />
                  </div>
                )}
              </motion.div>
            ))}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-hero-gradient text-primary-foreground shadow-lg">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/10 p-4 bg-white/[0.03]">
            <div className="glass rounded-2xl flex items-end gap-2 p-1.5 focus-within:ring-1 focus-within:ring-primary/40 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 80)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ketik pertanyaan tentang Zian..."
                rows={1}
                className="flex-1 bg-transparent resize-none outline-none px-3 py-2 text-sm placeholder:text-muted-foreground/40"
                disabled={loading}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-hero-gradient text-primary-foreground disabled:opacity-40 transition hover:scale-105 hover:shadow-[0_0_20px_rgba(58,138,154,0.4)] disabled:hover:scale-100"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="relative py-24 px-4">
      <div className="mx-auto max-w-4xl">
        <Reveal y={40} margin="-100px">
          <div className="glass-strong relative overflow-hidden rounded-3xl p-10 md:p-14 text-center hover-gradient-border"
        >
          <div className="absolute inset-0 bg-hero-gradient opacity-10 pointer-events-none" />
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-secondary/30 blur-3xl pointer-events-none" />

          <Tilt3D
            rotate={10}
            shift={20}
            className="relative"
            data-cursor="hover"
          >
            <p className="text-sm font-medium text-primary uppercase tracking-widest">
              Get in Touch
            </p>
            <h2 className="mt-2 text-4xl md:text-5xl font-bold">
              Let's <span className="text-gradient">build something</span>{" "}
              together
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              I'm open to freelance work, full-time roles, and interesting
              collaborations. Drop me a line and I'll get back to you as soon as
              possible.
            </p>

            <Magnetic
              as="a"
              href="/assets/Curriculum Vitae Zian Wahidi.pdf"
              download
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-hero-gradient px-7 py-3.5 font-semibold text-primary-foreground shadow-[0_0_50px_rgba(58,138,154,0.5)] animate-glow-pulse"
            >
              <Download className="h-5 w-5" /> Download CV
            </Magnetic>

            <div className="mt-10 grid sm:grid-cols-3 gap-4 text-left">
              <a
                href="mailto:zianwhd@gmail.com"
                className="block"
              >
                <Tilt3D
                  rotate={8}
                  shift={12}
                  className="glass rounded-2xl p-4 flex items-center gap-3 hover:bg-white/10 transition cursor-default hover-glow"
                >
                  <Mail className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-semibold">zianwhd@gmail.com</p>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                </Tilt3D>
              </a>
              <a
                href="https://www.linkedin.com/in/zianwhd"
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <Tilt3D
                  rotate={8}
                  shift={12}
                  className="glass rounded-2xl p-4 flex items-center gap-3 hover:bg-white/10 transition cursor-default hover-glow"
                >
                  <Linkedin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">LinkedIn</p>
                    <p className="text-sm font-semibold">/in/zianwhd</p>
                  </div>
                </Tilt3D>
              </a>
              <a
                href="https://instagram.com/zianwhd"
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <Tilt3D
                  rotate={8}
                  shift={12}
                  className="glass rounded-2xl p-4 flex items-center gap-3 hover:bg-white/10 transition cursor-default hover-glow"
                >
                  <Instagram className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Instagram</p>
                    <p className="text-sm font-semibold">@zianwhd</p>
                  </div>
                </Tilt3D>
              </a>
            </div>
          </Tilt3D>
        </div></Reveal>

        {/* ── AI Chat Inline (di luar card utama) ── */}
        <div className="mt-8">
          <InlineAIChat />
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Zian Wahidi | All rights reserved.
        </p>
      </div>
    </section>
  );
}
