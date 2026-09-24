import type { Metadata } from "next";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import { OfferingPageContent } from "@/app/components/offering-page-content";
import { OfferingPageWrapper } from "@/app/components/offering-page-wrapper";
import { getOffering } from "@/lib/offerings/data";

const offering = getOffering("transformation")!;

export const metadata: Metadata = {
  title: "6-Week AI Transformation — CappaWork",
  description:
    "One department. 2–4 workflows. Production AI agents in six weeks. Starts at $90,000 for businesses over ~$50M revenue. You own the IP.",
  openGraph: {
    title: "6-Week AI Transformation — CappaWork",
    description: offering.outcome,
  },
};

export default function TransformationPage() {
  return (
    <OfferingPageWrapper>
      <main className="min-h-screen bg-warm-white">
        <Navigation />
        <OfferingPageContent offering={offering} />
        <Footer />
      </main>
    </OfferingPageWrapper>
  );
}
