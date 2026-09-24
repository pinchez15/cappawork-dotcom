import type { Metadata } from "next";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import { OfferingPageContent } from "@/app/components/offering-page-content";
import { OfferingPageWrapper } from "@/app/components/offering-page-wrapper";
import { getOffering } from "@/lib/offerings/data";

const offering = getOffering("modernize")!;

export const metadata: Metadata = {
  title: "Modernize Retainer — CappaWork",
  description:
    "Optional post-Transformation retainer: unlimited fixes on shipped work plus one new workflow per month. Scoped after go-live.",
  openGraph: {
    title: "Modernize Retainer — CappaWork",
    description: offering.outcome,
  },
};

export default function ModernizePage() {
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
