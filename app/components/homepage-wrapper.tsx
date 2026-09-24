"use client"

import MarketingShell from "./marketing-shell"

export default function HomepageWrapper({ children }: { children: React.ReactNode }) {
  return <MarketingShell>{children}</MarketingShell>
}
