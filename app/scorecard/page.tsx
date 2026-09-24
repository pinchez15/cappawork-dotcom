import type { Metadata } from "next";
import { Suspense } from "react";
import { ScorecardFunnel } from "./components/scorecard-funnel";

export const metadata: Metadata = {
  title: "Profit Leak Scorecard — CappaWork",
  description:
    "Find where Computer Work is crowding out Human Work. Free 2-minute assessment for operators at businesses over ~$50M revenue.",
  openGraph: {
    title: "Profit Leak Scorecard — CappaWork",
    description:
      "Find where Computer Work is crowding out Human Work. Free 2-minute assessment for ~$50M+ businesses.",
  },
};

export default function ScorecardPage() {
  return (
    <Suspense>
      <ScorecardFunnel />
    </Suspense>
  );
}
