"use client"

import { useEffect, useRef } from "react"
import { ArrowRight } from "lucide-react"
import { FadeInUp } from "./motion-wrapper"
import { isLiteMotion } from "@/lib/motion"

const sprints = [
  {
    name: "Strategy Sprint",
    body: "What to build and why: the product vision, the market and pricing, and the sprint plan to get there.",
    note: "Where most clients start.",
  },
  {
    name: "Product Sprint",
    body: "A working prototype of the core workflow, in front of your executives by the end of the week.",
  },
  {
    name: "UX Sprint",
    body: "The flows that fit how coordinators, pharmacists, and clinicians actually work, tested with the people who will use them.",
  },
  {
    name: "UI Sprint",
    body: "A production-ready interface and design system your team can keep building on.",
  },
  {
    name: "Build Sprint",
    body: "Working software shipped into your environment, with every agent action logged.",
  },
]

const timeline = ["Strategy", "Product", "UX", "UI", "Build", "Build"]

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
            stagger: 0.1,
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
            How we work
          </p>
          <h2 className="font-display text-4xl sm:text-5xl tracking-tight text-navy leading-[1.05] max-w-2xl text-balance">
            We work in sprints.
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-stone-600 leading-relaxed">
            A sprint is one focused week with a defined output. String them together and a full product
            ships in five or six sprints, back to back.
          </p>
        </FadeInUp>

        <ol ref={listRef} className="mt-12 sm:mt-14 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sprints.map((sprint) => (
            <li
              key={sprint.name}
              data-step-card
              className="flex flex-col rounded-2xl border border-card-border bg-card-light p-6 sm:p-7"
            >
              <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-stone-400">
                One week
              </p>
              <h3 className="mt-2 font-display text-2xl text-navy">{sprint.name}</h3>
              <p className="mt-3 text-stone-600 leading-relaxed">{sprint.body}</p>
              {sprint.note ? (
                <p className="mt-4 text-sm font-semibold text-gold">{sprint.note}</p>
              ) : null}
            </li>
          ))}
          <li
            data-step-card
            className="flex flex-col rounded-2xl bg-navy p-6 sm:p-7 ring-2 ring-gold/40"
          >
            <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-gold">Retainer</p>
            <h3 className="mt-2 font-display text-2xl text-white">Embedded team</h3>
            <p className="mt-1 text-sm text-white/60">$20,000 a month</p>
            <p className="mt-3 text-white/75 leading-relaxed">
              SVP-level product and AI leadership that also builds. A standing seat with your team every
              week: deciding what to build, and building it.
            </p>
            <p className="mt-3 text-sm text-white/60 leading-relaxed">
              Priced like an SVP of Product or AI salary, without the search, benefits, equity, or
              severance. Retainer clients add sprints whenever a push needs a full week.
            </p>
          </li>
        </ol>

        <div className="mt-14 sm:mt-16">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-stone-500 mb-4">
            A full product, in weeks
          </p>
          <ol className="grid gap-2 sm:grid-cols-6">
            {timeline.map((step, i) => (
              <li
                key={`${step}-${i}`}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 sm:flex-col sm:items-start sm:gap-1 ${
                  i === 0 ? "border-gold/50 bg-gold/10" : "border-card-border bg-card-light"
                }`}
              >
                <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-stone-400 sm:order-first">
                  Week {i + 1}
                </span>
                <span className="font-display text-xl text-navy">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-stone-500">Six sprints, back to back. Sprints can run on-site.</p>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-card-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-navy leading-relaxed">
            <span className="font-semibold">Sprints are $7,500 each.</span> One focused week, booked by the
            week.
          </p>
          <a
            href="#discovery"
            className="inline-flex shrink-0 items-center justify-center gap-2 bg-gold text-navy px-6 py-3 text-sm font-medium rounded-full hover:bg-gold/90 transition-colors"
          >
            Book a Strategy Sprint
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}
