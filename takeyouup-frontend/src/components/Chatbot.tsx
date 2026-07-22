import { useState, useEffect, useRef } from "react";
import { Send, X, Bot, Minimize2 } from "lucide-react";
import axios from "axios";

interface Message { text: string; sender: "user" | "bot"; }

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hey! 👋 I'm your TakeYouUp assistant. Ask me anything about our courses or programming!", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const chatbotRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { text: input, sender: "user" };
    const botMessage: Message = { text: "Thinking...", sender: "bot" };
    const API = import.meta.env.VITE_API_URL;
    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API}/api/chatbot/generate`, { prompt: input }, { headers: { Authorization: `Bearer ${token}` } });
      setMessages((prev) => prev.map((msg) => (msg.sender === "bot" && msg.text === "Thinking..." ? { ...msg, text: res.data } : msg)));
    } catch {
      setMessages((prev) => prev.map((msg) => (msg.sender === "bot" && msg.text === "Thinking..." ? { ...msg, text: "Error connecting to AI service." } : msg)));
    }
  };

  useEffect(() => {
    if (isOpen && lastMessageRef.current) lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (chatbotRef.current && !chatbotRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div ref={chatbotRef}>
      {/* Toggle button */}
      <button
        onClick={(e) => { e.stopPropagation(); setIsOpen((p) => !p); }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95"
        style={{
          width: 52, height: 52, borderRadius: "50%",
          background: isOpen ? "#1a1a1c" : "linear-gradient(135deg, #ff4d1c, #ffb800)",
          border: "none", cursor: "pointer", color: "white",
          boxShadow: "0 8px 32px rgba(255,77,28,0.4)",
        }}
      >
        {isOpen ? <X style={{ width: 20, height: 20 }} /> : <Bot style={{ width: 22, height: 22 }} />}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-6 z-50 flex flex-col animate-fade-up"
          style={{
            // Never wider/taller than the viewport it sits in (right-6 = 24px gutter).
            width: "min(340px, calc(100vw - 32px))",
            height: "min(480px, calc(100vh - 140px))",
            borderRadius: 20,
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 18px",
              background: "linear-gradient(135deg, #ff4d1c, #ffb800)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bot style={{ width: 18, height: 18, color: "white" }} />
              </div>
              <div>
                <p style={{ color: "white", fontWeight: 700, fontSize: 14, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>TYU Assistant</p>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>● Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Minimize chat" style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)" }}>
              <Minimize2 style={{ width: 16, height: 16 }} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}>
                <div
                  style={{
                    maxWidth: "80%", padding: "10px 14px", borderRadius: msg.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    fontSize: 13, lineHeight: 1.55, fontFamily: "'DM Sans', sans-serif",
                    background: msg.sender === "user" ? "linear-gradient(135deg, #ff4d1c, #ff7a50)" : "hsl(var(--muted))",
                    color: msg.sender === "user" ? "white" : "hsl(var(--foreground))",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={lastMessageRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "12px 14px", borderTop: "1px solid hsl(var(--border))" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(); }}
                style={{
                  flex: 1, padding: "10px 14px", borderRadius: 12,
                  border: "1.5px solid hsl(var(--border))",
                  background: "hsl(var(--background))",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                  color: "inherit", outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#ff4d1c"; }}
                onBlur={(e) => { e.target.style.borderColor = "hsl(var(--border))"; }}
              />
              <button
                onClick={handleSendMessage}
                aria-label="Send message"
                style={{
                  width: 38, height: 38, borderRadius: 10, border: "none", cursor: "pointer",
                  background: "linear-gradient(135deg, #ff4d1c, #ffb800)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <Send style={{ width: 16, height: 16, color: "white" }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
