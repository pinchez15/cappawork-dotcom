import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const FOUNDER_CAREER = [
  "Clinical research coordinator on phase 1 to 3 trials across Boston Children’s Hospital, Dana-Farber, and Harvard Cancer Center",
  "Two years on-site at FDA with Eagle Hill, modeling reviewer workflow and capacity",
  "Product development at a CVS Health long-term care pharmacy",
  "Biotech and private equity portfolio sales; MBA",
  "Now: production software and managed agents, built inside the client’s workflow",
]

export default function FounderSection() {
  return (
    <section id="founder" className="py-20 sm:py-28 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4 mb-6">
              <Image
                src="/nate-headshot.png"
                alt="Nate Pinches, founder of CappaWork"
                width={72}
                height={72}
                className="h-16 w-16 sm:h-[72px] sm:w-[72px] rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-navy">Nate Pinches</p>
                <p className="text-sm text-stone-500">Founder, CappaWork</p>
              </div>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl tracking-tight text-navy leading-[1.05] text-balance">
              From the clinic, to the FDA, to the pharmacy.
            </h2>
            <p className="mt-5 text-lg text-stone-600 leading-relaxed">
              Nate Pinches has worked inside the places healthcare work actually happens. He sets the
              product vision with your executives, then builds it with your team.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-navy underline decoration-gold/60 underline-offset-4 transition-colors hover:text-gold"
            >
              About Nate
              <ArrowRight size={14} />
            </Link>
          </div>

          <ul className="lg:col-span-6 lg:col-start-7 self-end divide-y divide-card-border border-y border-card-border">
            {FOUNDER_CAREER.map((item, i) => (
              <li key={item} className="flex items-start gap-4 py-4 sm:py-5">
                <span className="mt-1 font-display text-lg leading-none text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-stone-700 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
