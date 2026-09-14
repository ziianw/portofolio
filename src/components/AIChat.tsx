import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, X, MessageSquare, Trash2 } from "lucide-react";
import { askLocalAI, type AIAnswer } from "@/lib/local-ai";
import AIAnswerView from "./AIAnswerView";

interface Message {
  role: "user" | "assistant";
  content: AIAnswer;
}

const PRESET_PROMPTS = [
  "Apa keahlian teknis Zian?",
  "Project apa saja yang pernah dikerjakan?",
  "Kenapa Zian cocok direkrut?",
  "Apa hobi Zian?",
];

const GREETING: AIAnswer = {
  lead: "Halo! Saya asisten virtual dari **Zian Wahidi**. Saya menjawab per topik biar ringkas — pilih salah satu chip di bawah, atau tanya langsung seputar skill, project, sertifikasi, atau sisi personalnya.",
  chips: PRESET_PROMPTS,
};

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 400);
  }, [open]);

  const handleSend = (textToSend?: string) => {
    const msg = (textToSend || input).trim();
    if (!msg || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: { lead: msg } }]);
    setLoading(true);

    const dynamicDelay = Math.min(Math.max(msg.length * 10, 600), 1300);

    setTimeout(() => {
      const reply = askLocalAI(msg);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setLoading(false);
    }, dynamicDelay);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleClearChat = () => {
    if (window.confirm("Hapus semua riwayat chat?")) {
      setMessages([{ role: "assistant", content: GREETING }]);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-hero-gradient text-primary-foreground shadow-[0_0_30px_rgba(58,138,154,0.5)] hover:shadow-[0_0_50px_rgba(58,138,154,0.7)] transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Tanya AI tentang Zian"
        data-cursor="hover"
      >
        <MessageSquare className="h-6 w-6" />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed bottom-6 right-6 z-50 w-[380px] sm:w-[440px] h-[580px] max-h-[80vh] glass-strong rounded-3xl flex flex-col shadow-[0_20px_80px_rgba(0,0,0,0.5)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-hero-gradient text-primary-foreground">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Zian's Portfolio Agent</p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Online · Jawaban Ringkas per Topik
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {messages.length > 1 && (
                    <button
                      onClick={handleClearChat}
                      className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10 text-muted-foreground hover:text-destructive transition"
                      title="Clear chat history"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10 transition"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${
                      m.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full mt-0.5 ${
                        m.role === "user"
                          ? "bg-primary/20 text-primary"
                          : "bg-hero-gradient text-primary-foreground"
                      }`}
                    >
                      {m.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </div>

                    {m.role === "user" ? (
                      <div className="max-w-[80%] rounded-2xl rounded-tr-md px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap bg-hero-gradient text-primary-foreground">
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

                {/* Loading indicator */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-hero-gradient text-primary-foreground shadow-lg">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="glass rounded-2xl rounded-tl-md px-4 py-3">
                      <div className="flex gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Footer */}
              <div className="shrink-0 border-t border-white/10 p-4">
                <div className="glass rounded-2xl flex items-end gap-2 p-1.5">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Tanya skill, project, atau hobi Zian..."
                    rows={1}
                    className="flex-1 bg-transparent resize-none outline-none px-3 py-2 text-sm placeholder:text-muted-foreground/50 max-h-[120px]"
                    disabled={loading}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-hero-gradient text-primary-foreground disabled:opacity-40 transition hover:scale-105 disabled:hover:scale-100"
                    aria-label="Send"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground/50 mt-1.5 text-center">
                  Local AI · Menjawab Sesuai Topik yang Ditanya
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
