"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, MessageCircle } from "lucide-react";
import {
  sendMessageAction,
  markMessagesReadAction,
} from "@/server/actions/messages";

interface Message {
  id: string;
  project_id: string;
  sender_profile_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender: {
    id: string;
    name: string | null;
    email: string;
    is_admin: boolean;
  };
}

interface ProjectMessagesProps {
  projectId: string;
  messages: Message[];
  currentProfileId: string;
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ProjectMessages({
  projectId,
  messages,
  currentProfileId,
}: ProjectMessagesProps) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mark messages as read on mount
  useEffect(() => {
    markMessagesReadAction(projectId).catch(() => {});
  }, [projectId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!content.trim()) return;

    startTransition(async () => {
      await sendMessageAction(projectId, content);
      setContent("");
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Message Thread */}
        <div className="h-96 overflow-y-auto mb-4 space-y-3 p-2">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-stone-400 text-sm">
              No messages yet. Start the conversation.
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.sender_profile_id === currentProfileId;
              const isAdmin = msg.sender?.is_admin;

              return (
                <div
                  key={msg.id}
                  className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      isAdmin
                        ? "bg-blue-600 text-white"
                        : "bg-stone-100 text-stone-900"
                    }`}
                  >
                    <div
                      className={`text-xs mb-1 ${
                        isAdmin ? "text-blue-100" : "text-stone-500"
                      }`}
                    >
                      {msg.sender?.name || msg.sender?.email}
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <div
                      className={`text-xs mt-1 ${
                        isAdmin ? "text-blue-200" : "text-stone-400"
                      }`}
                    >
                      {formatTime(msg.created_at)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="resize-none min-h-[44px]"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!content.trim() || isPending}
            size="icon"
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
