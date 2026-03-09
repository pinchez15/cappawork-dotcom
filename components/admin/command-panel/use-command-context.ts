"use client";

import { useEffect } from "react";
import { useCommandPanel } from "./command-panel-provider";
import type { CommandContext } from "./types";

export function useCommandContext(ctx: CommandContext) {
  const { setContext } = useCommandPanel();

  useEffect(() => {
    setContext(ctx);
    return () => setContext(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.page, ctx.summary, setContext]);
}
