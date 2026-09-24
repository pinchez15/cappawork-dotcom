"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const outcomes = [
  {
    number: "01",
    title: "Less operational drag",
    body: "Computer work comes off the people who should be deciding, selling, and leading.",
  },
  {
    number: "02",
    title: "Faster execution",
    body: "Handoffs that used to wait on a meeting now move as the work arrives.",
  },
  {
    number: "03",
    title: "More output, same team",
    body: "The operation carries more without a new layer of coordination or headcount.",
  },
]

const FAN_PATHS = Array.from({ length: 16 }, (_, i) => {
  const y = 24 + i * 38
  const pull = (y - 320) * 0.15
  return `M 0 320 C 180 ${320 + pull}, 460 ${y}, 820 ${y}`
})

export default function OutcomesSection() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const svg = svgRef.current
    if (!svg) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const paths = svg.querySelectorAll("path")
    if (reduce) return

    const ctx = gsap.context(() => {
      paths.forEach((path, i) => {
        const len = path.getTotalLength()
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.35,
          delay: i * 0.035,
          ease: "power2.out",
          scrollTrigger: {
            trigger: svg,
            start: "top 78%",
            once: true,
          },
        })
      })
    }, svg)

    return () => ctx.revert()
  }, [])

  return (
    <section id="outcomes" className="relative py-20 sm:py-28 bg-[#F7F8FA] overflow-hidden">
      <svg
        ref={svgRef}
        viewBox="0 0 820 640"
        className="pointer-events-none absolute left-0 top-1/2 hidden lg:block h-[120%] w-[58%] -translate-y-1/2"
        aria-hidden
        fill="none"
      >
        {FAN_PATHS.map((d) => (
          <path key={d} d={d} stroke="#2450E6" strokeOpacity="0.45" strokeWidth="1.25" />
        ))}
      </svg>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-5 lg:col-start-1">
            <h2 className="font-display text-4xl sm:text-5xl tracking-tight text-navy leading-[1.05] text-balance">
              The operation gets faster without getting heavier.
            </h2>
            <p className="mt-6 text-base text-stone-600 leading-relaxed max-w-md">
              The work moves with fewer handoffs. An agent is used where it removes drag, and left out where a person should decide.
            </p>
          </div>

          <ol className="lg:col-span-6 lg:col-start-7 space-y-10">
            {outcomes.map((item) => (
              <li key={item.number}>
                <span className="font-display text-3xl text-[#2450E6]">{item.number}</span>
                <h3 className="mt-2 font-display text-2xl sm:text-3xl text-navy">{item.title}</h3>
                <p className="mt-2 text-stone-600 leading-relaxed max-w-md">{item.body}</p>
              </li>
            ))}
            <li>
              <a
                href="#discovery"
                className="inline-flex items-center bg-navy text-white px-5 py-3 text-sm font-medium hover:bg-[#141A2E] transition-colors"
              >
                Book a Discovery Call
              </a>
            </li>
          </ol>
        </div>
      </div>
    </section>
  )
}
