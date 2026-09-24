"use client";

import MarketingShell from "@/app/components/marketing-shell";

export function OfferingPageWrapper({ children }: { children: React.ReactNode }) {
  return <MarketingShell>{children}</MarketingShell>;
}
