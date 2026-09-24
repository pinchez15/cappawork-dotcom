"use client"

import { InquiryProvider } from "./inquiry-modal"
import DesktopProcessOrb from "./desktop-process-orb"

export default function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <InquiryProvider>
      <DesktopProcessOrb />
      {children}
    </InquiryProvider>
  )
}
