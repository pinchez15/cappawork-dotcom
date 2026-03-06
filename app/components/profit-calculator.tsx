"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────

type Data = {
  revenue: number | null;
  margin: number | null;
  headcount: number;
  admin: number;
  bottleneckName: string;
  bottleneckCurrent: number | null;
  bottleneckPeople: number | null;
};

type LeadInfo = {
  firstName: string;
  email: string;
  company: string;
};

// ── Component ──────────────────────────────────────────────────

export function ProfitCalculator() {
  const [step, setStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [leadSaving, setLeadSaving] = useState(false);
  const [leadError, setLeadError] = useState("");
  const [lead, setLead] = useState<LeadInfo>({
    firstName: "",
    email: "",
    company: "",
  });
  const [data, setData] = useState<Data>({
    revenue: null,
    margin: null,
    headcount: 8,
    admin: 40,
    bottleneckName: "",
    bottleneckCurrent: null,
    bottleneckPeople: null,
  });

  const calendlyLink =
    process.env.NEXT_PUBLIC_CALENDLY_LINK ||
    "https://calendly.com/cappawork/discovery_call";

  const totalSteps = 6;

  const set = useCallback(
    (key: keyof Data, value: Data[keyof Data]) =>
      setData((prev) => ({ ...prev, [key]: value })),
    []
  );

  function goTo(n: number) {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Calculations ────────────────────────────────────────────

  const rev = data.revenue || 0;
  const hc = data.headcount;
  const margin = data.margin === -1 ? 0.07 : data.margin || 0;
  const adminPct = data.admin / 100;

  const revenuePerEmployee = hc > 0 ? rev / hc : 0;
  const currentProfit = rev * margin;

  const avgFullyLoadedCost = rev < 5000000 ? 75000 : 90000;
  const recoverableAdminPct = Math.max(0, adminPct - 0.2);

  const hourlyRate = Math.round(avgFullyLoadedCost / 2080);
  const adminHoursPerWeek = Math.round(hc * 40 * adminPct);
  const recoverableHoursPerWeek = Math.round(hc * 40 * recoverableAdminPct);
  const equivalentFTEs = recoverableHoursPerWeek / 40;
  const recoverableLaborValue = recoverableHoursPerWeek * 52 * hourlyRate;

  // Revenue capacity: freed hours redirected to billable work
  const billableHoursPerWeek = hc * 40 - adminHoursPerWeek;
  const revenueCapacity =
    billableHoursPerWeek > 0
      ? Math.round((recoverableHoursPerWeek / billableHoursPerWeek) * rev)
      : 0;
  const capacityPct =
    billableHoursPerWeek > 0
      ? Math.round((recoverableHoursPerWeek / billableHoursPerWeek) * 100)
      : 0;

  const potentialMargin =
    rev > 0
      ? Math.min(0.25, (currentProfit + recoverableLaborValue) / rev)
      : 0;

  // Bottleneck
  const hasBottleneck =
    data.bottleneckName && data.bottleneckCurrent && data.bottleneckPeople;
  const bTotalNow =
    (data.bottleneckCurrent || 0) * (data.bottleneckPeople || 0);

  async function submitLead() {
    if (!lead.firstName || !lead.email || !lead.company) {
      setLeadError("Please fill in all fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
      setLeadError("Please enter a valid email address.");
      return;
    }

    setLeadSaving(true);
    setLeadError("");

    try {
      await fetch("/api/calculator-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: lead.firstName,
          email: lead.email,
          company: lead.company,
          inputs: {
            revenue: data.revenue,
            margin: data.margin,
            headcount: data.headcount,
            admin: data.admin,
            bottleneck: data.bottleneckName,
            bottleneckCurrent: data.bottleneckCurrent,
            bottleneckPeople: data.bottleneckPeople,
          },
          results: {
            revenueCapacity,
            capacityPct,
            recoverableHoursPerWeek,
            equivalentFTEs: +equivalentFTEs.toFixed(1),
            recoverableLaborValue,
            potentialMargin: +(potentialMargin * 100).toFixed(0),
          },
        }),
      });
    } catch {
      // Save failed silently — still show results
    }

    setLeadSaving(false);
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Shared styles ───────────────────────────────────────────

  const card =
    "bg-white border border-stone-200 rounded-2xl p-8 shadow-sm mb-5";
  const optionBase =
    "bg-stone-50 border-2 border-stone-200 rounded-xl p-4 text-center cursor-pointer transition-all font-semibold text-sm hover:border-stone-400";
  const optionSelected = "!border-[#0a1628] !bg-[#0a1628] !text-white";
  const btnPrimary =
    "bg-[#c9a84c] text-[#0a1628] font-bold py-3.5 px-8 rounded-xl transition-all hover:brightness-110 disabled:bg-stone-300 disabled:cursor-not-allowed flex-1 text-center";
  const btnBack =
    "bg-white text-stone-500 font-bold py-3.5 px-6 rounded-xl border border-stone-200 hover:bg-stone-50";
  const inputClass =
    "w-full px-4 py-3 border-2 border-stone-200 rounded-xl text-sm font-semibold text-stone-900 bg-stone-50 focus:outline-none focus:border-[#0a1628] placeholder:text-stone-300 placeholder:font-normal";

  // ── Results ───────────────────────────────────────────────

  if (showResults) {
    return (
      <div className="min-h-screen bg-stone-50 font-sans">
        <div className="max-w-[720px] mx-auto px-6 py-10 pb-20">
          {/* Nav */}
          <div className="text-center mb-8">
            <Link
              href="/"
              className="text-xl font-display tracking-tight text-stone-900 hover:text-stone-600 transition-colors"
            >
              CappaWork
            </Link>
          </div>

          {/* Hero */}
          <div className="bg-gradient-to-br from-[#0a1628] to-[#162a46] text-white rounded-2xl p-10 text-center mb-6">
            <div className="text-xs uppercase tracking-[3px] opacity-70 mb-2">
              Your Untapped Revenue Capacity
            </div>
            <div className="text-5xl font-black tracking-tight mb-1">
              ${revenueCapacity.toLocaleString()}
            </div>
            <div className="text-base opacity-80">
              in additional revenue your current team could handle
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                Your Team Today
              </div>
              <div className="text-2xl font-black text-stone-900">
                {hc} people
              </div>
              <div className="text-xs text-stone-500 mt-1">
                ${Math.round(revenuePerEmployee).toLocaleString()} revenue per
                person
              </div>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                Time on Admin Work
              </div>
              <div className="text-2xl font-black text-stone-900">
                {data.admin}%
              </div>
              <div className="text-xs text-stone-500 mt-1">
                {adminHoursPerWeek} hours/week not serving customers
              </div>
            </div>
            <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-xl p-5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                Capacity AI Unlocks
              </div>
              <div className="text-2xl font-black text-[#92750a]">
                +{capacityPct}% more
              </div>
              <div className="text-xs text-stone-500 mt-1">
                {recoverableHoursPerWeek} hrs/wk freed for customer work
              </div>
            </div>
            <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-xl p-5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                Like Adding
              </div>
              <div className="text-2xl font-black text-[#92750a]">
                {equivalentFTEs.toFixed(1)} FTEs
              </div>
              <div className="text-xs text-stone-500 mt-1">
                Without hiring or increasing overhead
              </div>
            </div>
          </div>

          {/* Math section */}
          <div className={card}>
            <h3 className="text-lg font-bold text-[#0a1628] mb-1">
              How We Got Here
            </h3>
            <p className="text-sm text-stone-500 mb-4">
              Every line uses your inputs. No black boxes.
            </p>

            <div className="text-[11px] font-bold uppercase tracking-wider text-[#0a7c42] mb-2">
              Capacity Your Team Can Reclaim
            </div>

            <MathRow label="Your team" value={`${hc} people`} />
            <MathRow
              label="Total team hours / week"
              formula={`${hc} x 40 hrs`}
              value={`${hc * 40} hrs/wk`}
            />
            <MathRow
              label="Hours on admin & repetitive work"
              formula={`${hc * 40} x ${data.admin}%`}
              value={`${adminHoursPerWeek} hrs/wk`}
            />
            <MathRow
              label="Hours AI can redirect to customers"
              formula={`${hc * 40} x ${Math.round(recoverableAdminPct * 100)}%`}
              value={`${recoverableHoursPerWeek} hrs/wk`}
              highlight
            />
            <MathRow
              label="Equivalent full-time capacity"
              formula={`${recoverableHoursPerWeek} / 40`}
              value={`${equivalentFTEs.toFixed(1)} FTEs`}
              highlight
            />

            <div className="text-[11px] font-bold uppercase tracking-wider text-[#0a7c42] mt-5 mb-2">
              Revenue Capacity
            </div>

            <MathRow
              label="Current billable hours / week"
              formula={`${hc * 40} - ${adminHoursPerWeek}`}
              value={`${billableHoursPerWeek} hrs/wk`}
            />
            <MathRow
              label="Revenue per billable hour"
              formula={`$${rev.toLocaleString()} / (${billableHoursPerWeek} x 52)`}
              value={`$${billableHoursPerWeek > 0 ? Math.round(rev / (billableHoursPerWeek * 52)).toLocaleString() : 0}/hr`}
            />
            <MathRow
              label="Additional customer capacity"
              formula={`${recoverableHoursPerWeek} / ${billableHoursPerWeek}`}
              value={`+${capacityPct}%`}
              highlight
            />

            <div className="border-t-2 border-[#0a7c42] mt-5 pt-3">
              <div className="flex justify-between items-center py-2">
                <span className="font-bold text-stone-900 text-sm">
                  Revenue Capacity Unlocked
                </span>
                <span className="font-black text-[#0a7c42] text-lg">
                  ${revenueCapacity.toLocaleString()}/yr
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 mt-4 italic">
              This is capacity — the ability to serve more customers without
              adding staff. Actual revenue depends on your pipeline and market.
            </p>
          </div>

          {/* Bottleneck multiplier */}
          {hasBottleneck && (
            <div className={card}>
              <h3 className="text-lg font-bold text-[#0a1628] mb-1">
                What {data.bottleneckName} Looks Like With AI
              </h3>
              <p className="text-sm text-stone-500 mb-4">
                AI doesn&apos;t replace your team — it removes the manual steps
                so they can handle more volume with the same quality.
              </p>

              <div className="bg-stone-50 border-2 border-[#0a1628] rounded-xl p-6 mb-4">
                <div className="text-sm font-bold text-[#0a1628] mb-4">
                  {data.bottleneckName}: Today vs. With AI
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 text-center p-4 bg-white rounded-lg border border-stone-200">
                    <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                      Today
                    </div>
                    <div className="text-3xl font-black text-[#0a1628]">
                      {bTotalNow}
                    </div>
                    <div className="text-xs text-stone-500">per week</div>
                  </div>
                  <div className="text-xl text-stone-400 shrink-0">→</div>
                  <div className="flex-1 text-center p-4 bg-[#edf7f0] rounded-lg border border-[#a0d8b0]">
                    <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                      With AI
                    </div>
                    <div className="text-3xl font-black text-[#0a7c42]">
                      {bTotalNow * 3}
                    </div>
                    <div className="text-xs text-stone-500">per week</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 mt-4 text-sm text-stone-600">
                  <p className="font-bold text-stone-900 mb-2">
                    Same {data.bottleneckPeople} people. No new hires.
                  </p>
                  <p className="mb-2">
                    <strong>Month 1 (2x):</strong>{" "}
                    {bTotalNow * 2}/week. AI pre-fills data and generates
                    templates. Your team reviews and handles exceptions.
                  </p>
                  <p>
                    <strong>Month 3 (3x):</strong>{" "}
                    {bTotalNow * 3}/week. AI runs the routine steps end-to-end.
                    Team focuses on client relationships and quality.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Margin Impact */}
          <div className={card}>
            <h3 className="text-lg font-bold text-[#0a1628] mb-1">
              What a Few Margin Points Mean at Your Scale
            </h3>
            <p className="text-sm text-stone-500 mb-4">
              At ${(rev / 1000000).toFixed(0)}M in revenue, small margin
              improvements have outsized impact.
            </p>

            <div className="space-y-3">
              {[1, 2, 3].map((pts) => {
                const additionalProfit = Math.round(rev * (pts / 100));
                const newMargin = margin + pts / 100;
                return (
                  <div
                    key={pts}
                    className={`flex items-center justify-between p-4 rounded-xl border ${
                      pts === 2
                        ? "bg-[#c9a84c]/10 border-[#c9a84c]/30"
                        : "bg-stone-50 border-stone-200"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-[#0a1628]">
                        +{pts} margin point{pts > 1 ? "s" : ""}
                      </div>
                      <div className="text-xs text-stone-500">
                        {data.margin === -1 ? "~7" : (margin * 100).toFixed(0)}%
                        → {(newMargin * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-[#0a7c42]">
                        +${additionalProfit.toLocaleString()}
                      </div>
                      <div className="text-xs text-stone-500">per year</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-stone-400 mt-4 italic">
              These are pure profit dollars — no additional revenue or customers
              needed. Just less waste in how work gets done.
            </p>
          </div>

          {/* Insights */}
          <div className={card}>
            <h3 className="text-lg font-bold text-[#0a1628] mb-3">
              What This Means for Your Business
            </h3>

            <div className="py-3 border-b border-stone-100 text-sm text-stone-600">
              <strong className="text-[#0a1628]">
                Serve more customers without hiring:
              </strong>{" "}
              Your team spends {data.admin}% of their time on admin. AI can
              automate most of that down to ~20%, freeing{" "}
              <strong>{recoverableHoursPerWeek} hours per week</strong> for
              actual customer work. That&apos;s{" "}
              <span className="font-bold text-[#0a7c42]">
                {capacityPct}% more capacity
              </span>{" "}
              — enough to take on significantly more clients at your current
              quality level.
            </div>

            <div className="py-3 border-b border-stone-100 text-sm text-stone-600">
              <strong className="text-[#0a1628]">
                Improve margins as you grow:
              </strong>{" "}
              When your team handles more revenue with the same headcount, your
              margin moves from{" "}
              <strong>
                {data.margin === -1 ? "~7" : (margin * 100).toFixed(0)}%
              </strong>{" "}
              toward <strong>{(potentialMargin * 100).toFixed(0)}%</strong>.
              That&apos;s{" "}
              <span className="font-bold text-[#0a7c42]">
                ${recoverableLaborValue.toLocaleString()}/year
              </span>{" "}
              in labor value redirected from busywork to billable output.
            </div>

            {revenuePerEmployee < 250000 && (
              <div className="py-3 border-b border-stone-100 text-sm text-stone-600">
                <strong className="text-[#0a1628]">
                  Revenue per person:
                </strong>{" "}
                At ${Math.round(revenuePerEmployee).toLocaleString()}/employee,
                there&apos;s room to grow toward the $250K+ benchmark for
                optimized service businesses — not by working harder, but by
                removing the operational drag that limits throughput.
              </div>
            )}

            {data.margin === -1 && (
              <div className="py-3 text-sm text-stone-600">
                <strong className="text-[#0a1628]">
                  Visibility opportunity:
                </strong>{" "}
                Not knowing your exact margin is common at your stage — and
                it&apos;s the first thing we solve. When you can see where every
                dollar flows, the optimization path becomes clear.
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-[#0a1628] to-[#162a46] text-white rounded-2xl p-10 text-center mt-8">
            <h3 className="text-2xl font-black mb-3">
              Ready to see your exact numbers?
            </h3>
            <p className="text-sm opacity-80 mb-6 max-w-md mx-auto">
              This calculator uses industry benchmarks. A Phase I diagnostic
              maps <em>your</em> actual workflows and team — and builds a
              specific implementation roadmap.
            </p>
            <a
              href={calendlyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#c9a84c] text-[#0a1628] font-black py-4 px-10 rounded-xl text-lg transition-all hover:brightness-110"
            >
              Book a 15-Minute Call
            </a>
            <div className="text-xs opacity-50 mt-3">
              We&apos;ll walk through your results and see if a diagnostic makes
              sense.
            </div>
          </div>

          <div className="text-center text-xs text-stone-400 mt-10 pt-5 border-t border-stone-200">
            Estimates based on industry benchmarks for founder-led service
            businesses ($3M-$10M revenue). Actual results depend on your
            specific operations. A Phase I diagnostic maps your exact numbers.
          </div>
        </div>
      </div>
    );
  }

  // ── Step UI ─────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <div className="max-w-[720px] mx-auto px-6 py-10 pb-20">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            href="/"
            className="text-xl font-display tracking-tight text-stone-900 hover:text-stone-600 transition-colors inline-block mb-6"
          >
            CappaWork
          </Link>
          <div className="inline-block bg-[#0a1628] text-white text-[10px] font-bold tracking-[2px] uppercase px-4 py-1 rounded-full mb-4">
            Free Assessment
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#0a1628] mb-3">
            AI Capacity Calculator
          </h1>
          <p className="text-stone-500 max-w-md mx-auto">
            See how many more customers your team can serve when AI handles the
            busywork. Takes 2 minutes.
          </p>
        </div>

        {/* Progress */}
        <div className="text-center text-xs font-semibold text-stone-400 mb-2">
          Question {Math.min(step, 5)} of {totalSteps - 1}
          {step === 6 && " — Almost there"}
        </div>
        <div className="bg-stone-200 rounded-full h-1.5 mb-10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0a1628] to-[#c9a84c] rounded-full transition-all duration-500"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step 1: Revenue */}
        {step === 1 && (
          <div className={card}>
            <h2 className="text-xl font-bold text-stone-900 mb-1">
              What&apos;s your annual revenue?
            </h2>
            <p className="text-sm text-stone-500 mb-5">
              Approximate is fine. This helps us model the size of your
              opportunity.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { v: 2000000, l: "$1M - $3M", s: "Early scale" },
                { v: 4000000, l: "$3M - $5M", s: "Growth stage" },
                { v: 7000000, l: "$5M - $10M", s: "Scaling" },
                { v: 12000000, l: "$10M+", s: "Established" },
              ].map((o) => (
                <button
                  key={o.v}
                  className={`${optionBase} ${data.revenue === o.v ? optionSelected : ""}`}
                  onClick={() => set("revenue", o.v)}
                >
                  <span className="block">{o.l}</span>
                  <span className="block text-xs font-normal opacity-70 mt-0.5">
                    {o.s}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                className={btnPrimary}
                disabled={!data.revenue}
                onClick={() => goTo(2)}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Headcount */}
        {step === 2 && (
          <div className={card}>
            <h2 className="text-xl font-bold text-stone-900 mb-1">
              How many full-time employees?
            </h2>
            <p className="text-sm text-stone-500 mb-5">
              Include full-time equivalents. Contractors count if they work 30+
              hrs/week.
            </p>
            <div className="text-center text-4xl font-black text-[#0a1628] mb-2">
              {data.headcount}
            </div>
            <input
              type="range"
              min={3}
              max={15}
              value={data.headcount}
              onChange={(e) => set("headcount", parseInt(e.target.value))}
              className="w-full h-1.5 appearance-none bg-stone-200 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-[#0a1628] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400 mt-1">
              <span>3</span>
              <span>5</span>
              <span>8</span>
              <span>10</span>
              <span>15</span>
            </div>
            <div className="flex gap-3 mt-6">
              <button className={btnBack} onClick={() => goTo(1)}>
                Back
              </button>
              <button className={btnPrimary} onClick={() => goTo(3)}>
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Profit Margin */}
        {step === 3 && (
          <div className={card}>
            <h2 className="text-xl font-bold text-stone-900 mb-1">
              What&apos;s your approximate net profit margin?
            </h2>
            <p className="text-sm text-stone-500 mb-5">
              Best guess is fine. This tells us how much room there is to
              improve your bottom line.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { v: 0.03, l: "Under 5%", s: "Barely breaking even" },
                { v: 0.08, l: "5% - 10%", s: "Thin but positive" },
                { v: 0.15, l: "10% - 20%", s: "Healthy range" },
                { v: 0.25, l: "20%+", s: "Strong" },
              ].map((o) => (
                <button
                  key={o.v}
                  className={`${optionBase} ${data.margin === o.v ? optionSelected : ""}`}
                  onClick={() => set("margin", o.v)}
                >
                  <span className="block">{o.l}</span>
                  <span className="block text-xs font-normal opacity-70 mt-0.5">
                    {o.s}
                  </span>
                </button>
              ))}
              <button
                className={`${optionBase} col-span-2 ${data.margin === -1 ? optionSelected : ""}`}
                onClick={() => set("margin", -1)}
              >
                <span className="block">Not sure right now</span>
                <span className="block text-xs font-normal opacity-70 mt-0.5">
                  We&apos;ll use a conservative estimate
                </span>
              </button>
            </div>
            {data.margin !== null && data.revenue && (
              <div className="mt-4 bg-stone-50 border border-stone-200 rounded-xl p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Why this matters
                </div>
                <p className="text-sm text-stone-700">
                  At ${(data.revenue / 1000000).toFixed(0)}M in revenue, every{" "}
                  <strong className="text-[#0a1628]">1% of margin</strong> ={" "}
                  <strong className="text-[#0a7c42]">
                    ${Math.round(data.revenue * 0.01).toLocaleString()}/year
                  </strong>{" "}
                  straight to your bottom line. A 2-point improvement means{" "}
                  <strong className="text-[#0a7c42]">
                    ${Math.round(data.revenue * 0.02).toLocaleString()}
                  </strong>{" "}
                  more in annual profit — without adding a single customer.
                </p>
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <button className={btnBack} onClick={() => goTo(2)}>
                Back
              </button>
              <button
                className={btnPrimary}
                disabled={data.margin === null}
                onClick={() => goTo(4)}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Admin Time */}
        {step === 4 && (
          <div className={card}>
            <h2 className="text-xl font-bold text-stone-900 mb-1">
              What percentage of your team&apos;s time goes to admin and
              repetitive tasks?
            </h2>
            <p className="text-sm text-stone-500 mb-5">
              Data entry, status updates, moving info between systems, formatting
              reports, scheduling, follow-ups — anything that&apos;s not
              directly serving customers.
            </p>
            <div className="text-center text-4xl font-black text-[#0a1628] mb-2">
              {data.admin}%
            </div>
            <input
              type="range"
              min={10}
              max={80}
              value={data.admin}
              onChange={(e) => set("admin", parseInt(e.target.value))}
              className="w-full h-1.5 appearance-none bg-stone-200 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-[#0a1628] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400 mt-1">
              <span>10%</span>
              <span>25%</span>
              <span>40%</span>
              <span>55%</span>
              <span>70%+</span>
            </div>
            <div className="flex gap-3 mt-6">
              <button className={btnBack} onClick={() => goTo(3)}>
                Back
              </button>
              <button className={btnPrimary} onClick={() => goTo(5)}>
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Bottleneck */}
        {step === 5 && (
          <div className={card}>
            <h2 className="text-xl font-bold text-stone-900 mb-1">
              What&apos;s the one process you wish your team could do 3x faster?
            </h2>
            <p className="text-sm text-stone-500 mb-5">
              Client onboarding, proposal generation, reporting, invoice
              processing — the one where volume is the bottleneck.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">
                  What is it?
                </label>
                <input
                  type="text"
                  placeholder="e.g., Client onboarding, monthly reporting..."
                  value={data.bottleneckName}
                  onChange={(e) => set("bottleneckName", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">
                  How many can one person handle per week manually?
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="e.g., 10"
                    min={1}
                    value={data.bottleneckCurrent || ""}
                    onChange={(e) =>
                      set(
                        "bottleneckCurrent",
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    className={inputClass}
                  />
                  <span className="text-xs text-stone-400 shrink-0">
                    per week
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">
                  How many people do this task?
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="e.g., 3"
                    min={1}
                    value={data.bottleneckPeople || ""}
                    onChange={(e) =>
                      set(
                        "bottleneckPeople",
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    className={inputClass}
                  />
                  <span className="text-xs text-stone-400 shrink-0">
                    people
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className={btnBack} onClick={() => goTo(4)}>
                Back
              </button>
              <button className={btnPrimary} onClick={() => goTo(6)}>
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Lead Capture */}
        {step === 6 && (
          <div className={card}>
            <h2 className="text-xl font-bold text-stone-900 mb-1">
              Where should we send your results?
            </h2>
            <p className="text-sm text-stone-500 mb-5">
              We&apos;ll calculate your custom opportunity report and follow up
              with ideas specific to your business.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">
                  First name
                </label>
                <input
                  type="text"
                  placeholder="Nathan"
                  value={lead.firstName}
                  onChange={(e) =>
                    setLead((prev) => ({ ...prev, firstName: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">
                  Work email
                </label>
                <input
                  type="email"
                  placeholder="nathan@company.com"
                  value={lead.email}
                  onChange={(e) =>
                    setLead((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">
                  Company name
                </label>
                <input
                  type="text"
                  placeholder="Acme Services"
                  value={lead.company}
                  onChange={(e) =>
                    setLead((prev) => ({ ...prev, company: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
            </div>
            {leadError && (
              <p className="text-sm text-red-600 mt-3">{leadError}</p>
            )}
            <div className="flex gap-3 mt-6">
              <button className={btnBack} onClick={() => goTo(5)}>
                Back
              </button>
              <button
                className={btnPrimary}
                disabled={leadSaving}
                onClick={submitLead}
              >
                {leadSaving ? "Calculating..." : "See My Results"}
              </button>
            </div>
            <p className="text-xs text-stone-400 mt-4 text-center">
              No spam. We&apos;ll only reach out if we think we can help.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Helper components ───────────────────────────────────────

function MathRow({
  label,
  formula,
  value,
  highlight,
}: {
  label: string;
  formula?: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-stone-100 text-sm">
      <span className="text-stone-500 flex-1">{label}</span>
      {formula && (
        <span className="text-stone-400 text-xs font-mono flex-1 text-center">
          {formula}
        </span>
      )}
      <span
        className={`font-bold text-right min-w-[100px] ${highlight ? "text-[#0a7c42]" : "text-stone-900"}`}
      >
        {value}
      </span>
    </div>
  );
}
