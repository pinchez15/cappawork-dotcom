"use client"

import Navigation from "../components/navigation"
import Footer from "../components/footer"
import { DiscoveryForm } from "../components/inquiry-modal"
import MarketingShell from "../components/marketing-shell"
import { GlyphKey, OrbStation } from "../components/process-orb"

export default function ContactPage() {
  return (
    <MarketingShell>
    <main className="min-h-screen bg-warm-white">
      <Navigation />
      <div className="pt-24 pb-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlyphKey className="mb-8" />
          <div className="rounded-2xl border border-card-border bg-card-light p-7 sm:p-10">
            <div className="mb-3 flex items-center gap-3">
              <OrbStation kind="agent" label="Where the work is slow" />
              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-gold">
                Contact
              </p>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl tracking-tight text-navy leading-tight">
              Book a discovery call
            </h1>
            <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed">
              Tell us where the operation is slow. We will tell you whether the work should change, and whether an agent belongs in it.
            </p>
            <div className="mt-8">
              <div className="mb-4">
                <OrbStation kind="human" label="Discovery call" />
              </div>
              <DiscoveryForm idPrefix="contact" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
    </MarketingShell>
  )
}
