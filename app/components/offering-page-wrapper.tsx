"use client";

import { InquiryProvider } from "@/app/components/inquiry-modal";

export function OfferingPageWrapper({ children }: { children: React.ReactNode }) {
  return <InquiryProvider>{children}</InquiryProvider>;
}
