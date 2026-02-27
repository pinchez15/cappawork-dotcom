"use client"

import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Navigation from "../components/navigation"
import Footer from "../components/footer"
import { FadeInUp, StaggerContainer, StaggerItem } from "../components/motion-wrapper"

const calendlyLink =
  process.env.NEXT_PUBLIC_CALENDLY_LINK || "https://calendly.com/cappawork/discovery_call"

function handleBookCall() {
  window.open(calendlyLink, "_blank", "noopener,noreferrer")
}

/* ─── Section 1: Hero ─── */
function TransformationHero() {
  return (
    <section className="relative min-h-[80svh] flex items-center bg-navy pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-sm font-semibold tracking-widest uppercase text-gold block mb-6"
        >
          AI Transformation
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight text-white mb-6 leading-[1.1]"
        >
          Process. Profit. People.{" "}
          <br className="hidden md:block" />
          In that order.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
          className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          We help founder-led service businesses transform their operations with AI — so your team can stop doing busywork and start doing their best work.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <button
            onClick={handleBookCall}
            className="bg-gold text-navy px-8 py-3.5 rounded-full font-medium hover:bg-gold/90 transition-all duration-200 inline-flex items-center gap-2 text-lg"
          >
            Book a Diagnostic Call
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── Section 2–4: Pillar Sections ─── */
function PillarSection({
  number,
  label,
  headline,
  paragraphs,
  items,
  dark,
}: {
  number: string
  label: string
  headline: string
  paragraphs: string[]
  items: string[]
  dark: boolean
}) {
  return (
    <section className={`py-24 ${dark ? "bg-navy" : "bg-warm-white"}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className={`font-display text-6xl md:text-7xl ${dark ? "text-white/10" : "text-navy/10"} block mb-4`}>
            {number}
          </span>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            {label}
          </span>
          <h2 className={`font-display text-3xl sm:text-4xl tracking-tight ${dark ? "text-white" : "text-navy"} leading-tight mb-8`}>
            {headline}
          </h2>

          <div className={`text-lg ${dark ? "text-white/70" : "text-stone-600"} leading-relaxed space-y-6 mb-10`}>
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <StaggerContainer className="space-y-4">
            {items.map((item, i) => (
              <StaggerItem key={i}>
                <div className={`flex items-start gap-3 ${dark ? "text-white/70" : "text-stone-700"}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </FadeInUp>
      </div>
    </section>
  )
}

/* ─── Section 5: Why You Need Us ─── */
function WhyYouNeedUs() {
  const points = [
    "You've tried hiring. Headcount solves today's problem and creates tomorrow's.",
    "You've tried software. More tools means more complexity, not less.",
    "You've tried consultants. They leave you with a deck and a handshake.",
    "You need someone who understands your operations AND can build the systems to fix them.",
  ]

  return (
    <section className="py-24 bg-navy">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            Why Us
          </span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-white leading-tight mb-12">
            You&apos;ve tried the alternatives. Here&apos;s why they didn&apos;t work.
          </h2>
        </FadeInUp>

        <StaggerContainer className="space-y-8">
          {points.map((point, i) => (
            <StaggerItem key={i}>
              <p className="text-xl md:text-2xl text-white/80 font-medium leading-relaxed">
                {point}
              </p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

/* ─── Section 6: What We Do (Services Grid) ─── */
function WhatWeDoGrid() {
  const services = [
    {
      title: "Workflow Mapping",
      description: "We map every step of your operations to find where time and money leak.",
    },
    {
      title: "AI Automation",
      description: "We automate the repetitive work — data entry, follow-ups, reporting, scheduling.",
    },
    {
      title: "Systems Integration",
      description: "We connect your tools so data flows once, not five times.",
    },
    {
      title: "Custom Platforms",
      description: "When off-the-shelf doesn't fit, we build exactly what your workflow needs.",
    },
    {
      title: "Financial Modeling",
      description: "We tie every recommendation to dollar impact so you can make informed decisions.",
    },
    {
      title: "Team Enablement",
      description: "We train your team to use the new systems so adoption sticks.",
    },
  ]

  return (
    <section className="py-24 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <div className="max-w-3xl mb-16">
            <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
              What We Do
            </span>
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-navy leading-tight">
              Six capabilities. One goal: make your operations earn more with less friction.
            </h2>
          </div>
        </FadeInUp>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <StaggerItem key={service.title}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-card-light border border-card-border rounded-2xl p-8 h-full"
              >
                <h3 className="text-xl font-semibold text-navy mb-3">
                  {service.title}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

/* ─── Section 7: Final CTA ─── */
function TransformationCTA() {
  return (
    <section className="py-24 bg-navy">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeInUp>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white mb-6 leading-tight">
            Ready to make work human again?
          </h2>
          <p className="text-lg text-white/70 mb-10 leading-relaxed">
            Start with a 30-minute diagnostic call. We&apos;ll look at your numbers, your workflows, and your team — and tell you honestly whether we can help.
          </p>
          <button
            onClick={handleBookCall}
            className="bg-gold text-navy px-8 py-3.5 rounded-full font-medium hover:bg-gold/90 transition-all duration-200 inline-flex items-center gap-2 text-lg"
          >
            Book a Diagnostic Call
            <ArrowRight size={18} />
          </button>
        </FadeInUp>
      </div>
    </section>
  )
}

/* ─── Page ─── */
export default function TransformationPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <TransformationHero />

      <PillarSection
        number="01"
        label="Process"
        headline="First, we fix the plumbing."
        dark={false}
        paragraphs={[
          "Before you can automate anything, you need to understand how work actually flows through your business — not how you think it does, but how it actually does.",
          "We map every workflow end-to-end, identify the bottlenecks, and quantify the cost of each one in dollars and hours.",
        ]}
        items={[
          "End-to-end workflow mapping against actual cost",
          "Software stack audit and ROI analysis",
          "Bottleneck identification with dollar impact",
          "Automation opportunity scoring",
        ]}
      />

      <PillarSection
        number="02"
        label="Profit"
        headline="Then, we make the math work."
        dark={true}
        paragraphs={[
          "Every recommendation we make is tied to a number. Not 'this will improve efficiency' — but 'this will save 14 hours per week and $85K annually.'",
          "We model your unit economics, your revenue per employee, and your margin by segment so you can see exactly where the leverage is.",
        ]}
        items={[
          "Revenue and margin analysis by segment",
          "Revenue per employee modeling toward $10M",
          "ROI projections for each automation opportunity",
          "Prioritized roadmap ranked by dollar impact",
        ]}
      />

      <PillarSection
        number="03"
        label="People"
        headline="Finally, we elevate your team."
        dark={false}
        paragraphs={[
          "The goal was never to replace your people. It's to give them back the hours they're wasting on work that doesn't require their expertise.",
          "When your senior account manager stops spending 2 hours a day on data entry, they spend it on client relationships. That's where growth comes from.",
        ]}
        items={[
          "AI-assisted workflows that eliminate repetitive tasks",
          "Team training and adoption support",
          "Change management for new systems",
          "Ongoing measurement of time saved and impact realized",
        ]}
      />

      <WhyYouNeedUs />
      <WhatWeDoGrid />
      <TransformationCTA />
      <Footer />
    </main>
  )
}
