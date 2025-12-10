"use client"

import { Check, ShieldCheck, Lock } from "lucide-react"

export default function CohortCheckoutPage() {
  // Hardcoded for now based on user request/env vars
  const isEarlyBird = true
  const price = "$500"
  const fullPrice = "$1,000"
  const nextCohortDate = "January 2025"

  return (
    <div className="min-h-screen bg-stone-50">
      
      {/* Simple Header */}
      <header className="bg-white border-b border-stone-200 py-6">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <a href="/" className="text-xl font-semibold tracking-tight text-stone-900">
               CappaWork
            </a>
         </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
         <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
            
            {/* Left Column: Summary */}
            <div className="lg:col-span-5 space-y-8">
               <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-stone-900 mb-2">
                     Secure Your Spot
                  </h1>
                  <p className="text-stone-600 text-lg">
                     Join the CappaWork Builder Cohort
                  </p>
               </div>

               <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                  <div className="flex justify-between items-start mb-6 pb-6 border-b border-stone-100">
                     <div>
                        <h3 className="font-semibold text-stone-900">January 2025 Cohort</h3>
                        <p className="text-sm text-stone-500">4-Week Live Program</p>
                     </div>
                     <div className="text-right">
                        <div className="text-xl font-semibold text-stone-900">{price}</div>
                        <div className="text-sm text-stone-400 line-through">{fullPrice}</div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h4 className="font-medium text-stone-900 text-sm">What's Included:</h4>
                     <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm text-stone-600">
                           <Check size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                           <span>3 Live Weekly Calls</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-stone-600">
                           <Check size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                           <span>Private Community Access</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-stone-600">
                           <Check size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                           <span>Lifetime Curriculum Access</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-stone-600">
                           <Check size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                           <span>Direct access to instructors</span>
                        </li>
                     </ul>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-stone-100 flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 p-3 rounded-lg">
                     <ShieldCheck size={16} />
                     100% Money-Back Guarantee
                  </div>
               </div>
               
               <div className="flex items-center gap-2 text-stone-400 text-sm justify-center lg:justify-start">
                  <Lock size={14} />
                  Secure SSL Encryption
               </div>
            </div>

            {/* Right Column: Checkout Form Placeholder */}
            <div className="lg:col-span-7">
               <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden min-h-[600px] flex flex-col items-center justify-center text-center p-12">
                  <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-6">
                     <span className="font-bold text-stone-400 text-2xl">S</span>
                  </div>
                  <h3 className="text-xl font-semibold text-stone-900 mb-2">Stripe Checkout</h3>
                  <p className="text-stone-500 max-w-sm">
                     This is where the Stripe Embedded Checkout Element will be rendered.
                  </p>
                  <div className="mt-8 p-4 bg-stone-50 border border-stone-200 rounded text-xs text-stone-400 font-mono">
                     {`<EmbeddedCheckoutProvider stripe={stripePromise} options={options} />`}
                  </div>
               </div>
            </div>

         </div>
      </main>
    </div>
  )
}
