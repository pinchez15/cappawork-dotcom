"use client"

import { Check, ArrowRight, Calendar, Code, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function CohortSection() {
  return (
    <section id="cohort" className="py-24 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-sm font-medium text-stone-600 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              Next Cohort Open
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-stone-900 mb-6">
              The CappaWork Builder Cohort
            </h2>
            
            <p className="text-xl text-stone-600 mb-8 leading-relaxed">
              Don't want us to build it for you? Build it yourself, with us.
            </p>
            
            <p className="text-lg text-stone-600 mb-8 leading-relaxed">
              A one-month, zero-to-one cohort where you turn an idea or prototype into a real, scalable solution. You leave with a deployed product, built on proper architecture.
            </p>

            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="bg-stone-100 p-2 rounded-full">
                  <Calendar className="w-5 h-5 text-stone-700" />
                </div>
                <div>
                  <h3 className="font-medium text-stone-900">1 Month Duration</h3>
                  <p className="text-stone-600 text-sm">Focused sprint to get from zero to shipped.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-stone-100 p-2 rounded-full">
                  <Code className="w-5 h-5 text-stone-700" />
                </div>
                <div>
                  <h3 className="font-medium text-stone-900">Modern Stack</h3>
                  <p className="text-stone-600 text-sm">Next.js, Supabase, Clerk, Vercel, Cursor AI.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-stone-100 p-2 rounded-full">
                  <MessageSquare className="w-5 h-5 text-stone-700" />
                </div>
                <div>
                  <h3 className="font-medium text-stone-900">Community + Mentorship</h3>
                  <p className="text-stone-600 text-sm">Weekly live calls & private community.</p>
                </div>
              </div>
            </div>

            <Link 
              href="/cohort" 
              className="inline-flex items-center gap-2 text-stone-900 font-medium border-b-2 border-stone-900 hover:text-stone-700 hover:border-stone-700 transition-colors pb-0.5"
            >
              View Cohort Details & Application
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right: Feature Box */}
          <div className="bg-stone-50 p-8 sm:p-12 rounded-2xl border border-stone-200">
            <h3 className="text-2xl font-serif font-light text-stone-900 mb-6">
              Outcomes
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-stone-700">A working product deployed to production</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-stone-700">Clean, scalable architecture</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-stone-700">Mastery of modern AI-assisted dev workflows</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-stone-700">30 spots per cohort (strict cap)</span>
              </li>
            </ul>
            
            <div className="mt-8 pt-8 border-t border-stone-200">
               <p className="text-stone-500 text-sm italic">
                 "You will leave with a real, deployed, scalable 0→1 product."
               </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
