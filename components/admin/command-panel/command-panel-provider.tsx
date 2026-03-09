"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { CommandContext, Message } from "./types";

type CommandPanelState = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  context: CommandContext | null;
  setContext: (ctx: CommandContext | null) => void;
  messages: Message[];
  addMessage: (msg: Message) => void;
  clearMessages: () => void;
};

const CommandPanelContext = createContext<CommandPanelState | null>(null);

export function CommandPanelProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState<CommandContext | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  const addMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <CommandPanelContext.Provider
      value={{
        open,
        setOpen,
        toggle,
        context,
        setContext,
        messages,
        addMessage,
        clearMessages,
      }}
    >
      {children}
    </CommandPanelContext.Provider>
  );
}

export function useCommandPanel() {
  const ctx = useContext(CommandPanelContext);
  if (!ctx) throw new Error("useCommandPanel must be used within CommandPanelProvider");
  return ctx;
}
