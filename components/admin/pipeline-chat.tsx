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
    <div className="border border-stone-200 rounded-xl bg-white shadow-sm">
      {/* Label */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        <Sparkles className="h-4 w-4 text-stone-400" />
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          Quick Add
        </span>
      </div>

      {/* Conversation history — pinned above input */}
      {messages.length > 0 && (
        <div className="max-h-[240px] overflow-y-auto px-4 pb-3 space-y-2">
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

      {/* Input — always at bottom */}
      <form
        onSubmit={handleSubmit}
        className={`px-4 pb-3 ${messages.length > 0 ? "border-t border-stone-100 pt-3" : ""}`}
      >
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={'Describe a lead, paste a LinkedIn profile or email, or just drop a name and company.\n\ne.g. "John Smith, CEO of Acme Services, $5M revenue, found on Sales Nav"'}
            rows={4}
            className="w-full resize-none rounded-lg border border-stone-200 bg-stone-50 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 p-3 pr-12"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="absolute right-2 bottom-2 h-8 w-8 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-stone-200 disabled:text-stone-400 transition-colors"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
