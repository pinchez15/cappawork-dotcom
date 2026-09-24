"use client"

import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const TANGLE_A =
  "M80 250 C140 70 260 40 300 190 C340 360 160 380 120 240 C80 90 360 50 400 210 C440 380 560 360 540 200 C520 40 700 80 720 230 C740 380 880 340 900 210 C920 70 1080 120 1120 250"

const TANGLE_B =
  "M70 210 C190 30 310 370 430 160 C550 10 640 350 780 190 C920 30 1040 330 1130 230"

const TANGLE_C =
  "M90 290 C210 410 330 50 460 270 C590 430 690 90 830 280 C970 430 1060 110 1110 270"

const THREAD =
  "M80 268 C260 230 480 300 700 255 C880 218 1020 278 1120 250"

const MAIN_STATIONS = [0.12, 0.28, 0.44, 0.6, 0.76]
const EXTRA_STATIONS = [0.22, 0.55, 0.78]

function placeOnPath(path: SVGPathElement | null, circles: SVGCircleElement[], ts: number[]) {
  if (!path) return
  const len = path.getTotalLength()
  circles.forEach((circle, i) => {
    const t = ts[i]
    if (t == null) return
    const pt = path.getPointAtLength(t * len)
    circle.setAttribute("cx", String(pt.x))
    circle.setAttribute("cy", String(pt.y))
  })
}

export default function HeroField() {
  const svgRef = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin)
    const svg = svgRef.current
    if (!svg) return

    const main = svg.querySelector<SVGPathElement>("[data-hero-path='main']")
    const extras = Array.from(svg.querySelectorAll<SVGPathElement>("[data-hero-path='extra']"))
    const mainAgents = Array.from(svg.querySelectorAll<SVGCircleElement>("[data-hero-agent='main']"))
    const extraAgents = Array.from(svg.querySelectorAll<SVGCircleElement>("[data-hero-agent='extra']"))
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const settle = () => {
      if (main) main.setAttribute("d", THREAD)
      extras.forEach((path) => {
        path.setAttribute("d", THREAD)
        path.setAttribute("opacity", "0")
      })
      extraAgents.forEach((circle) => circle.setAttribute("opacity", "0"))
      placeOnPath(main, mainAgents, MAIN_STATIONS)
    }

    if (reduce) {
      settle()
      return
    }

    placeOnPath(main, mainAgents, MAIN_STATIONS)
    extras.forEach((path, i) => {
      const slice = extraAgents.slice(i * 2, i * 2 + 2)
      placeOnPath(path, slice, EXTRA_STATIONS)
    })

    const ctx = gsap.context(() => {
      const place = () => {
        placeOnPath(main, mainAgents, MAIN_STATIONS)
        extras.forEach((path, i) => {
          const slice = extraAgents.slice(i * 2, i * 2 + 2)
          placeOnPath(path, slice, EXTRA_STATIONS)
        })
      }

      try {
        if (main) {
          gsap.to(main, {
            morphSVG: THREAD,
            ease: "none",
            scrollTrigger: {
              trigger: "#hero",
              start: "top top",
              end: "bottom top",
              scrub: 0.7,
              onUpdate: place,
            },
          })
        }

        extras.forEach((path) => {
          gsap.to(path, {
            morphSVG: THREAD,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: "#hero",
              start: "top top",
              end: "bottom top",
              scrub: 0.7,
            },
          })
        })

        extraAgents.forEach((circle) => {
          gsap.to(circle, {
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: "#hero",
              start: "top top",
              end: "bottom top",
              scrub: 0.7,
            },
          })
        })
      } catch {
        settle()
      }
    }, svg)

    return () => ctx.revert()
  }, [])

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] w-full"
      viewBox="0 0 1200 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      fill="none"
    >
      <path
        data-hero-path="extra"
        d={TANGLE_B}
        stroke="#D4A853"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.38"
      />
      <path
        data-hero-path="extra"
        d={TANGLE_C}
        stroke="#D4A853"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.32"
      />
      <path
        data-hero-path="main"
        d={TANGLE_A}
        stroke="#D4A853"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.75"
      />

      {EXTRA_STATIONS.slice(0, 2).map((_, i) => (
        <circle
          key={`extra-b-${i}`}
          data-hero-agent="extra"
          r="5.5"
          fill="none"
          stroke="#D4A853"
          strokeWidth="1.6"
        />
      ))}
      {EXTRA_STATIONS.slice(0, 2).map((_, i) => (
        <circle
          key={`extra-c-${i}`}
          data-hero-agent="extra"
          r="5.5"
          fill="none"
          stroke="#D4A853"
          strokeWidth="1.6"
        />
      ))}
      {MAIN_STATIONS.map((_, i) => (
        <circle
          key={`main-${i}`}
          data-hero-agent="main"
          r="5.5"
          fill="none"
          stroke="#D4A853"
          strokeWidth="1.75"
        />
      ))}
    </svg>
  )
}
