"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface ActivityTrackerProps {
  projectId: string;
}

export function ActivityTracker({ projectId }: ActivityTrackerProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Fire-and-forget page view tracking
    fetch("/api/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, projectId }),
    }).catch(() => {
      // Silently fail — tracking should never block the user
    });
  }, [pathname, projectId]);

  return null;
}
