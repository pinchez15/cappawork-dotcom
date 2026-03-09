"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send, Sparkles, Loader2, RotateCcw } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCommandPanel } from "./command-panel-provider";

export function CommandPanel() {
  const router = useRouter();
  const { open, setOpen, context, messages, addMessage, clearMessages } =
    useCommandPanel();
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) {
      // Small delay to let Sheet animation start before focusing
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const userMsg = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content: text,
    };
    addMessage(userMsg);
    setInput("");
    setSending(true);

    try {
      // Send last 10 messages for conversation context
      const recentMessages = [...messages, userMsg].slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/admin/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: recentMessages,
          context: context
            ? {
                page: context.page,
                summary: context.summary,
                capabilities: context.capabilities,
              }
            : null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        addMessage({
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.message,
        });
        if (data.action_taken) {
          router.refresh();
        }
      } else {
        addMessage({
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Something went wrong: ${data.error || "try again."}`,
        });
      }
    } catch {
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Network error — check your connection and try again.",
      });
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

  const contextLabel = context?.page
    ? context.page.charAt(0).toUpperCase() + context.page.slice(1)
    : null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="w-full sm:w-3/4 sm:max-w-md flex flex-col p-0"
      >
        {/* Header */}
        <SheetHeader className="px-4 py-3 border-b space-y-0">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <SheetTitle className="text-base font-semibold">
              Command
            </SheetTitle>
            {contextLabel && (
              <Badge
                variant="secondary"
                className="text-[10px] font-medium"
              >
                {contextLabel}
              </Badge>
            )}
            <div className="flex-1" />
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-stone-400 hover:text-stone-600"
                onClick={clearMessages}
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <SheetDescription className="sr-only">
            AI command panel for managing prospects, deals, and catalysts
          </SheetDescription>
        </SheetHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {messages.length === 0 && (
            <div className="text-center py-12 text-stone-400">
              <Sparkles className="h-8 w-8 mx-auto mb-3 text-stone-300" />
              <p className="text-sm font-medium mb-1">
                What would you like to do?
              </p>
              <p className="text-xs text-stone-400">
                Create records, query data, or update stages
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`text-sm rounded-lg px-3 py-2 max-w-[85%] whitespace-pre-wrap ${
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
              Thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="border-t px-4 py-3"
        >
          <div className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a prospect, query deals, update a stage..."
              rows={2}
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
          <div className="flex items-center justify-between mt-1.5 px-1">
            <span className="text-[10px] text-stone-400">
              Enter to send, Shift+Enter for new line
            </span>
            <span className="text-[10px] text-stone-400">
              {"\u2318"}K to toggle
            </span>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
