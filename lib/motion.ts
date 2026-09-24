"use client"

import { useEffect, useState } from "react"

/** Phones, plus anyone who asked the OS to cut motion. */
export const LITE_MOTION_QUERY =
  "(max-width: 767px), (prefers-reduced-motion: reduce)"

export function isLiteMotion() {
  if (typeof window === "undefined") return true
  return window.matchMedia(LITE_MOTION_QUERY).matches
}

export function useLiteMotion() {
  const [lite, setLite] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia(LITE_MOTION_QUERY)
    const apply = () => setLite(mq.matches)
    apply()
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [])

  return lite
}
