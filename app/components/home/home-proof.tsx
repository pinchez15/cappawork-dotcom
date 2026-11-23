import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { FEATURED_TESTIMONIAL, PORTFOLIO_PROJECTS } from "@/lib/portfolio/data"
import { FOUNDER_CAREER } from "@/lib/founder"
import { Reveal } from "./reveal"

export default function HomeProof() {
  return (
    <section id="work" className="bg-warm-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal as="h2" className="max-w-3xl text-balance font-display text-[2.5rem] leading-[1.05] tracking-[-0.015em] text-navy sm:text-[3.25rem]">
          Systems that changed how the work gets done.
        </Reveal>

        <ul className="mt-14 border-b border-card-border sm:mt-20">
          {PORTFOLIO_PROJECTS.map((project) => {
            const row = (
              <div className="grid gap-3 py-8 sm:py-10 lg:grid-cols-12 lg:items-baseline lg:gap-8">
                <h3
                  className={`font-display text-[2rem] leading-tight text-navy sm:text-[2.5rem] lg:col-span-5 ${
                    project.url ? "transition-colors duration-[var(--cw-dur)] group-hover:text-gold" : ""
                  }`}
                >
                  {project.name}
                  {project.url ? (
                    <ArrowUpRight
                      size={22}
                      aria-hidden
                      className="ml-2 inline-block align-baseline text-stone-300 transition-colors duration-[var(--cw-dur)] group-hover:text-gold"
                    />
                  ) : null}
                </h3>
                <p className="text-lg leading-relaxed text-stone-600 lg:col-span-5">
                  {project.description}
                </p>
                <p className="text-[13px] uppercase tracking-[0.1em] text-stone-400 lg:col-span-2 lg:text-right">
                  {project.industry}
                </p>
              </div>
            )
            return (
              <Reveal as="li" key={project.name} className="border-t border-card-border">
                {project.url ? (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="group block">
                    {row}
                  </a>
                ) : (
                  row
                )}
              </Reveal>
            )
          })}
        </ul>

        <Reveal as="blockquote" className="mx-auto mt-24 max-w-4xl text-center sm:mt-32">
          <p className="font-display text-[2rem] leading-[1.2] text-navy sm:text-[2.75rem]">
            &ldquo;{FEATURED_TESTIMONIAL.quote}&rdquo;
          </p>
          <footer className="mt-8 text-[15px] text-stone-500">
            <span className="font-medium text-navy">{FEATURED_TESTIMONIAL.name}</span>
            {", "}
            {FEATURED_TESTIMONIAL.title}, {FEATURED_TESTIMONIAL.company}
          </footer>
        </Reveal>

        <div id="founder" className="mt-24 grid gap-12 border-t border-card-border pt-16 sm:mt-32 sm:pt-24 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <div className="flex items-center gap-4">
              <Image
                src="/nate-headshot.png"
                alt="Nate Pinches, founder of CappaWork"
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-navy">Nate Pinches</p>
                <p className="text-sm text-stone-500">Founder, CappaWork</p>
              </div>
            </div>
            <h2 className="mt-8 font-display text-[2.5rem] leading-[1.05] tracking-[-0.015em] text-navy sm:text-[3.25rem]">
              From the clinic, to the FDA, to the pharmacy.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-stone-600">
              Nate has worked inside the places healthcare work actually happens. He sets the product
              vision with your executives, then builds it with your team.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 text-[15px] font-medium text-navy underline decoration-navy/25 underline-offset-[6px] transition-colors hover:decoration-gold"
            >
              About Nate
              <ArrowRight size={15} aria-hidden />
            </Link>
          </Reveal>

          <ol className="border-b border-card-border lg:col-span-6 lg:col-start-7 lg:self-end">
            {FOUNDER_CAREER.map((item, i) => (
              <Reveal as="li" index={i} key={item} className="flex gap-5 border-t border-card-border py-5">
                <span className="font-display text-lg leading-7 text-gold" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="leading-7 text-stone-700">{item}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
