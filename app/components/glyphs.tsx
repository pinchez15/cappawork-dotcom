import { cn } from "@/lib/utils"

export type OrbKind = "agent" | "human"

export function OrbStation({
  className = "",
  label,
  kind = "agent",
}: {
  className?: string
  label?: string
  kind?: OrbKind
}) {
  return (
    <span
      data-orb-station
      data-orb-kind={kind}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border transition-[box-shadow,background-color,border-color] duration-300",
        kind === "human"
          ? "h-[18px] w-[18px] border-gold bg-gold shadow-[0_0_14px_rgba(212,168,83,0.4)]"
          : "h-4 w-4 border-gold/70 bg-transparent",
        className
      )}
    >
      <span className="sr-only">{label ?? (kind === "human" ? "Human work" : "Agentic work")}</span>
    </span>
  )
}

export function GlyphKey({
  className = "",
  tone = "light",
}: {
  className?: string
  tone?: "light" | "dark"
}) {
  const label = tone === "dark" ? "text-white/55" : "text-stone-500"
  return (
    <div className={cn("flex flex-wrap items-center gap-5 text-[11px] font-medium tracking-[0.14em] uppercase", label, className)}>
      <span className="inline-flex items-center gap-2">
        <span className="h-3.5 w-3.5 rounded-full border border-gold bg-transparent" aria-hidden />
        Agentic work
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-3.5 w-3.5 rounded-full border border-gold bg-gold" aria-hidden />
        Human work
      </span>
    </div>
  )
}

export function GlyphPath({
  d,
  viewBox = "0 0 120 24",
  className = "",
}: {
  d: string
  viewBox?: string
  className?: string
}) {
  return (
    <svg
      aria-hidden
      viewBox={viewBox}
      fill="none"
      className={cn("pointer-events-none text-gold", className)}
    >
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
