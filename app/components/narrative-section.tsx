import Image from "next/image"
import { ArrowRight } from "lucide-react"

interface NarrativeSectionProps {
  title: string
  subtitle?: string
  description: React.ReactNode
  imageSrc: string
  imageAlt: string
  imagePosition?: "left" | "right"
  backgroundColor?: "white" | "stone"
}

export default function NarrativeSection({
  title,
  subtitle,
  description,
  imageSrc,
  imageAlt,
  imagePosition = "left",
  backgroundColor = "white",
}: NarrativeSectionProps) {
  const isRight = imagePosition === "right"
  const bgClass = backgroundColor === "white" ? "bg-white" : "bg-stone-50"

  return (
    <section className={`py-24 ${bgClass} overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${isRight ? "" : "lg:flex-row-reverse"}`}>
          
          {/* Text Content */}
          <div className="flex-1 space-y-8">
            {subtitle && (
              <span className="text-sm font-semibold tracking-wide uppercase text-blue-600">
                {subtitle}
              </span>
            )}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-stone-900 leading-tight">
              {title}
            </h2>
            <div className="text-lg text-stone-600 leading-relaxed space-y-6">
              {description}
            </div>
          </div>

          {/* Image Content */}
          <div className="flex-1 w-full">
            <div className={`relative rounded-2xl overflow-hidden shadow-2xl border border-stone-100 bg-stone-100 aspect-square sm:aspect-[4/3] ${isRight ? "rotate-1" : "-rotate-1"} transition-transform duration-500 hover:rotate-0`}>
               {/* Placeholder until real image is passed */}
               <div className="absolute inset-0 bg-stone-200/50 flex items-center justify-center">
                 {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={imageAlt}
                      fill
                      className="object-cover"
                    />
                 ) : (
                   <span className="text-stone-400 font-medium">Image Placeholder</span>
                 )}
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
