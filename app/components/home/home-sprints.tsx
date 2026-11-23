"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Reveal } from "./reveal"

const weeks = [
  {
    name: "Strategy",
    body: "What to build and why: the product vision, the market and pricing, and the sprint plan.",
  },
  {
    name: "Product",
    body: "A working prototype of the core workflow, in front of your executives by the end of the week.",
  },
  {
    name: "UX",
    body: "Flows that fit how coordinators, pharmacists, and clinicians actually work, tested with them.",
  },
  {
    name: "UI",
    body: "A production-ready interface and design system your team can keep building on.",
  },
  {
    name: "Build",
    body: "Working software shipped into your environment, with every agent action logged.",
  },
  {
    name: "Build",
    body: "The build continues until the product is live with the people who use it.",
  },
]

const terms = [
  { figure: "$7,500", text: "per sprint. One focused week, booked by the week. Sprints can run on-site." },
  { figure: "5–6", text: "sprints to a full product, back to back. Most clients start with Strategy." },
  {
    figure: "$20,000",
    text: "a month for the embedded team: SVP-level product and AI leadership that also builds.",
  },
]

/** Pin and scrub only on large screens for people who have not asked to reduce motion. */
const PIN_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)"

function usePinned() {
  const [pinned, setPinned] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(PIN_QUERY)
    const apply = () => setPinned(mq.matches)
    apply()
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [])
  return pinned
}

export default function HomeSprints() {
  const pinned = usePinned()
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(1)

  useEffect(() => {
    if (!pinned) {
      setProgress(1)
      return
    }
    const el = trackRef.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      setProgress(travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 1)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [pinned])

  // Week i lights up once the scrub passes i/6; week 1 is always lit.
  const lit = (i: number) => !pinned || progress >= i / weeks.length - 0.02

  return (
    <section id="how-it-works" className="bg-navy">
      <div ref={trackRef} className={pinned ? "h-[220vh]" : undefined}>
        <div
          className={
            pinned
              ? "sticky top-0 flex h-screen flex-col justify-center pt-16"
              : "pb-8 pt-24 sm:pt-32"
          }
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal as="h2" className="font-display text-[2.5rem] leading-[1.05] tracking-[-0.015em] text-white sm:text-[3.25rem]">
              We work in sprints.
            </Reveal>
            <Reveal index={1} className="mt-6 max-w-xl">
              <p className="text-lg leading-relaxed text-white/70">
                A sprint is one focused week with a defined output. String them together and a full
                product ships in five or six sprints, back to back.
              </p>
            </Reveal>

            <ol className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-6">
              {weeks.map((week, i) => {
                const on = lit(i)
                return (
                  <li key={`${week.name}-${i}`} aria-current={pinned && on && !lit(i + 1) ? "step" : undefined}>
                    <div
                      className={`h-[2px] w-full transition-colors duration-[var(--cw-dur)] ease-[var(--cw-ease)] ${
                        on ? "bg-gold" : "bg-white/15"
                      }`}
                    />
                    <p
                      className={`mt-5 text-[13px] font-medium uppercase tracking-[0.1em] transition-colors duration-[var(--cw-dur)] ${
                        on ? "text-gold" : "text-white/30"
                      }`}
                    >
                      Week {i + 1}
                    </p>
                    <h3
                      className={`mt-2 font-display text-[2rem] leading-none transition-colors duration-[var(--cw-dur)] ${
                        on ? "text-white" : "text-white/30"
                      }`}
                    >
                      {week.name}
                    </h3>
                    <p
                      className={`mt-4 text-[15px] leading-relaxed transition-colors duration-[var(--cw-dur)] ${
                        on ? "text-white/65" : "text-white/20"
                      }`}
                    >
                      {week.body}
                    </p>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-4 sm:px-6 sm:pb-32 lg:px-8">
        <dl className="grid gap-10 border-t border-white/15 pt-12 md:grid-cols-3">
          {terms.map((term, i) => (
            <Reveal key={term.figure} index={i}>
              <dt className="font-display text-[3.25rem] leading-none text-gold sm:text-[4rem]">
                {term.figure}
              </dt>
              <dd className="mt-4 max-w-xs leading-relaxed text-white/70">{term.text}</dd>
            </Reveal>
          ))}
        </dl>

        <Reveal className="mt-14 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl leading-relaxed text-white/55">
            The retainer is priced like an SVP of Product or AI salary, without the search, benefits,
            equity, or severance. Retainer clients add sprints whenever a push needs a full week.
          </p>
          <a
            href="#discovery"
            className="inline-flex min-h-[48px] shrink-0 items-center gap-2 self-start rounded-full bg-gold px-7 font-medium text-navy transition-colors hover:bg-gold/90"
          >
            Book a Strategy Sprint
            <ArrowRight size={16} aria-hidden />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
