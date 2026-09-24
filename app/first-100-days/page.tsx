import type { Metadata } from "next"
import Navigation from "../components/navigation"
import Footer from "../components/footer"
import PathwayAcquirers from "../components/pathway-acquirers"

export const metadata: Metadata = {
  title: "The First 100 Days — CappaWork",
  description:
    "Just acquired a company that runs on the founder's memory and duct-taped tools? Scope a 6-Week AI Transformation to the first 100 days — starts at $90,000.",
}

export default function First100DaysPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <PathwayAcquirers />
      </div>
      <Footer />
    </main>
  )
}
