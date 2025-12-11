"use client"

import Image from "next/image"

export default function Portfolio() {
  const projects = [
    {
      name: "ArborKey",
      category: "B2B SaaS",
      description: "Win more HOA contracts through better reporting.",
      image: "/Chef1.png",
      span: "md:col-span-2 md:row-span-2",
      height: "h-96"
    },
    {
      name: "WorkPortfolio",
      category: "SaaS Platform",
      description: "Project portfolios for Indie Hackers.",
      image: "/WP1.png",
      span: "md:col-span-1 md:row-span-1",
      height: "h-48"
    },
    {
      name: "Super Resume",
      category: "Consumer App",
      description: "Turn your resume into an arcade game.",
      image: "/CW_buypage.png",
      span: "md:col-span-1 md:row-span-1",
      height: "h-48"
    }
  ]

  return (
    <section id="portfolio" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-stone-900 mb-6">
             See some of our work.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 md:grid-rows-2 gap-6">
           {projects.map((project, idx) => (
             <div key={idx} className={`relative group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-200 ${project.span} ${project.height} md:h-auto`}>
               {/* Background Image */}
               <div className="absolute inset-0">
                 <Image
                   src={project.image}
                   alt={project.name}
                   fill
                   className="object-cover transition-transform duration-700 group-hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/30 transition-colors" />
               </div>

               {/* Content Overlay */}
               <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                 <p className="text-sm font-medium text-white/80 uppercase tracking-wide mb-2">
                   {project.category}
                 </p>
                 <h3 className="text-3xl font-semibold tracking-tight mb-2">
                   {project.name}
                 </h3>
                 <p className="text-white/90 text-lg max-w-md opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                   {project.description}
                 </p>
               </div>
             </div>
           ))}
        </div>
      </div>
    </section>
  )
}
