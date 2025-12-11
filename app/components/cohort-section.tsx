"use client"

import { Check, ArrowRight, Calendar, Code, MessageSquare } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CohortSection() {
  return (
    <section id="cohort" className="py-24 bg-stone-900 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center rounded-full border border-stone-700 bg-stone-800 px-3 py-1 text-sm font-medium text-stone-300 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              Next Cohort Open
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-6">
              The CappaWork Builder Cohort
            </h2>
            
            <p className="text-xl text-stone-300 mb-8 leading-relaxed">
              The next step after vibe-coding: launch a truly working, scalable tool.
            </p>
            
            <p className="text-lg text-stone-400 mb-8 leading-relaxed">
              You've experimented with AI coding tools and built prototypes. Now take it to the next level. A one-month, zero-to-one cohort where you turn an idea or prototype into a real, scalable solution. You leave with a deployed product, built on proper architecture.
            </p>

            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="bg-stone-800 p-2 rounded-full">
                  <Calendar className="w-5 h-5 text-stone-300" />
                </div>
                <div>
                  <h3 className="font-medium text-white">1 Month Duration</h3>
                  <p className="text-stone-400 text-sm">Focused sprint to get from zero to shipped.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-stone-800 p-2 rounded-full">
                  <Code className="w-5 h-5 text-stone-300" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Modern Stack</h3>
                  <p className="text-stone-400 text-sm">Next.js, Supabase, Clerk, Vercel, Cursor AI.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-stone-800 p-2 rounded-full">
                  <MessageSquare className="w-5 h-5 text-stone-300" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Community + Mentorship</h3>
                  <p className="text-stone-400 text-sm">Weekly live calls & private community.</p>
                </div>
              </div>
            </div>

            <Link 
              href="/cohort" 
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/20"
            >
              View Cohort Details & Application
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right: Image Card + Outcomes Box */}
          <div className="space-y-6">
            {/* Image Card */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-700 aspect-[4/3]">
              <Image
                src="/Cohort photo.png"
                alt="CappaWork Builder Cohort"
                fill
                className="object-cover"
              />
            </div>

            {/* Outcomes Box */}
            <div className="bg-stone-800 p-8 sm:p-12 rounded-2xl border border-stone-700">
              <h3 className="text-2xl font-semibold tracking-tight text-white mb-6">
                Outcomes
              </h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-stone-300">A working product deployed to production</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-stone-300">Clean, scalable architecture</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-stone-300">Mastery of modern AI-assisted dev workflows</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-stone-300">30 spots per cohort (strict cap)</span>
                </li>
              </ul>
              
              <div className="pt-8 border-t border-stone-700">
                 <p className="text-white text-xl font-semibold leading-relaxed">
                   "You will leave with a real, deployed, scalable 0→1 product."
                 </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
