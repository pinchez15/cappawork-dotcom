"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, TrendingDown, ChevronRight } from "lucide-react";
import { QUESTIONS, DIMENSION_LABELS, type Dimension } from "./questions";
import { computeScores, type ScorecardResult } from "./scoring";
import { trackLead, trackCompleteRegistration, trackInitiateCheckout } from "./fb-pixel";

const REVENUE_RANGES = [
  "$1M–$3M",
  "$3M–$5M",
  "$5M–$10M",
  "$10M–$25M",
  "$25M+",
];

const GRADE_COLORS: Record<string, string> = {
  A: "text-green-600 bg-green-50 border-green-200",
  B: "text-blue-600 bg-blue-50 border-blue-200",
  C: "text-yellow-600 bg-yellow-50 border-yellow-200",
  D: "text-orange-600 bg-orange-50 border-orange-200",
  F: "text-red-600 bg-red-50 border-red-200",
};

const GRADE_BAR_COLORS: Record<string, string> = {
  A: "bg-green-500",
  B: "bg-blue-500",
  C: "bg-yellow-500",
  D: "bg-orange-500",
  F: "bg-red-500",
};

type FunnelStep = "hero" | "capture" | "quiz" | "results";

type UTMParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fb_click_id?: string;
};

export function ScorecardFunnel() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<FunnelStep>("hero");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [revenueRange, setRevenueRange] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<ScorecardResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [utmParams, setUtmParams] = useState<UTMParams>({});

  useEffect(() => {
    setUtmParams({
      utm_source: searchParams.get("utm_source") || undefined,
      utm_medium: searchParams.get("utm_medium") || undefined,
      utm_campaign: searchParams.get("utm_campaign") || undefined,
      utm_content: searchParams.get("utm_content") || undefined,
      utm_term: searchParams.get("utm_term") || undefined,
      fb_click_id: searchParams.get("fbclid") || undefined,
    });
  }, [searchParams]);

  const handleEmailSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setSubmitting(true);

      try {
        const res = await fetch("/api/scorecard-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            revenue_range: revenueRange,
            ...utmParams,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Something went wrong");
        }

        trackLead();
        setStep("quiz");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
    [name, email, revenueRange, utmParams]
  );

  const handleSelectOption = useCallback(
    (optionIndex: number) => {
      const question = QUESTIONS[currentQuestion];
      setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));

      // Auto-advance after short delay
      setTimeout(() => {
        if (currentQuestion < QUESTIONS.length - 1) {
          setCurrentQuestion((prev) => prev + 1);
        }
      }, 300);
    },
    [currentQuestion]
  );

  const handleQuizComplete = useCallback(async () => {
    const scores = computeScores(answers);
    setResult(scores);
    setStep("results");
    trackCompleteRegistration();

    // Send scores to API
    try {
      await fetch("/api/scorecard-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          answers,
          scores: {
            overall: scores.overall,
            categories: scores.categories,
            topLeaks: scores.topLeaks,
          },
          overall_grade: scores.grade,
          top_leak: scores.topLeaks[0]?.key || null,
        }),
      });
    } catch {
      // Non-blocking — results are already shown
    }
  }, [answers, email]);

  const callPaymentLink =
    process.env.NEXT_PUBLIC_STRIPE_CALL_PAYMENT_LINK || "#";
  const pdfPaymentLink =
    process.env.NEXT_PUBLIC_STRIPE_PDF_PAYMENT_LINK || "#";

  // Append email as client_reference_id to payment links
  const appendEmail = (url: string) => {
    if (url === "#" || !email) return url;
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}client_reference_id=${encodeURIComponent(email.trim())}`;
  };

  // --- HERO ---
  if (step === "hero") {
    return (
      <div className="light min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-sm text-stone-600">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
            Free &middot; Takes 2 minutes
          </div>

          <h1 className="font-display text-4xl leading-tight text-stone-900 sm:text-5xl md:text-6xl">
            Find the profit leaks hiding in your service business
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-stone-600 sm:text-xl">
            Answer 12 quick questions. Get a personalized grade across 6 profit
            dimensions — and find out exactly where money is slipping through the
            cracks.
          </p>

          <p className="mt-4 text-sm text-stone-500">
            Built for service-business founders doing $3M–$10M/year
          </p>

          <button
            onClick={() => setStep("capture")}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-lg font-medium text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30"
          >
            Take the Free Scorecard
            <ArrowRight className="h-5 w-5" />
          </button>

          <div className="mt-12 flex flex-col items-center gap-3 text-sm text-stone-500">
            <p>Scores you across:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {Object.values(DIMENSION_LABELS).map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-600"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- EMAIL CAPTURE ---
  if (step === "capture") {
    return (
      <div className="light min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-16">
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
            <h2 className="text-center font-display text-2xl text-stone-900 sm:text-3xl">
              Before we start
            </h2>
            <p className="mt-2 text-center text-stone-600">
              We&rsquo;ll email you a copy of your results.
            </p>

            <form onSubmit={handleEmailSubmit} className="mt-8 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm font-medium text-stone-700"
                >
                  Your name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-stone-700"
                >
                  Work email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@company.com"
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="revenue"
                  className="mb-1 block text-sm font-medium text-stone-700"
                >
                  Annual revenue
                </label>
                <select
                  id="revenue"
                  required
                  value={revenueRange}
                  onChange={(e) => setRevenueRange(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="" disabled>
                    Select range
                  </option>
                  {REVENUE_RANGES.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Starting..." : "Start the Scorecard"}
              </button>

              <p className="text-center text-xs text-stone-400">
                No spam. We&rsquo;ll send your results and a few follow-up insights.
              </p>
            </form>
          </div>

          <button
            onClick={() => setStep("hero")}
            className="mt-4 flex w-full items-center justify-center gap-1 text-sm text-stone-500 hover:text-stone-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </div>
    );
  }

  // --- QUIZ ---
  if (step === "quiz") {
    const question = QUESTIONS[currentQuestion];
    const selectedOption = answers[question.id];
    const allAnswered = QUESTIONS.every((q) => answers[q.id] !== undefined);
    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

    return (
      <div className="light min-h-[calc(100vh-3.5rem)] px-4 py-8 sm:py-16">
        <div className="mx-auto max-w-xl">
          {/* Progress bar */}
          <div className="mb-2 flex items-center justify-between text-sm text-stone-500">
            <span>
              Question {currentQuestion + 1} of {QUESTIONS.length}
            </span>
            <span className="rounded-full border border-stone-200 bg-white px-2.5 py-0.5 text-xs text-stone-500">
              {DIMENSION_LABELS[question.dimension]}
            </span>
          </div>
          <div className="mb-8 h-2 overflow-hidden rounded-full bg-stone-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Question */}
          <h2 className="text-xl font-medium leading-snug text-stone-900 sm:text-2xl">
            {question.text}
          </h2>

          {/* Options */}
          <div className="mt-6 space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full rounded-xl border px-5 py-4 text-left text-sm transition-all sm:text-base ${
                  selectedOption === idx
                    ? "border-blue-500 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20"
                    : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() =>
                setCurrentQuestion((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestion === 0}
              className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 disabled:invisible"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>

            {currentQuestion < QUESTIONS.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion((prev) => prev + 1)}
                disabled={selectedOption === undefined}
                className="flex items-center gap-1 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleQuizComplete}
                disabled={!allAnswered}
                className="flex items-center gap-1 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-30"
              >
                See My Results
                <CheckCircle2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- RESULTS ---
  if (step === "results" && result) {
    const topLeak = result.topLeaks[0];
    const gradeColor = GRADE_COLORS[result.grade] || GRADE_COLORS.C;

    return (
      <div className="light px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl">
          {/* Grade card */}
          <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-medium uppercase tracking-wider text-stone-500">
              Your Profit Leak Score
            </p>
            <div
              className={`mx-auto mt-4 flex h-24 w-24 items-center justify-center rounded-2xl border-2 text-5xl font-bold ${gradeColor}`}
            >
              {result.grade}
            </div>
            <p className="mt-4 text-3xl font-bold text-stone-900">
              {result.overall}/100
            </p>
            <p className="mt-2 text-stone-600">
              {result.grade === "A" &&
                "Excellent — your operations are tight. Small optimizations can still unlock margin."}
              {result.grade === "B" &&
                "Strong foundation, but there are clear opportunities to recover lost profit."}
              {result.grade === "C" &&
                "Average — you're leaving meaningful money on the table across several dimensions."}
              {result.grade === "D" &&
                "Below average — there are significant profit leaks that need attention."}
              {result.grade === "F" &&
                "Critical — your business has major structural profit leaks that are likely costing you six figures annually."}
            </p>
          </div>

          {/* Top leak callout */}
          {topLeak && (
            <div className="mt-6 flex items-start gap-4 rounded-2xl border border-orange-200 bg-orange-50 p-6">
              <AlertTriangle className="mt-0.5 h-6 w-6 flex-shrink-0 text-orange-600" />
              <div>
                <h3 className="font-medium text-stone-900">
                  Your #1 Profit Leak: {topLeak.label}
                </h3>
                <p className="mt-1 text-sm text-stone-600">
                  You scored {topLeak.score}/100 in this dimension. This is
                  likely your biggest opportunity for margin recovery.
                </p>
              </div>
            </div>
          )}

          {/* Dimension breakdown */}
          <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-medium text-stone-900">
              Score Breakdown
            </h3>
            <div className="space-y-4">
              {result.categories.map((cat) => (
                <div key={cat.key}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-stone-700">{cat.label}</span>
                    <span className="font-medium text-stone-900">
                      {cat.score}/100{" "}
                      <span
                        className={`ml-1 inline-flex h-5 w-5 items-center justify-center rounded text-xs font-bold ${GRADE_COLORS[cat.grade]}`}
                      >
                        {cat.grade}
                      </span>
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${GRADE_BAR_COLORS[cat.grade]}`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-10 space-y-4">
            {/* Primary: $297 call */}
            <div className="rounded-2xl border-2 border-blue-500 bg-white p-6 shadow-lg">
              <div className="flex items-start gap-3">
                <TrendingDown className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600" />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-stone-900">
                    Get a Profit Recovery Plan
                  </h3>
                  <p className="mt-1 text-sm text-stone-600">
                    60-minute call with Nate. We&rsquo;ll walk through your
                    scorecard results, diagnose the root causes behind your
                    lowest-scoring dimensions, and build a prioritized action
                    plan to recover lost profit.
                  </p>
                  <ul className="mt-3 space-y-1 text-sm text-stone-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Deep-dive into your specific numbers
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Custom action plan you can implement immediately
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Recording + summary delivered after the call
                    </li>
                  </ul>
                  <a
                    href={appendEmail(callPaymentLink)}
                    onClick={() => trackInitiateCheckout(297)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-medium text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30"
                  >
                    Book the Diagnostic Call — $297
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Secondary: $27 PDF */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6">
              <h3 className="font-medium text-stone-900">
                Want to fix it yourself?
              </h3>
              <p className="mt-1 text-sm text-stone-600">
                The Profit Formula is a step-by-step guide covering all 6 profit
                dimensions, with worksheets and benchmarks for service businesses
                at your stage.
              </p>
              <a
                href={appendEmail(pdfPaymentLink)}
                onClick={() => trackInitiateCheckout(27)}
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Get the Profit Formula Guide — $27
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Footer note */}
          <p className="mt-8 text-center text-sm text-stone-400">
            Your results have been saved. Check your inbox for a copy.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
