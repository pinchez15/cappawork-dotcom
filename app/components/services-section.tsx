"use client"

import { useState } from "react"
import { ArrowRight, X, Check, Loader2 } from "lucide-react"
import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"
import { SERVICES, type Service } from "../services/data"

function ServiceCard({
  service,
  onClick,
}: {
  service: Service
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col h-full w-full text-left p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
    >
      <span className="text-sm font-semibold tracking-widest uppercase text-gold mb-3">
        {service.price}
      </span>
      <h3 className="text-xl font-semibold tracking-tight text-white mb-2">
        {service.title}
      </h3>
      <p className="text-sm text-white/60 mb-1">
        {service.priceNote}
      </p>
      <p className="mt-3 text-white/70 text-sm leading-relaxed flex-1">
        {service.cardDescription}
      </p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold group-hover:gap-3 transition-all">
        Learn more
        <ArrowRight size={14} />
      </span>
    </button>
  )
}

export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showForm, setShowForm] = useState(false)

  const closeModal = () => {
    setSelectedService(null)
    setShowForm(false)
  }

  const coachingServices = SERVICES.filter((s) => s.section === "coaching")
  const auditBuildServices = SERVICES.filter((s) => s.section === "audit-build")
  const trainingServices = SERVICES.filter((s) => s.section === "training")

  return (
    <>
      <section id="services" className="py-24 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Header */}
          <FadeInUp>
            <div className="max-w-3xl mb-20">
              <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
                Ways to Work Together
              </span>
              <p className="font-display text-2xl sm:text-3xl text-white leading-relaxed">
                AI is transforming the world, whether you like it or not. It will upend your business. The question is whether you lead the change or get run over by it.
              </p>
            </div>
          </FadeInUp>

          {/* Section 1: Coaching */}
          <div className="mb-20">
            <FadeInUp>
              <p className="text-lg text-white/70 mb-8 max-w-3xl">
                As a leader, you need to be fluent in AI from top to bottom — so you can make great decisions quickly. I can coach you.
              </p>
            </FadeInUp>
            <StaggerContainer className="grid md:grid-cols-2 gap-6">
              {coachingServices.map((service) => (
                <StaggerItem key={service.slug}>
                  <ServiceCard service={service} onClick={() => setSelectedService(service)} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* Section 2: Audit & Build */}
          <div className="mb-20">
            <FadeInUp>
              <p className="text-lg text-white/70 mb-8 max-w-3xl">
                Your workflow will change — either your competitors will do it faster and better with AI, or you will. I can find the leverage and code it for you.
              </p>
            </FadeInUp>
            <StaggerContainer className="grid md:grid-cols-2 gap-6">
              {auditBuildServices.map((service) => (
                <StaggerItem key={service.slug}>
                  <ServiceCard service={service} onClick={() => setSelectedService(service)} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* Section 3: Training */}
          <div>
            <FadeInUp>
              <p className="text-lg text-white/70 mb-8 max-w-3xl">
                Your team will need to upskill to see new opportunities and use AI well. I can train them.
              </p>
            </FadeInUp>
            <StaggerContainer className="grid md:grid-cols-2 gap-6">
              {trainingServices.map((service) => (
                <StaggerItem key={service.slug}>
                  <ServiceCard service={service} onClick={() => setSelectedService(service)} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedService && (
        <ServiceModal
          service={selectedService}
          showForm={showForm}
          onShowForm={() => setShowForm(true)}
          onClose={closeModal}
        />
      )}
    </>
  )
}

function ServiceModal({
  service,
  showForm,
  onShowForm,
  onClose,
}: {
  service: Service
  showForm: boolean
  onShowForm: () => void
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm px-4 py-8 sm:py-16"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-2xl bg-warm-white text-navy rounded-2xl shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-200 transition-colors z-10"
          aria-label="Close"
        >
          <X size={20} className="text-stone-500" />
        </button>

        <div className="p-8 sm:p-10">
          {!showForm ? (
            <ServiceDetails service={service} onShowForm={onShowForm} />
          ) : (
            <InquiryForm service={service} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  )
}

function ServiceDetails({
  service,
  onShowForm,
}: {
  service: Service
  onShowForm: () => void
}) {
  return (
    <>
      {/* Header */}
      <span className="text-xs font-semibold tracking-widest uppercase text-gold block mb-3">
        {service.price}
      </span>
      <h2 className="font-display text-3xl sm:text-4xl font-normal leading-tight tracking-tight mb-2">
        {service.title}
      </h2>
      <p className="text-sm text-stone-500 mb-4">{service.priceNote}</p>
      <p className="text-stone-600 leading-relaxed mb-8">{service.subtitle}</p>

      {/* How it works */}
      <div className="mb-8">
        <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-4">
          How it works
        </span>
        {service.howItWorks.map((item, i) => (
          <div
            key={i}
            className="py-3 border-b border-card-border first:border-t text-sm leading-relaxed"
          >
            <strong className="font-semibold">{item.label}</strong> {item.text}
          </div>
        ))}
      </div>

      {/* What we cover (cohort) */}
      {service.whatWeCover && (
        <div className="mb-8">
          <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-4">
            What we cover
          </span>
          {service.whatWeCover.map((item, i) => (
            <div
              key={i}
              className="py-3 border-b border-card-border first:border-t text-sm leading-relaxed"
            >
              {item.text}
            </div>
          ))}
        </div>
      )}

      {/* Provocation block (dev team) */}
      {service.provocationBlock && (
        <div className="bg-navy text-warm-white p-6 rounded-lg mb-8">
          <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-3">
            {service.provocationBlock.label}
          </span>
          {service.provocationBlock.items.map((item, i) => (
            <div
              key={i}
              className="py-2 border-b border-white/10 last:border-none text-sm opacity-90"
            >
              <span className="text-gold font-semibold mr-2">{item.number}</span>
              {item.text}
            </div>
          ))}
        </div>
      )}

      {/* Callout */}
      {service.callout && (
        <div className="bg-[#F5F0E8] p-6 border-l-[3px] border-gold rounded-r-lg mb-8">
          <p className="text-sm font-semibold mb-2">{service.callout.title}</p>
          {service.callout.paragraphs.map((p, i) => (
            <p key={i} className="text-sm text-stone-700 leading-relaxed mt-2">
              {p}
            </p>
          ))}
        </div>
      )}

      {/* Framework block (org training) */}
      {service.frameworkBlock && (
        <div className="bg-[#F5F0E8] p-6 rounded-lg mb-8">
          <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-3">
            {service.frameworkBlock.label}
          </span>
          {service.frameworkBlock.steps.map((step, i) => (
            <div
              key={i}
              className="py-2 border-t border-[#E0D9CC] first:border-none text-sm leading-relaxed"
            >
              <strong className="font-semibold text-gold mr-1">{step.label}</strong>
              {step.text}
            </div>
          ))}
        </div>
      )}

      {/* Proof block (full build) */}
      {service.proofBlock && (
        <div className="bg-[#F5F0E8] p-6 rounded-lg mb-8">
          <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-3">
            {service.proofBlock.label}
          </span>
          {service.proofBlock.items.map((item, i) => (
            <div
              key={i}
              className="py-3 border-t border-[#E0D9CC] first:border-none text-sm leading-relaxed"
            >
              {item.stat && (
                <span className="font-display text-xl text-gold block mb-0.5">
                  {item.stat}
                </span>
              )}
              {!item.stat ? <strong className="font-semibold">{item.text}</strong> : item.text}
            </div>
          ))}
        </div>
      )}

      {/* Who this is for */}
      <div className="bg-navy text-warm-white p-6 rounded-lg mb-8">
        <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-3">
          This is for you if
        </span>
        <p className="text-sm leading-relaxed opacity-90">{service.whoBlock}</p>
      </div>

      {/* CTA */}
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
  service,
  onClose,
}: {
  service: Service
  onClose: () => void
}) {
  const [email, setEmail] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [selectedService, setSelectedService] = useState(service.title)
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
          service: selectedService,
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
          Expect a LinkedIn message from me shortly to discuss {selectedService}.
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
        {service.price}
      </span>
      <h2 className="font-display text-2xl sm:text-3xl font-normal tracking-tight mb-2">
        Interested in {service.title}?
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

        <div>
          <label htmlFor="inquiry-service" className="mb-1 block text-sm font-medium text-stone-700">
            Service
          </label>
          <select
            id="inquiry-service"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-navy focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          >
            {SERVICES.map((s) => (
              <option key={s.slug} value={s.title}>
                {s.title} — {s.price}
              </option>
            ))}
          </select>
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
