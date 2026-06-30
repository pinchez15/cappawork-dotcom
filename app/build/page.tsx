import type { Metadata } from "next";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import { OfferingPageContent } from "@/app/components/offering-page-content";
import { OfferingPageWrapper } from "@/app/components/offering-page-wrapper";
import { getOffering } from "@/lib/offerings/data";

const offering = getOffering("build")!;

export const metadata: Metadata = {
  title: "Build — CappaWork",
  description: offering.subtitle,
  openGraph: {
    title: "Build — CappaWork",
    description: offering.outcome,
  },
};

export default function BuildPage() {
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
