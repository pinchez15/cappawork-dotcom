"use client"

import { Check, ArrowRight } from "lucide-react"

export default function Pricing() {
  // Calendly link for booking calls about full builds
  const calendlyLink = process.env.NEXT_PUBLIC_CALENDLY_LINK || "https://calendly.com/your-link"

  const tiers = [
    {
      name: "Internal Tool — Secure, Modern, Ready for Daily Use",
      price: "$9,900",
      tagline: "Tier 1",
      description: "A full rebuild of your internal tool using modern frameworks, clean architecture, and industry-standard security.",
      idealFor: "Perfect for teams who need a stable, reliable, well-designed tool that their internal staff can use with confidence.",
      features: [
        "Discovery + problem definition",
        "UX workflows + interface upgrades",
        "Clean frontend rebuild (Next.js + Tailwind)",
        "Modern backend + schema",
        "Secure authentication + RBAC",
        "API endpoints + validation",
        "Internal environments + Vercel deploy",
        "Basic admin screens",
        "Error monitoring + logs",
        "30 days of async support",
      ],
      result: "This tier delivers a stable, modern, secure internal tool, built right.",
    },
    {
      name: "Internal Tool — Built for Scale & Long-Term Growth",
      price: "$14,900",
      tagline: "Tier 2",
      description: "Everything in Tier 1, plus the architecture, patterns, and data structures needed to handle real scale and evolving business needs.",
      idealFor: "Ideal for companies running on a mission-critical internal tool that must grow with the business.",
      features: [
        "Everything in Tier 1",
        "Scalable database schema + indexes",
        "Background jobs / queues",
        "Higher-level automation & workflow logic",
        "Multi-tenant foundations (internal only)",
        "Modularized service layers",
        "Performance-optimized API routes",
        "Audit logging + granular permissions",
        "Admin dashboards + deeper reporting",
        "45 days of async iteration",
      ],
      result: "This tier gives you a scale-ready internal system, engineered for the next 3–5 years of growth.",
    },
    {
      name: "Scale-Ready Product — External Users, External Revenue",
      price: "$24,900",
      tagline: "Tier 3",
      description: "Everything in Tier 2, with the system engineered to a production-ready level for external customers, clients, or users at scale.",
      idealFor: "For operators who want to take their internal expertise and turn it into a real product.",
      features: [
        "Everything in Tier 2",
        "Full customer onboarding flows",
        "Public-facing landing page (built + deployed)",
        "Stripe subscription billing + plans",
        "Multi-tenant architecture wired end-to-end",
        "Rate limiting, guardrails, and safety",
        "Optimization for thousands of records & users",
        "Usage analytics + tracking",
        "Documentation (internal + customer-facing)",
        "60 days post-deploy support",
        "Clean foundation for future mobile or API integrations",
      ],
      result: "This tier delivers a commercial-grade product, ready for real users and real revenue.",
    },
  ]

  const handleBookCall = (tierName: string) => {
    window.open(calendlyLink, "_blank", "noopener,noreferrer")
  }

  return (
    <section id="pricing" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-light text-stone-900 mb-4">
            Product Development Services
          </h2>
          <p className="text-lg text-stone-600 max-w-3xl mx-auto mb-4">
            CappaWork builds modern, scalable internal tools and early-stage products for owner-led businesses who want startup-level velocity without hiring a full tech team.
          </p>
          <p className="text-base text-stone-600 max-w-3xl mx-auto">
            All projects follow the same high-quality product development track:<br />
            <span className="font-medium text-stone-700">Discovery → Problem Definition → Architecture → UX → Build → Deploy.</span><br />
            Each pricing tier simply advances farther along that track.
          </p>
          <p className="text-sm text-stone-500 max-w-2xl mx-auto mt-4">
            All tiers are success-based and gated: <span className="font-medium">50% upfront, 50% at deployment.</span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-sm border border-stone-200 hover:border-stone-400 transition-all duration-200 hover:shadow-lg group"
            >
              <div className="mb-6">
                <div className="text-3xl sm:text-4xl font-serif font-light text-stone-900 mb-2">
                  {tier.price}
                </div>
                <div className="text-xs font-medium text-stone-500 mb-2">{tier.tagline}</div>
                <h3 className="text-xl sm:text-2xl font-serif font-medium text-stone-900 mb-3">
                  {tier.name}
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-3">{tier.description}</p>
                <p className="text-sm text-stone-700 italic">{tier.idealFor}</p>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-stone-900 mb-3">Includes:</p>
                <ul className="space-y-2">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 text-sm text-stone-700">
                      <Check className="w-4 h-4 text-stone-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-stone-200 mb-6">
                <p className="text-sm text-stone-700 italic">{tier.result}</p>
              </div>

              <button
                onClick={() => handleBookCall(tier.name)}
                className="w-full group bg-stone-900 text-stone-50 px-6 py-3 rounded-sm font-medium hover:bg-stone-800 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Book a Call
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* Project Path Section */}
        <div className="max-w-4xl mx-auto mt-16 pt-16 border-t border-stone-200">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-serif font-light text-stone-900 mb-4">
              Project Path — All Tiers Follow the Same Track
            </h3>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              No matter the tier, every CappaWork project follows the same clear, gated process:
            </p>
          </div>

          <div className="bg-white p-8 rounded-sm border border-stone-200">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm font-medium text-stone-900 mb-3">The Process:</p>
                <ul className="space-y-2 text-sm text-stone-700">
                  <li className="flex items-start gap-2">
                    <span className="text-stone-400">•</span>
                    <span>discovery — business value + constraints</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-stone-400">•</span>
                    <span>problem definition</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-stone-400">•</span>
                    <span>UX workflows + wireframes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-stone-400">•</span>
                    <span>architecture + schema + system design</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-stone-400">•</span>
                    <span>frontend + backend build</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-stone-400">•</span>
                    <span>deploy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-stone-400">•</span>
                    <span>test, refine, handoff</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-stone-400">•</span>
                    <span>async support</span>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-stone-900 mb-3">The Difference:</p>
                <p className="text-sm text-stone-700 mb-4">
                  The difference between the tiers is how far down the product road each one travels.
                </p>
                <ul className="space-y-3 text-sm text-stone-700">
                  <li>
                    <span className="font-medium text-stone-900">$9,900</span> → reliable internal tool
                  </li>
                  <li>
                    <span className="font-medium text-stone-900">$14,900</span> → scale-ready internal tool
                  </li>
                  <li>
                    <span className="font-medium text-stone-900">$24,900</span> → external-ready product at scale
                  </li>
                </ul>
                <p className="text-sm text-stone-600 mt-4 italic">
                  Payment structure is 50% upfront, 50% at deployment, ensuring alignment and momentum.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

