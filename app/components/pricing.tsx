"use client"

import { Check, ArrowRight } from "lucide-react"

export default function Services() {
  const calendlyLink = process.env.NEXT_PUBLIC_CALENDLY_LINK || "https://calendly.com/cappawork/discovery_call"

  const handleBookCall = (tierName: string) => {
    window.open(calendlyLink, "_blank", "noopener,noreferrer")
  }

  const services = [
    {
      name: "Internal Tool",
      price: "$9,900",
      description: "Secure, modern, ready for daily use.",
      detail: "A full rebuild using modern frameworks and clean architecture.",
      features: [
        "Discovery + Architecture",
        "Clean UI/UX Rebuild",
        "Secure Auth + RBAC",
        "30 Days Support"
      ],
      cta: "Book Call",
      color: "blue"
    },
    {
      name: "Scale-Ready System",
      price: "$14,900",
      description: "Built for growth & complexity.",
      detail: "The architecture, patterns, and data structures needed to handle real scale.",
      features: [
        "Everything in Internal Tool",
        "Scalable DB Schema",
        "PostHog product analytics",
        "45 Days of support & maintenance"
      ],
      cta: "Book Call",
      color: "indigo"
    },
    {
      name: "Commercial Product",
      price: "$24,900",
      description: "External users & revenue ready.",
      detail: "Engineered to a production-ready level for external customers.",
      features: [
        "Everything in Scale-Ready",
        "Stripe Billing Integration",
        "AI Workflow Integration",
        "Public Landing Page"
      ],
      cta: "Book Call",
      color: "purple"
    }
  ]

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-stone-900 mb-6">
            Need help? We can build your app for you.
          </h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            Choose the path that fits your stage. 50% upfront, 50% on deployment.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group flex flex-col p-8 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="mb-6">
                 <div className="text-sm font-semibold text-stone-500 mb-2 uppercase tracking-wide">
                   {service.name}
                 </div>
                 <div className="text-xs text-stone-500 mb-1">Starting at</div>
                 <div className="text-4xl font-semibold tracking-tight text-stone-900 mb-4">
                   {service.price}
                 </div>
                 <p className="text-lg font-medium text-stone-900 mb-2">
                   {service.description}
                 </p>
                 <p className="text-stone-600 leading-relaxed text-sm">
                   {service.detail}
                 </p>
              </div>

              <div className="flex-grow mb-8">
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-stone-700">
                      <div className="w-5 h-5 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-stone-700" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleBookCall(service.name)}
                className="w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {service.cta}
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

