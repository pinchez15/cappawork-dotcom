"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Fades content up once when it scrolls into view. Uses the global
 * motion tokens (--cw-dur, --cw-ease, --cw-stagger) from globals.css.
 * `index` staggers siblings.
 */
export function Reveal({
  children,
  className,
  index = 0,
  as: Tag = "div",
}: {
  children: ReactNode
  className?: string
  index?: number
  as?: "div" | "li" | "p" | "h2" | "h3" | "blockquote"
}) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!("IntersectionObserver" in window)) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      data-in={inView}
      className={cn("cw-reveal", className)}
      style={{ "--i": index } as CSSProperties}
    >
      {children}
    </Tag>
  )
}

