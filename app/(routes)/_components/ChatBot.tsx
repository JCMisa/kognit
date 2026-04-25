"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ClayButton, ClayCard } from "@/components/ui-lora/Clay";
import { Send, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    sendMessage({ text: inputValue });
    setInputValue("");
  };

  return (
    <div className="relative flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 20,
              transformOrigin: "bottom right",
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[calc(100vw-32px)] md:w-[400px] z-50"
          >
            <ClayCard className="flex flex-col max-h-[500px] h-[500px] shadow-2xl border-primary/10">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <div className="clay-pill p-1.5 bg-primary/10">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-bold text-sm text-foreground">
                    Kognit AI
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-muted p-1 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Chat Body */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 pb-2"
              >
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-sm font-medium leading-relaxed ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "clay-card-flat border border-border/20"
                      } prose prose-sm dark:prose-invert max-w-none`}
                    >
                      {m.parts.map((part, i) =>
                        part.type === "text" ? (
                          <ReactMarkdown key={i}>{part.text}</ReactMarkdown>
                        ) : null,
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 pt-2"
              >
                <div className="clay-input flex-1 flex items-center px-4 py-2.5">
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Message Kognit..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
                  />
                </div>
                <ClayButton
                  type="submit"
                  disabled={isLoading}
                  className="!p-0 h-10 w-10 flex items-center justify-center !rounded-xl cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </ClayButton>
              </form>
            </ClayCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle (The Circle) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 w-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer ${
          isOpen ? "bg-muted text-foreground" : "bg-muted text-foreground"
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <Image src="/logo.svg" alt="Kognit Logo" width={24} height={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
