import type { Metadata } from "next"
import Navigation from "../components/navigation"
import Footer from "../components/footer"
import PathwayAcquirers from "../components/pathway-acquirers"

export const metadata: Metadata = {
  title: "The First 100 Days Build — CappaWork",
  description:
    "After a close, CappaWork maps how the work actually runs and puts a system in place while the organization still expects change.",
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
