"use client"

import { useLayoutEffect, useRef } from "react"
import { isLiteMotion } from "@/lib/motion"

const PATHS = [
  "M36 64 C160 80 250 150 392 180",
  "M36 180 C170 180 280 180 392 180",
  "M36 296 C160 280 250 210 392 180",
]

function placeOnPath(path: SVGPathElement, circle: SVGCircleElement, t: number) {
  const len = path.getTotalLength()
  const pt = path.getPointAtLength(Math.max(0, Math.min(1, t)) * len)
  circle.setAttribute("cx", String(pt.x))
  circle.setAttribute("cy", String(pt.y))
}

export default function WorkflowMesh() {
  const svgRef = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("[data-outcome-path]"))
    const travelers = Array.from(svg.querySelectorAll<SVGCircleElement>("[data-outcome-agent]"))

    const resolved = () => {
      paths.forEach((path, i) => {
        const traveler = travelers[i]
        if (traveler) placeOnPath(path, traveler, 0.86)
      })
    }

    if (isLiteMotion()) {
      resolved()
      return
    }

    paths.forEach((path, i) => {
      const traveler = travelers[i]
      if (traveler) placeOnPath(path, traveler, 0.08)
    })

    let cancelled = false
    let revert = () => {}

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      if (cancelled || !svgRef.current) return
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        const progress = { t: 0 }
        gsap.to(progress, {
          t: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "#outcomes",
            start: "top 75%",
            end: "center 45%",
            scrub: 0.7,
          },
          onUpdate: () => {
            paths.forEach((path, i) => {
              const traveler = travelers[i]
              if (!traveler) return
              placeOnPath(path, traveler, 0.08 + progress.t * 0.78)
            })
          },
        })
      }, svg)

      revert = () => ctx.revert()
    })

    return () => {
      cancelled = true
      revert()
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 480 360"
      className="pointer-events-none absolute left-0 top-1/2 hidden w-[52%] -translate-y-1/2 opacity-90 lg:block"
      aria-hidden
      fill="none"
    >
      {PATHS.map((d, i) => (
        <path
          key={d}
          data-outcome-path
          d={d}
          stroke="#D4A853"
          strokeOpacity="0.55"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}

      {PATHS.map((d) => (
        <circle
          key={`agent-${d}`}
          data-outcome-agent
          r="6"
          fill="none"
          stroke="#D4A853"
          strokeWidth="1.7"
        />
      ))}

      <circle
        cx="400"
        cy="180"
        r="7"
        fill="#D4A853"
        stroke="#D4A853"
        strokeWidth="1.5"
      />
    </svg>
  )
}
