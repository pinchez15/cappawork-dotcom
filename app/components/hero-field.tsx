"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

type Particle = {
  x: number
  y: number
  r: number
  a: number
  speed: number
  phase: number
}

export default function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let particles: Particle[] = []
    let width = 0
    let height = 0
    const state = { t: 0 }

    const seed = () => {
      const count = Math.max(80, Math.floor((width * height) / 2400))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.4,
        a: Math.random() * 0.28 + 0.06,
        speed: Math.random() * 0.35 + 0.08,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      for (const p of particles) {
        const wave = Math.sin((p.x / Math.max(width, 1)) * Math.PI * 2.4 + state.t + p.phase)
        const y = height * 0.42 + wave * height * 0.22 + (p.y - height * 0.5) * 0.28
        ctx.beginPath()
        ctx.fillStyle = `rgba(18, 32, 68, ${p.a})`
        ctx.arc(p.x, y, p.r, 0, Math.PI * 2)
        ctx.fill()
        if (!reduce) {
          p.x += p.speed
          if (p.x > width + 4) p.x = -4
        }
      }
    }

    resize()
    render()
    window.addEventListener("resize", resize)

    const tween = reduce
      ? null
      : gsap.to(state, {
          t: Math.PI * 2,
          duration: 22,
          repeat: -1,
          ease: "none",
          onUpdate: render,
        })

    return () => {
      tween?.kill()
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-x-0 bottom-0 h-[46%] w-full pointer-events-none"
      aria-hidden
    />
  )
}
