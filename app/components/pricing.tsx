"use client"

import { Check } from "lucide-react"
import { useState } from "react"
import ContactForm from "./contact-form"

export default function Pricing() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  const openContactForm = (tierName: string) => {
    setSelectedTier(tierName)
    setIsContactFormOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeContactForm = () => {
    setIsContactFormOpen(false)
    setSelectedTier(null)
    document.body.style.overflow = "unset"
  }

  const tiers = [
    {
      name: "Internal Tool Rescue",
      price: "$5,000",
      tagline: "Stabilize what you already rely on.",
      description: "For homegrown tools, vibe-coded apps, and duct-taped workflows that \"technically work\" but stress everyone out.",
      features: [
        "Architecture + UX audit",
        "Critical bug fixes",
        "Cleaner, faster interface",
        "Backend + database corrections",
        "Auth + validation cleanup",
        "Light brand/design improvements",
        "A 90-day roadmap",
        "1 week of async support",
      ],
      result: "A tool your team can actually trust.",
    },
    {
      name: "Internal System Rebuild",
      price: "$10,000",
      tagline: "Rebuild your core system the right way—fast.",
      description: "For internal tools that matter to the business and need to be rebuilt on a modern, scalable foundation.",
      features: [
        "Everything in the $5K package",
        "Full UI rebuild (Next.js + Tailwind)",
        "Backend rebuild with clean schema",
        "Automations + workflow improvements",
        "Admin dashboards + reporting (built from business experience)",
        "Role-based access, middleware, and API logic",
        "Multi-tenant foundations for future use",
        "Vercel deployment",
        "30 days of async iteration",
        "Branding and naming options",
      ],
      result: "A stable, intuitive internal system that boosts productivity instead of draining it.",
    },
    {
      name: "External-Ready Foundation",
      price: "$15,000",
      tagline: "Turn an internal tool into a future revenue line.",
      description: "For entrepreneurs with expertise, access to a niche, or early customer demand.",
      features: [
        "Everything in the $10K package",
        "Full brand identity (logo, name, color system)",
        "Market-ready landing page (built + deployed)",
        "Customer onboarding flows",
        "Stripe subscription billing (hidden until go-live)",
        "Multi-tenant architecture wired end-to-end",
        "Analytics + logging",
        "Guardrails for customer safety",
        "Documentation for internal + external support",
        "Monetization + launch roadmap",
        "60 days of support + revisions",
      ],
      result: "A product built on real operational proof—ready to scale when you are.",
    },
  ]

  return (
    <>
      <section id="pricing" className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-stone-900 mb-4">
              Three Tiers
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Built for Internal Clarity Now.<br />
              Prepared for External Scale Later.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {tiers.map((tier, index) => (
              <div
                key={index}
                onClick={() => openContactForm(tier.name)}
                className="bg-white p-8 rounded-sm border border-stone-200 hover:border-stone-400 transition-all duration-200 hover:shadow-lg cursor-pointer group"
              >
                <div className="mb-6">
                  <div className="text-3xl sm:text-4xl font-serif font-light text-stone-900 mb-2">
                    {tier.price}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-medium text-stone-900 mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-sm font-medium text-stone-700 mb-3">{tier.tagline}</p>
                  <p className="text-sm text-stone-600 leading-relaxed">{tier.description}</p>
                </div>

                <div className="mb-6">
                  <p className="text-sm font-medium text-stone-900 mb-3">You get:</p>
                  <ul className="space-y-2">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-sm text-stone-700">
                        <Check className="w-4 h-4 text-stone-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-stone-200">
                  <p className="text-sm font-medium text-stone-900 mb-1">Result:</p>
                  <p className="text-sm text-stone-700 italic">{tier.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ContactForm isOpen={isContactFormOpen} onClose={closeContactForm} selectedTier={selectedTier || undefined} />
    </>
  )
}

