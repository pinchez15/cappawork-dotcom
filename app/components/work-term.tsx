import { cn } from "@/lib/utils"

type Tone = "dark" | "light"

const computerTone: Record<Tone, string> = {
  dark: "text-stone-200 decoration-stone-400/80",
  light: "text-navy decoration-stone-400",
}

const humanTone: Record<Tone, string> = {
  dark: "text-gold decoration-gold/90",
  light: "text-navy decoration-gold",
}

const termBase =
  "font-semibold underline decoration-2 underline-offset-[0.2em] decoration-dotted"

export function ComputerWorkTerm({
  tone = "dark",
  className,
}: {
  tone?: Tone
  className?: string
}) {
  return (
    <span className={cn(termBase, computerTone[tone], className)}>
      Computer Work
    </span>
  )
}

export function HumanWorkTerm({
  tone = "dark",
  className,
}: {
  tone?: Tone
  className?: string
}) {
  return (
    <span className={cn(termBase, humanTone[tone], className)}>
      Human Work
    </span>
  )
}

export function WorkTermCard({
  term,
  pillars,
  tagline,
  examples,
  variant,
}: {
  term: "computer" | "human"
  pillars: string[]
  tagline: string
  examples: string[]
  variant: "computer" | "human"
}) {
  const isComputer = variant === "computer"

  return (
    <div
      className={cn(
        "h-full rounded-2xl p-5 sm:p-7 lg:p-8",
        isComputer
          ? "border border-white/10 bg-card-dark"
          : "border border-gold/30 bg-warm-white"
      )}
    >
      <div className="mb-4">
        <p
          className={cn(
            "inline-block font-display text-2xl sm:text-[1.65rem] tracking-tight mb-3",
            isComputer ? "text-white" : "text-navy"
          )}
        >
          {term === "computer" ? "Computer Work" : "Human Work"}
        </p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {pillars.map((pillar) => (
            <span
              key={pillar}
              className={cn(
                "text-[11px] sm:text-xs font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full",
                isComputer
                  ? "border border-stone-500/40 text-stone-400 bg-stone-500/10"
                  : "border border-gold/40 text-gold bg-gold/10"
              )}
            >
              {pillar}
            </span>
          ))}
        </div>
      </div>

      <p
        className={cn(
          "text-sm mb-4 leading-relaxed",
          isComputer ? "text-white/55" : "text-stone-500"
        )}
      >
        {tagline}
      </p>

      <ul className="space-y-2">
        {examples.map((item) => (
          <li
            key={item}
            className={cn(
              "flex items-start gap-2.5 text-sm sm:text-[0.95rem] leading-relaxed",
              isComputer ? "text-white/70" : "text-stone-600"
            )}
          >
            <span
              className={cn(
                "mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full",
                isComputer ? "bg-stone-500" : "bg-gold"
              )}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
