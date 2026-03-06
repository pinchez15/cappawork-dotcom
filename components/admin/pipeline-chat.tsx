"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function PipelineChat() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/admin/bd-deals/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      if (res.ok) {
        const assistantMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.message,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        router.refresh();
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: `Something went wrong: ${data.error || "try again."}`,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Network error — check your connection and try again.",
        },
      ]);
    }

    setSending(false);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <div className="border border-stone-200 rounded-xl bg-white shadow-sm overflow-hidden">
      {/* Messages area */}
      {messages.length > 0 && (
        <div className="max-h-[240px] overflow-y-auto p-3 space-y-2 border-b border-stone-100">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`text-sm rounded-lg px-3 py-2 max-w-[85%] ${
                msg.role === "user"
                  ? "bg-[#0a1628] text-white ml-auto"
                  : "bg-stone-50 text-stone-700"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {sending && (
            <div className="flex items-center gap-2 text-xs text-stone-400 px-3 py-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              Creating deal...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2 p-3">
        <div className="flex-1 relative">
          {messages.length === 0 && (
            <div className="absolute left-3 top-2.5 flex items-center gap-1.5 text-stone-300 pointer-events-none">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
          )}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Add a lead — "John Smith, CEO of Acme Services, found on Sales Nav" or paste a LinkedIn profile'
            rows={1}
            className={`w-full resize-none rounded-lg border border-stone-200 bg-stone-50 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 py-2.5 pr-3 ${
              messages.length === 0 ? "pl-9" : "pl-3"
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-stone-200 disabled:text-stone-400 transition-colors"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
