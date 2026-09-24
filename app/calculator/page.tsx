import type { Metadata } from "next";
import { ProfitCalculator } from "@/app/components/profit-calculator";

export const metadata: Metadata = {
  title: "AI Capacity Calculator — CappaWork",
  description:
    "See how many more customers your team can serve with AI. 2-minute assessment for businesses over ~$50M revenue.",
};

export default function CalculatorPage() {
  return <ProfitCalculator />;
}
