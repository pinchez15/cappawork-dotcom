import type { Metadata } from "next";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import { OfferingPageWrapper } from "@/app/components/offering-page-wrapper";
import { RoadmapContent } from "./roadmap-content";

const title = "The AI Opportunity Roadmap | CappaWork";
const description =
  "The 5 to 10 AI projects worth doing in your business, ranked and priced. $1,500, credited in full toward your build.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
};

export default function DiscoverPage() {
  return (
    <OfferingPageWrapper>
      <main className="min-h-screen bg-warm-white">
        <Navigation />
        <RoadmapContent />
        <Footer />
      </main>
    </OfferingPageWrapper>
  );
}
