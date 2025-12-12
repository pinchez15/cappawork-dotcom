"use client"

import { Check } from "lucide-react"

export default function Portfolio() {
  const projects = [
    {
      industry: "Property Management",
      benefit: "Reduced contract processing time by 60% through automated reporting workflows",
      link: "#"
    },
    {
      industry: "Professional Services",
      benefit: "Eliminated manual data entry, saving 15 hours per week for the operations team",
      link: "#"
    },
    {
      industry: "Healthcare Administration",
      benefit: "Streamlined patient intake, reducing wait times by 40% and improving satisfaction scores",
      link: "#"
    },
    {
      industry: "Manufacturing",
      benefit: "Real-time inventory tracking reduced stockouts by 35% and improved order fulfillment accuracy",
      link: "#"
    }
  ]

  return (
    <section id="portfolio" className="py-24 bg-stone-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-stone-900 mb-6">
            See some of our work.
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-stone-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-stone-50 to-transparent z-10 pointer-events-none" />

          {/* Scrolling Cards */}
          <div className="flex gap-6 animate-portfolio-scroll">
            {/* First set of cards */}
            {projects.map((project, idx) => (
              <a
                key={`first-${idx}`}
                href={project.link}
                className="flex-shrink-0 w-80 bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 p-8 hover:border-blue-300 group cursor-pointer"
              >
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-stone-100 text-stone-700 text-xs font-semibold uppercase tracking-wide rounded-full">
                    {project.industry}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={20} className="text-blue-600 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <p className="text-stone-700 leading-relaxed group-hover:text-stone-900 transition-colors">
                    {project.benefit}
                  </p>
                </div>
              </a>
            ))}

            {/* Duplicate set for seamless loop */}
            {projects.map((project, idx) => (
              <a
                key={`second-${idx}`}
                href={project.link}
                className="flex-shrink-0 w-80 bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 p-8 hover:border-blue-300 group cursor-pointer"
              >
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-stone-100 text-stone-700 text-xs font-semibold uppercase tracking-wide rounded-full">
                    {project.industry}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={20} className="text-blue-600 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <p className="text-stone-700 leading-relaxed group-hover:text-stone-900 transition-colors">
                    {project.benefit}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
