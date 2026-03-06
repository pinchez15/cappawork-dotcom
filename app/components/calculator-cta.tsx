import Link from "next/link"
import { ArrowRight, Users, TrendingUp, Clock } from "lucide-react"

export default function CalculatorCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#0a1628] to-[#162a46]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-white/10 text-white/80 text-[10px] font-bold tracking-[2px] uppercase px-4 py-1 rounded-full mb-6">
            Free Assessment
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            How many more customers could your team handle?
          </h2>
          <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto">
            Most service teams spend 30-50% of their time on admin work AI can
            handle. Find out what that means for your revenue in 2 minutes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <Clock className="w-5 h-5 text-[#c9a84c] mx-auto mb-2" />
              <div className="text-sm font-bold text-white">2 Minutes</div>
              <div className="text-xs text-white/50 mt-1">
                5 quick questions
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <Users className="w-5 h-5 text-[#c9a84c] mx-auto mb-2" />
              <div className="text-sm font-bold text-white">Your Numbers</div>
              <div className="text-xs text-white/50 mt-1">
                Based on your actual team
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <TrendingUp className="w-5 h-5 text-[#c9a84c] mx-auto mb-2" />
              <div className="text-sm font-bold text-white">
                Revenue Capacity
              </div>
              <div className="text-xs text-white/50 mt-1">
                Not cost cuts — growth
              </div>
            </div>
          </div>

          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0a1628] font-black py-4 px-10 rounded-full text-lg transition-all hover:brightness-110"
          >
            Take the Assessment
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
