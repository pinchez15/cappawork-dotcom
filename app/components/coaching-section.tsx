"use client"

import { useState } from "react"
import { ArrowRight, X, Check, Loader2 } from "lucide-react"
import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"

const coachingOffers = [
  {
    id: "ai-strategy-advisor",
    name: "AI Strategy Advisor",
    subtitle: "retained · C-suite · under NDA",
    price: "$2,000/hour",
    description:
      "A retained advisor in your corner — behind an NDA, embedded with your leadership team, looking for what you can't see. You get someone who builds AI products full-time and has spent a career in business strategy, with no incentive other than making you right. Typical engagement: 3–6 months.",
    details: [
      {
        label: "Embedded, not external.",
        text: "I work under NDA as part of your leadership team — not as an outside consultant giving advice from a distance. I see what you see, and I look for what you can't.",
      },
      {
        label: "Strategy meets execution.",
        text: "MBA, 15 years of experience, C-suite strategy work up to $2B+ companies — combined with hands-on AI product building every day. Not theory. Practice.",
      },
      {
        label: "Typical engagement: 3–6 months.",
        text: "Long enough to see around corners. Short enough to stay focused. You get an advisor whose only job is to be honest, informed, and looking out for your business.",
      },
    ],
  },
  {
    id: "ai-vp-cohort",
    name: "AI VP Cohort",
    subtitle: "per person · 6 weeks · 10–15 per cohort",
    price: "$3,500",
    description:
      "Six-week small-group program for leaders who don't build but need to understand what's being built. You'll learn what the models actually are, how they differ, what tools like Claude Code do, what's safe and what's not, and how to evaluate AI investments your team is making — so you stop nodding along in meetings and start making informed decisions.",
    details: [
      {
        label: "Before we start,",
        text: "you take a short survey rating your familiarity with AI tools and concepts. This calibrates the curriculum to the room so nobody's bored and nobody's lost.",
      },
      {
        label: "Six weekly sessions,",
        text: "structured curriculum plus open Q&A that runs until every question is answered. All sessions recorded.",
      },
      {
        label: "You leave with",
        text: "the fluency to evaluate AI investments, ask the right questions, and make informed decisions — not the ability to code, but the judgment to lead.",
      },
    ],
  },
]

export default function CoachingSection() {
  const [selectedOffer, setSelectedOffer] = useState<typeof coachingOffers[number] | null>(null)
  const [showForm, setShowForm] = useState(false)

  const closeModal = () => {
    setSelectedOffer(null)
    setShowForm(false)
  }

  return (
    <>
      <section id="coaching" className="py-24 bg-navy">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
              Coaching
            </span>
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-white leading-tight mb-4">
              Not ready for the full engagement?
            </h2>
            <p className="text-lg text-white/70 leading-relaxed mb-16 max-w-3xl">
              As a leader, you need to be fluent in AI from top to bottom — so you can make great decisions quickly. I can coach you.
            </p>
          </FadeInUp>

          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {coachingOffers.map((offer) => (
              <StaggerItem key={offer.id}>
                <button
                  onClick={() => setSelectedOffer(offer)}
                  className="group flex flex-col h-full w-full text-left p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-sm font-semibold tracking-widest uppercase text-gold mb-3">
                    {offer.price}
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight text-white mb-2">
                    {offer.name}
                  </h3>
                  <p className="text-sm text-white/60 mb-1">
                    {offer.subtitle}
                  </p>
                  <p className="mt-3 text-white/70 text-sm leading-relaxed flex-1">
                    {offer.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold group-hover:gap-3 transition-all">
                    Learn more
                    <ArrowRight size={14} />
                  </span>
                </button>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Modal */}
      {selectedOffer && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm px-4 py-8 sm:py-16"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal()
          }}
        >
          <div className="relative w-full max-w-2xl bg-warm-white text-navy rounded-2xl shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-200 transition-colors z-10"
              aria-label="Close"
            >
              <X size={20} className="text-stone-500" />
            </button>

            <div className="p-8 sm:p-10">
              {!showForm ? (
                <OfferDetails offer={selectedOffer} onShowForm={() => setShowForm(true)} />
              ) : (
                <InquiryForm offer={selectedOffer} onClose={closeModal} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function OfferDetails({
  offer,
  onShowForm,
}: {
  offer: typeof coachingOffers[number]
  onShowForm: () => void
}) {
  return (
    <>
      <span className="text-xs font-semibold tracking-widest uppercase text-gold block mb-3">
        {offer.price}
      </span>
      <h2 className="font-display text-3xl sm:text-4xl font-normal leading-tight tracking-tight mb-2">
        {offer.name}
      </h2>
      <p className="text-sm text-stone-500 mb-4">{offer.subtitle}</p>
      <p className="text-stone-600 leading-relaxed mb-8">{offer.description}</p>

      <div className="mb-8">
        <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-4">
          How it works
        </span>
        {offer.details.map((item, i) => (
          <div
            key={i}
            className="py-3 border-b border-card-border first:border-t text-sm leading-relaxed"
          >
            <strong className="font-semibold">{item.label}</strong> {item.text}
          </div>
        ))}
      </div>

      <button
        onClick={onShowForm}
        className="w-full bg-gold text-navy py-4 rounded-full font-semibold text-lg hover:bg-gold/90 transition-all flex items-center justify-center gap-2"
      >
        Let&rsquo;s Go
        <ArrowRight size={18} />
      </button>
    </>
  )
}

function InquiryForm({
  offer,
  onClose,
}: {
  offer: typeof coachingOffers[number]
  onClose: () => void
}) {
  const [email, setEmail] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      const res = await fetch("/api/service-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          linkedin: linkedin.trim(),
          service: offer.name,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Something went wrong")
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 mb-6">
          <Check size={28} className="text-green-600" />
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-normal tracking-tight mb-3">
          Got it — I&rsquo;ll be in touch
        </h2>
        <p className="text-stone-600 mb-8">
          Expect a LinkedIn message from me shortly to discuss {offer.name}.
        </p>
        <button
          onClick={onClose}
          className="text-sm font-medium text-stone-500 hover:text-navy transition-colors"
        >
          Close
        </button>
      </div>
    )
  }

  return (
    <>
      <span className="text-xs font-semibold tracking-widest uppercase text-gold block mb-3">
        {offer.price}
      </span>
      <h2 className="font-display text-2xl sm:text-3xl font-normal tracking-tight mb-2">
        Interested in {offer.name}?
      </h2>
      <p className="text-stone-600 mb-8">
        Drop your details and I&rsquo;ll reach out via LinkedIn to get things moving.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="inquiry-email" className="mb-1 block text-sm font-medium text-stone-700">
            Email
          </label>
          <input
            id="inquiry-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-navy placeholder:text-stone-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
        </div>

        <div>
          <label htmlFor="inquiry-linkedin" className="mb-1 block text-sm font-medium text-stone-700">
            LinkedIn username or profile URL
          </label>
          <input
            id="inquiry-linkedin"
            type="text"
            required
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="janedoe or linkedin.com/in/janedoe"
            className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-navy placeholder:text-stone-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gold text-navy py-4 rounded-full font-semibold text-lg hover:bg-gold/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Let&rsquo;s Go
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </>
  )
}
