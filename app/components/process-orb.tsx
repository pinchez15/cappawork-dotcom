"use client"

import { useEffect, useRef } from "react"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { isLiteMotion } from "@/lib/motion"
import type { OrbKind } from "./glyphs"

export type { OrbKind }

const TRAVELER_COUNT = 3
const TRAVELER_STAGGER = 0.055
const DWELL = 0.24
const HUMAN_APPROACH = 0.82
const GOLD_GLOW = "0 0 14px rgba(212,168,83,0.45)"

type Station = {
  el: Element
  x: number
  y: number
  kind: OrbKind
}

function readStations(): Station[] {
  return Array.from(document.querySelectorAll("[data-orb-station]")).map((el) => {
    const r = el.getBoundingClientRect()
    const kind = el.getAttribute("data-orb-kind") === "human" ? "human" : "agent"
    return {
      el,
      x: r.left + r.width / 2,
      y: r.top + r.height / 2,
      kind,
    }
  })
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}

function alongStations(stations: Station[], raw: number) {
  const n = stations.length
  if (n === 0) return null
  if (n === 1) {
    const only = stations[0]
    const stop = only.kind === "human" ? HUMAN_APPROACH : 1
    return {
      x: only.x,
      y: only.y,
      index: 0,
      hold: true,
      stop,
    }
  }

  const t = clamp01(raw)
  const scaled = t * (n - 1)
  const i = Math.min(n - 2, Math.floor(scaled))
  const local = scaled - i
  const travelT = local < DWELL ? 0 : (local - DWELL) / (1 - DWELL)
  const a = stations[i]
  const b = stations[i + 1]
  const stop = b.kind === "human" ? HUMAN_APPROACH : 1
  const u = Math.min(travelT, stop)

  return {
    x: a.x + (b.x - a.x) * u,
    y: a.y + (b.y - a.y) * u,
    index: travelT < 0.12 ? i : travelT > 0.78 ? i + 1 : i,
    hold: travelT === 0 || (b.kind === "human" && travelT >= HUMAN_APPROACH),
    stop,
  }
}

export default function ProcessOrb() {
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const layer = layerRef.current
    if (!layer) return

    const travelers = Array.from(layer.querySelectorAll<HTMLElement>("[data-orb-traveler]"))

    if (isLiteMotion()) {
      gsap.set(travelers, { opacity: 0 })
      return
    }

    const highlight = (index: number) => {
      readStations().forEach((station, i) => {
        station.el.classList.toggle("orb-station-active", i === index)
      })
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "main",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.85,
        onUpdate: (self) => {
          const stations = readStations()
          if (stations.length === 0) {
            gsap.set(travelers, { opacity: 0 })
            return
          }

          const hero = document.getElementById("hero")
          const discovery = document.getElementById("discovery")
          const heroBottom = hero?.getBoundingClientRect().bottom ?? 0
          const discoveryTop = discovery?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY

          // Page travelers take over after the hero knot resolves, then hold at the form.
          const carry = clamp01((window.innerHeight * 0.62 - heroBottom) / (window.innerHeight * 0.28))
          const arrived = discoveryTop < window.innerHeight * 0.72
          const pageProgress = arrived ? 1 : self.progress

          let leadIndex = 0
          travelers.forEach((el, i) => {
            const raw = pageProgress - i * TRAVELER_STAGGER
            if (raw < 0) {
              gsap.set(el, { opacity: 0 })
              return
            }
            const pos = alongStations(stations, raw)
            if (!pos) {
              gsap.set(el, { opacity: 0 })
              return
            }
            if (i === 0) leadIndex = pos.index
            gsap.set(el, {
              x: pos.x,
              y: pos.y,
              xPercent: -50,
              yPercent: -50,
              opacity: carry,
            })
          })
          highlight(leadIndex)
        },
      })
    }, layer)

    return () => {
      readStations().forEach((station) => station.el.classList.remove("orb-station-active"))
      ctx.revert()
    }
  }, [])

  return (
    <div ref={layerRef} aria-hidden className="pointer-events-none fixed inset-0 z-40">
      {Array.from({ length: TRAVELER_COUNT }, (_, i) => (
        <div
          key={i}
          data-orb-traveler
          className="absolute top-0 left-0 h-3.5 w-3.5 rounded-full border-[1.5px] border-gold bg-transparent opacity-0"
          style={{ boxShadow: GOLD_GLOW }}
        />
      ))}
    </div>
  )
}

export { GlyphKey, GlyphPath, OrbStation } from "./glyphs"
