import type { Metadata } from "next"
import Navigation from "../components/navigation"
import Footer from "../components/footer"
import PathwayAcquirers from "../components/pathway-acquirers"

export const metadata: Metadata = {
  title: "The First 100 Days Build — CappaWork",
  description:
    "You acquired a company that runs on the founder's memory and a stack of duct-taped tools. CappaWork modernizes the operating system in the first 100 days.",
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
