import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fulfillment Policy — CappaWork",
  description: "Fulfillment and refund policy for CappaWork services.",
};

export default function FulfillmentPolicyPage() {
  return (
    <div className="min-h-screen bg-warm-white text-navy">
      <nav className="border-b border-card-border">
        <div className="max-w-[680px] mx-auto px-6 flex h-14 items-center">
          <Link
            href="/"
            className="font-bold text-sm tracking-wider uppercase"
          >
            CappaWork
          </Link>
        </div>
      </nav>

      <div className="max-w-[680px] mx-auto px-6 py-20">
        <span className="text-xs font-semibold tracking-widest uppercase text-gold block mb-4">
          CappaWork
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-normal leading-tight tracking-tight mb-6">
          Fulfillment Policy
        </h1>
        <p className="text-lg text-stone-500 mb-12">
          Last updated: March 27, 2026
        </p>

        <div className="space-y-12">
          {/* General */}
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-5">
              General Policy
            </span>
            <div className="space-y-4 text-base leading-relaxed text-stone-700">
              <p>
                All CappaWork services are sold as-is and are{" "}
                <strong className="text-navy">non-refundable</strong> for any
                reason. By completing your payment via Stripe, you agree to the
                terms outlined below.
              </p>
              <p>
                You can reach Nate Pinches at{" "}
                <a
                  href="mailto:nate@cappawork.com"
                  className="underline hover:text-navy"
                >
                  nate@cappawork.com
                </a>{" "}
                with any questions about these policies before purchasing.
              </p>
            </div>
          </div>

          {/* Cohorts & Group Trainings */}
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-5">
              Cohorts &amp; Group Trainings
            </span>
            <div className="py-4 border-t border-b border-card-border text-base leading-relaxed text-stone-700 space-y-4">
              <p>
                Applies to: AI Re-skilling Cohort, Organizational AI Training.
              </p>
              <p>
                Your payment is non-refundable as it reserves a spot in the
                program. Payment is not refunded due to your lack of
                participation. Once your payment processes, you will be added to
                your specific group and sent calendar invites prior to launch
                day.
              </p>
              <p>
                We do not guarantee a specific outcome from our programs. By
                submitting your payment, you agree to indemnify CappaWork and
                Nate Pinches from any claims arising from your actions or
                inactions during and after your participation in the program.
              </p>
            </div>
          </div>

          {/* 1:1 Advisory & Workshops */}
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-5">
              Advisory Sessions &amp; Workshops
            </span>
            <div className="py-4 border-t border-b border-card-border text-base leading-relaxed text-stone-700 space-y-4">
              <p>
                Applies to: AI Strategy Advisory, Dev Team Workshop.
              </p>
              <p>
                Your payment is non-refundable and non-reschedulable. When you
                book, you are holding a dedicated time slot that another client
                could fill.
              </p>
              <p>
                Decisions you make based on the insights and recommendations
                shared during the session are your responsibility to implement.
                You agree to indemnify CappaWork and Nate Pinches and take
                responsibility for any impact to yourself or your business.
              </p>
            </div>
          </div>

          {/* Full Builds */}
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-5">
              Full Builds
            </span>
            <div className="py-4 border-t border-b border-card-border text-base leading-relaxed text-stone-700 space-y-4">
              <p>
                Applies to: Full Build engagements ($50,000&ndash;$100,000+).
              </p>
              <p>
                Payment is non-refundable once the engagement begins. When you
                commit to a build, you are reserving dedicated capacity for
                12&ndash;16 weeks. Scope, milestones, and deliverables are
                agreed upon during the scoping phase before any payment is
                collected.
              </p>
              <p>
                You own all intellectual property produced during the engagement.
                CappaWork retains the right to reference the engagement type
                (not proprietary details) in marketing materials unless
                otherwise agreed in writing.
              </p>
            </div>
          </div>

          {/* Digital Products */}
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-5">
              Digital Products
            </span>
            <div className="py-4 border-t border-b border-card-border text-base leading-relaxed text-stone-700 space-y-4">
              <p>
                Applies to: The Profit Formula and any other digital downloads.
              </p>
              <p>
                All digital product sales are final. Due to the nature of
                digital goods, refunds are not available once the product has
                been delivered.
              </p>
            </div>
          </div>

          {/* Agreement */}
          <div className="bg-navy text-warm-white p-10 -mx-6 md:mx-0 md:rounded">
            <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-5">
              Agreement
            </span>
            <p className="text-base leading-relaxed opacity-90">
              By executing a Stripe payment for any CappaWork service, you
              acknowledge that you have read and agree to this fulfillment
              policy. This policy applies to all services offered by CappaWork
              and Nate Pinches, regardless of how the service was discovered or
              purchased.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-6 border-t border-card-border flex justify-between items-center">
          <span className="font-bold text-sm tracking-wider">CAPPAWORK</span>
          <a
            href="mailto:nate@cappawork.com"
            className="text-sm text-stone-500 hover:text-navy transition-colors"
          >
            nate@cappawork.com
          </a>
        </div>
      </div>
    </div>
  );
}
