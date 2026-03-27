import type { Metadata } from "next";
import { Suspense } from "react";
import { ScorecardFunnel } from "./components/scorecard-funnel";

export const metadata: Metadata = {
  title: "Profit Leak Scorecard — CappaWork",
  description:
    "Find the hidden profit leaks in your service business. Free 2-minute assessment for founders doing $3M–$10M.",
  openGraph: {
    title: "Profit Leak Scorecard — CappaWork",
    description:
      "Find the hidden profit leaks in your service business. Free 2-minute assessment.",
  },
};

export default function ScorecardPage() {
  return (
    <Suspense>
      <ScorecardFunnel />
    </Suspense>
  );
}
