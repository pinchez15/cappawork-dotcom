import type { Metadata } from "next";
import { ProfitCalculator } from "@/app/components/profit-calculator";

export const metadata: Metadata = {
  title: "AI Capacity Calculator — CappaWork",
  description:
    "See how many more customers your team can serve with AI. 2-minute assessment for founder-led service businesses doing $3M–$10M.",
};

export default function CalculatorPage() {
  return <ProfitCalculator />;
}
