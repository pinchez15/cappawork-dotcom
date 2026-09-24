"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { FadeInUp } from "./motion-wrapper"
import { ComputerWorkTerm, HumanWorkTerm } from "./work-term"
import { GlyphPath, OrbStation } from "./process-orb"

const steps = [
  {
    number: "01",
    title: "Computer Work Audit",
    body: (
      <>
        A structured look at how work moves across teams, systems, and decision points. We find where{" "}
        <ComputerWorkTerm tone="light" className="text-sm sm:text-base" /> is crowding out{" "}
        <HumanWorkTerm tone="light" className="text-sm sm:text-base" />, and where an agent would help or get in the way.
      </>
    ),
  },
  {
    number: "02",
    title: "Discovery",
    body: "A sprint to decide what changes, what stays with your people, and what gets built. You leave with a sequence leadership can act on. Not an 18-month program.",
  },
  {
    number: "03",
    title: "Build",
    body: "We design and ship the system that will run the workflow, on the tools you already use. Agents go in where they remove a handoff. You own what we build. It stays on call. It is not a staffed seat.",
  },
  {
    number: "04",
    title: "It keeps getting better",
    body: "After it is live, we tighten how the system operates and extend it into the next workflow. Your team stays in the decisions that still need a person.",
  },
]

export default function HowItWorks() {
  const listRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const list = listRef.current
    if (!list) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

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

    return () => ctx.revert()
  }, [])

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gold mb-4">
            How an engagement runs
          </p>
          <h2 className="font-display text-4xl sm:text-5xl tracking-tight text-navy leading-[1.05] max-w-2xl text-balance">
            Audit. Decide. Build. Stay on call.
          </h2>
        </FadeInUp>

        <ol ref={listRef} className="mt-14 grid gap-4 sm:grid-cols-2">
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
              <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed">{step.body}</p>
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
