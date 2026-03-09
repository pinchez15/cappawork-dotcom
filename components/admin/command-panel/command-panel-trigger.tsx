"use client";

import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import { useCommandPanel } from "./command-panel-provider";

export function CommandPanelTrigger() {
  const { toggle } = useCommandPanel();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggle();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

  return (
    <button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 flex items-center justify-center transition-colors hover:shadow-xl"
      aria-label="Open command panel"
    >
      <Sparkles className="h-5 w-5" />
    </button>
  );
}
