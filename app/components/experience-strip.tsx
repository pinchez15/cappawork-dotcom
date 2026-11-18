import Image from "next/image"

/**
 * Flip to true once Spectrum Science approves being named on the site.
 */
const SHOW_SPECTRUM_SCIENCE = false

type ExperienceEntry = {
  name: string
  /**
   * Optional path to a muted greyscale logo in /public/logos.
   * Leave unset to render the name as text.
   * Never set one for the FDA: agency policy prohibits private-sector use of its logo.
   */
  logo?: string
  hidden?: boolean
}

const EXPERIENCE: ExperienceEntry[] = [
  { name: "CVS Health" },
  { name: "U.S. Food and Drug Administration" },
  { name: "Vertex Pharmaceuticals" },
  { name: "Spectrum Science", hidden: !SHOW_SPECTRUM_SCIENCE },
  { name: "Boston Children's Hospital" },
  { name: "Dana-Farber Cancer Institute" },
  { name: "Harvard Cancer Center" },
]

export default function ExperienceStrip() {
  const entries = EXPERIENCE.filter((entry) => !entry.hidden)

  return (
    <section
      id="experience"
      aria-label="Founder experience"
      className="border-y border-card-border bg-card-light py-10 sm:py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-stone-500 text-center">
          Before CappaWork, Nate worked at
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-10 lg:gap-x-8">
          {entries.map((entry) => (
            <li key={entry.name} className="flex items-center">
              {entry.logo ? (
                <Image
                  src={entry.logo}
                  alt={entry.name}
                  width={140}
                  height={40}
                  className="h-7 w-auto object-contain opacity-60 grayscale"
                />
              ) : (
                <span className="font-display text-xl sm:text-2xl lg:text-[1.375rem] tracking-tight text-stone-500">
                  {entry.name}
                </span>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-[11px] text-stone-400">
          Founder&rsquo;s career experience. Not a client list or an endorsement.
        </p>
      </div>
    </section>
  )
}
