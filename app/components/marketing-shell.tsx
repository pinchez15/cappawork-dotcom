"use client"

import { InquiryProvider } from "./inquiry-modal"
import ProcessOrb from "./process-orb"

export default function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <InquiryProvider>
      <ProcessOrb />
      {children}
    </InquiryProvider>
  )
}
