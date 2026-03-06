import type { Metadata } from "next";
import { ProfitCalculator } from "@/app/components/profit-calculator";

export const metadata: Metadata = {
  title: "AI Opportunity Calculator — CappaWork",
  description:
    "See how much profit your service business is leaving on the table. 2-minute assessment for founder-led companies doing $3M–$10M.",
};

export default function CalculatorPage() {
  return <ProfitCalculator />;
}
