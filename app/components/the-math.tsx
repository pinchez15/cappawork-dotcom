"use client"

import { FadeInUp } from "./motion-wrapper"
import { PRICING_AFTER_AUDIT } from "@/lib/offerings/data"

export default function TheMath() {
  return (
    <section id="math" className="py-24 bg-warm-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            The ROI
          </span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-navy leading-tight mb-8">
            The math.
          </h2>

          <p className="text-xl text-navy font-display leading-relaxed mb-12">
            Six weeks. One department, 2–4 production workflows — scoped after a Computer Work Audit, with client-owned IP at go-live.
          </p>

          <div className="bg-navy text-white rounded-2xl p-8 sm:p-10 mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase text-gold mb-4">
              How to read it
            </p>
            <p className="text-white/80 leading-relaxed mb-4">
              The engagement is designed for ROI within about six months on high-leverage Computer Work — directional, not a guaranteed-savings promise. We baseline hours, cycle time, and rework in Week 0 so go-live has a number to beat.
            </p>
            <p className="text-white/60 leading-relaxed">{PRICING_AFTER_AUDIT}</p>
          </div>

          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-stone-200">
                  <th className="text-left py-3 pr-4 font-semibold text-navy"></th>
                  <th className="text-left py-3 px-4 font-semibold text-stone-500">Dev Shop</th>
                  <th className="text-left py-3 px-4 font-semibold text-stone-500">AI Tools</th>
                  <th className="text-left py-3 px-4 font-semibold text-gold">CappaWork</th>
                </tr>
              </thead>
              <tbody className="text-stone-600">
                <tr className="border-b border-stone-100">
                  <td className="py-3 pr-4 font-medium text-navy">Investment</td>
                  <td className="py-3 px-4">Quoted on a build SOW</td>
                  <td className="py-3 px-4">Seats and tokens monthly</td>
                  <td className="py-3 px-4 text-navy font-medium">Scoped after audit · six weeks</td>
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-3 pr-4 font-medium text-navy">Diagnosis</td>
                  <td className="py-3 px-4">None — they build what you tell them</td>
                  <td className="py-3 px-4">None — you figure it out</td>
                  <td className="py-3 px-4 text-navy font-medium">Week 0 audit with baselines</td>
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-3 pr-4 font-medium text-navy">Scope</td>
                  <td className="py-3 px-4">Whatever fits the SOW</td>
                  <td className="py-3 px-4">Scattered pilots</td>
                  <td className="py-3 px-4 text-navy font-medium">One department · 2–4 workflows</td>
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-3 pr-4 font-medium text-navy">Build</td>
                  <td className="py-3 px-4">Yes, but spec risk is yours</td>
                  <td className="py-3 px-4">No — tools, not products</td>
                  <td className="py-3 px-4 text-navy font-medium">Production in your stack · parallel run</td>
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-3 pr-4 font-medium text-navy">Ownership</td>
                  <td className="py-3 px-4">Often shared / unclear</td>
                  <td className="py-3 px-4">Vendor lock-in</td>
                  <td className="py-3 px-4 text-navy font-medium">You own the IP at go-live</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-navy">Aftercare</td>
                  <td className="py-3 px-4">Change orders</td>
                  <td className="py-3 px-4">Self-service docs</td>
                  <td className="py-3 px-4 text-navy font-medium">12-month narrow fix guarantee · optional retainer</td>
                </tr>
              </tbody>
            </table>
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}
