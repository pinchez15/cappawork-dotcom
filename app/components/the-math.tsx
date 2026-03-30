"use client"

import { FadeInUp } from "./motion-wrapper"

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
            $90,000 total investment. Six months. A full AI team &mdash; diagnosis, builds, coaching, training &mdash; for less than half the cost of one senior hire.
          </p>

          {/* Case study */}
          <div className="bg-navy text-white rounded-2xl p-8 sm:p-10 mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase text-gold mb-4">
              Case Study
            </p>
            <p className="text-white/80 leading-relaxed mb-4">
              A service business doing $1.8M in revenue with $250K in annual profit. After one engagement: <span className="text-white font-medium">$2M in revenue, $650K in profit. 2.6&times; profit improvement in one year.</span>
            </p>
            <p className="text-white/60 leading-relaxed">
              $400K in new annual profit on a $90K investment. At a $5M company with significant manual workflows, the upside is even larger.
            </p>
          </div>

          {/* Comparison table */}
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
                  <td className="py-3 pr-4 font-medium text-navy">Cost</td>
                  <td className="py-3 px-4">$100–200K per build</td>
                  <td className="py-3 px-4">$500–5K/mo per tool</td>
                  <td className="py-3 px-4 text-navy font-medium">$15K/mo for 6 months</td>
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-3 pr-4 font-medium text-navy">Diagnosis</td>
                  <td className="py-3 px-4">None — they build what you tell them</td>
                  <td className="py-3 px-4">None — you figure it out</td>
                  <td className="py-3 px-4 text-navy font-medium">Full profit diagnostic in month 1</td>
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-3 pr-4 font-medium text-navy">Strategy</td>
                  <td className="py-3 px-4">None</td>
                  <td className="py-3 px-4">None</td>
                  <td className="py-3 px-4 text-navy font-medium">Ongoing executive coaching</td>
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-3 pr-4 font-medium text-navy">Build</td>
                  <td className="py-3 px-4">Yes, but spec risk is yours</td>
                  <td className="py-3 px-4">No — tools, not products</td>
                  <td className="py-3 px-4 text-navy font-medium">Custom products, one per month</td>
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-3 pr-4 font-medium text-navy">Training</td>
                  <td className="py-3 px-4">None</td>
                  <td className="py-3 px-4">Self-service docs</td>
                  <td className="py-3 px-4 text-navy font-medium">Hands-on, in your codebase</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-navy">Outcome</td>
                  <td className="py-3 px-4">A product (maybe the right one)</td>
                  <td className="py-3 px-4">Scattered adoption</td>
                  <td className="py-3 px-4 text-navy font-medium">$1M+ in new profit, team trained, you own everything</td>
                </tr>
              </tbody>
            </table>
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}
