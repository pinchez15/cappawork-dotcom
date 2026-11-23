import { ArrowRight } from "lucide-react"
import { stagger } from "./stagger"

/** Flip to true once Spectrum Science approves being named on the site. */
const SHOW_SPECTRUM_SCIENCE = false

const EXPERIENCE = [
  "CVS Health",
  "U.S. Food and Drug Administration",
  "Vertex Pharmaceuticals",
  ...(SHOW_SPECTRUM_SCIENCE ? ["Spectrum Science"] : []),
  "Boston Children’s Hospital",
  "Dana-Farber Cancer Institute",
  "Harvard Cancer Center",
]

export default function HomeHero() {
  return (
    <section id="hero" className="bg-warm-white pt-16">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-28 lg:px-8 lg:pb-28 lg:pt-36">
        <h1 className="font-display text-[3.4rem] leading-[0.94] tracking-[-0.025em] text-navy sm:text-[5.5rem] lg:text-[7.5rem]">
          <span className="cw-line">
            <span style={stagger(0)}>We make work</span>
          </span>
          <span className="cw-line">
            <span style={stagger(1)}>more human.</span>
          </span>
        </h1>

        <div className="mt-12 grid gap-10 sm:mt-16 lg:grid-cols-12 lg:items-end">
          <p
            className="cw-rise max-w-xl text-xl leading-[1.45] text-stone-600 sm:text-[1.375rem] lg:col-span-6"
            style={stagger(3)}
          >
            The embedded product team for healthcare and life sciences. We turn stuck initiatives
            into shipped products, so care teams get their time back for patients.
          </p>

          <div
            className="cw-rise flex flex-wrap items-center gap-x-8 gap-y-5 lg:col-span-5 lg:col-start-8 lg:justify-end"
            style={stagger(4)}
          >
            <a
              href="#discovery"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-gold px-7 font-medium text-navy transition-colors hover:bg-gold/90"
            >
              Book a Strategy Sprint
              <ArrowRight size={16} aria-hidden />
            </a>
            <a
              href="#work"
              className="text-[15px] font-medium text-navy underline decoration-navy/25 underline-offset-[6px] transition-colors hover:decoration-gold"
            >
              See the work
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-card-border">
        <div
          className="cw-rise mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
          style={stagger(5)}
          id="experience"
        >
          <p className="text-[15px] leading-relaxed text-stone-500">
            <span className="text-navy">Before CappaWork, Nate worked at </span>
            {EXPERIENCE.join(" · ")}
          </p>
          <p className="mt-1 text-xs text-stone-400">
            Founder&rsquo;s career experience. Not a client list or an endorsement.
          </p>
        </div>
      </div>
    </section>
  )
}
