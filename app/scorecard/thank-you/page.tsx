import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Thank You — CappaWork",
  description: "Your Profit Formula guide is on its way.",
};

export default function ThankYouPage() {
  const callPaymentLink =
    process.env.NEXT_PUBLIC_STRIPE_CALL_PAYMENT_LINK || "#";

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>

        <h1 className="mt-6 font-display text-2xl text-stone-900 sm:text-3xl">
          Your Profit Formula guide is on its way
        </h1>

        <p className="mt-3 text-stone-600">
          Check your inbox (and spam folder) — you should receive it within a
          few minutes.
        </p>

        <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-6 text-left">
          <h2 className="font-medium text-stone-900">
            Want someone to run these numbers with you?
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Book a 60-minute Profit Leak Diagnostic Call. We&rsquo;ll walk
            through your scorecard results, identify the root causes, and build
            a prioritized action plan.
          </p>
          <a
            href={callPaymentLink}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Book the Call — $297
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <Link
          href="/scorecard"
          className="mt-6 inline-block text-sm text-stone-500 hover:text-stone-700"
        >
          Retake the scorecard
        </Link>
      </div>
    </div>
  );
}
