"use client"

import dynamic from "next/dynamic"
import { useLiteMotion } from "@/lib/motion"

const ProcessOrb = dynamic(() => import("./process-orb"), { ssr: false })

export default function DesktopProcessOrb() {
  const lite = useLiteMotion()
  if (lite) return null
  return <ProcessOrb />
}
