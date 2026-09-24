import type { Metadata } from "next"
import Navigation from "../components/navigation"
import Footer from "../components/footer"
import PathwayAcquirers from "../components/pathway-acquirers"
import MarketingShell from "../components/marketing-shell"

export const metadata: Metadata = {
  title: "The First 100 Days Build — CappaWork",
  description:
    "After a close, CappaWork maps how the work actually runs and puts a system in place while the organization still expects change.",
}

export default function First100DaysPage() {
  return (
    <MarketingShell>
    <main className="min-h-screen bg-warm-white">
      <Navigation />
      <div className="pt-20">
        <PathwayAcquirers />
      </div>
      <Footer />
    </main>
    </MarketingShell>
  )
}
