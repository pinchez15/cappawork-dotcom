"use client"

import { useEffect, useRef } from "react"
import { FadeInUp } from "./motion-wrapper"
import { isLiteMotion } from "@/lib/motion"
import { GlyphPath, OrbStation } from "./glyphs"

const steps = [
  {
    number: "01",
    title: "Discover",
    body: "We interview your team to understand how the business works and where you need to go.",
  },
  {
    number: "02",
    title: "Build",
    body: "We help your team build an AI-native workflow that delivers the work.",
  },
  {
    number: "03",
    title: "Improve",
    body: "As new models improve, your workflows improve.",
  },
]

export default function HowItWorks() {
  const listRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list || isLiteMotion()) return

    let cancelled = false
    let revert = () => {}

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      if (cancelled || !listRef.current) return
      gsap.registerPlugin(ScrollTrigger)
      const cards = list.querySelectorAll("[data-step-card]")
      const ctx = gsap.context(() => {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: list,
              start: "top 80%",
              once: true,
            },
          }
        )
      }, list)
      revert = () => ctx.revert()
    })

    return () => {
      cancelled = true
      revert()
    }
  }, [])

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gold mb-4">
            How an engagement runs
          </p>
          <h2 className="font-display text-4xl sm:text-5xl tracking-tight text-navy leading-[1.05] max-w-2xl text-balance">
            Discover. Build. Improve.
          </h2>
          <p className="mt-5 text-lg text-stone-600">
            We help founder-led companies transform with AI.
          </p>
        </FadeInUp>

        <ol ref={listRef} className="mt-14 grid gap-4 lg:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.number}
              data-step-card
              className="rounded-2xl border border-card-border bg-card-light p-7 sm:p-9"
            >
              <div className="flex items-center gap-3">
                <OrbStation kind="agent" label={`Step ${step.number}`} />
                <span className="font-display text-3xl text-gold">{step.number}</span>
              </div>
              <h3 className="mt-4 font-display text-2xl text-navy">{step.title}</h3>
              <p className="mt-3 text-stone-600 leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col items-center gap-3">
          <GlyphPath d="M12 2 V34" viewBox="0 0 24 36" className="h-9 w-6" />
          <OrbStation kind="human" label="Delivered for judgment" />
        </div>
      </div>
    </section>
  )
}
