import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send } from "lucide-react";
import axios from "axios";
import { log } from "console";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const chatbotRef = useRef(null);
  const lastMessageRef = useRef(null);

  const responses = {
    pricing: "Our pricing starts from ₹999 per month.",
    contact: "You can contact us at info@TakeYouUp.com",
    services:
      "We provide a learning platform from beginner to advanced programming courses.",
    courses: "We offer courses in Python, JavaScript, Java, C++, and more.",
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    const botMessage = { text: "Thinking...", sender: "bot" };
    const API = import.meta.env.VITE_API_URL;

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API}/api/chatbot/generate`,
        { prompt: input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const botReply = res.data;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.sender === "bot" && msg.text === "Thinking..."
            ? { ...msg, text: botReply }
            : msg,
        ),
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.sender === "bot" && msg.text === "Thinking..."
            ? { ...msg, text: "Error connecting to AI service." }
            : msg,
        ),
      );
    }
  };

  const handleToggleChatbot = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isOpen && lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div
        className="fixed bottom-5 right-5 p-3 bg-gradient-primary hover:opacity-90 text-white rounded-full cursor-pointer shadow-lg"
        onClick={handleToggleChatbot}
      >
        <span className="text-xl">{isOpen ? "X" : "💬"}</span>
      </div>

      {isOpen && (
        <div
          ref={chatbotRef}
          className="fixed bottom-5 right-5 w-80 h-96 bg-gradient-primary border border-gray-300 rounded-lg shadow-lg"
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <Card
                    key={index}
                    className={`p-2 max-w-[75%] ${msg.sender === "bot" ? "ttext-muted-foreground" : "text-muted-foreground"} hover:border-primary transition-all  rounded-lg`}
                  >
                    {msg.text}
                  </Card>
                </div>
              ))}
              <div ref={lastMessageRef} />
            </div>
            <div className="p-4">
              <div className="relative">
                <Input
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                  className="pr-10"
                />

                <Send
                  onClick={handleSendMessage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 cursor-pointer text-muted-foreground hover:text-primary transition-transform hover:translate-x-1"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
