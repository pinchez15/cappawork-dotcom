"use client"

import { InquiryProvider } from "./inquiry-modal"

export default function HomepageWrapper({ children }: { children: React.ReactNode }) {
  return <InquiryProvider>{children}</InquiryProvider>
}
