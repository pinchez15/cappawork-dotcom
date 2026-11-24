import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fulfillment Policy | CappaWork",
  description: "Fulfillment and refund policy for CappaWork sprints and retainers.",
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
          Last updated: November 24, 2026
        </p>

        <div className="space-y-12">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-5">
              General Policy
            </span>
            <div className="space-y-4 text-base leading-relaxed text-stone-700">
              <p>
                CappaWork sells professional services under a statement of work
                or service agreement. Fees that reserve dedicated capacity are{" "}
                <strong className="text-navy">non-refundable</strong> once that
                capacity is held, unless the SOW says otherwise.
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

          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-5">
              Strategy and Build Sprints
            </span>
            <div className="py-4 border-t border-b border-card-border text-base leading-relaxed text-stone-700 space-y-4">
              <p>
                Applies to Strategy Sprints ($7,500) and Build Sprints
                ($15,000): product, UX, UI, or build weeks.
              </p>
              <p>
                Payment holds a dedicated week of capacity. Once the week is
                scheduled and payment is received, the fee is non-refundable.
                Scope and deliverables are confirmed before work begins.
              </p>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-5">
              Embedded Team Retainers
            </span>
            <div className="py-4 border-t border-b border-card-border text-base leading-relaxed text-stone-700 space-y-4">
              <p>
                Applies to embedded product and AI team retainers (from
                $20,000 a month).
              </p>
              <p>
                Retainer terms, notice periods, and cancellation are set in the
                SOW or MSA. Sprints added on top of a retainer follow the sprint
                terms above.
              </p>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-5">
              Custom Builds
            </span>
            <div className="py-4 border-t border-b border-card-border text-base leading-relaxed text-stone-700 space-y-4">
              <p>
                Payment is non-refundable once the engagement begins, unless the
                SOW provides otherwise. When you commit to a build, you are
                reserving dedicated capacity. Scope, milestones, and
                deliverables are agreed before work starts.
              </p>
              <p>
                You own all intellectual property produced during the engagement
                upon full payment, unless the SOW says otherwise. CappaWork may
                reference the engagement type (not proprietary details) in
                marketing materials unless otherwise agreed in writing.
              </p>
            </div>
          </div>

          <div className="bg-navy text-warm-white p-10 -mx-6 md:mx-0 md:rounded">
            <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-5">
              Agreement
            </span>
            <p className="text-base leading-relaxed opacity-90">
              By signing an SOW or paying for a CappaWork engagement, you
              acknowledge that you have read and agree to this fulfillment
              policy, together with the governing SOW or MSA.
            </p>
          </div>
        </div>

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
