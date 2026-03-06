"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────

type Data = {
  revenue: number | null;
  margin: number | null;
  headcount: number;
  tools: number | null;
  admin: number;
  growth: number | null;
  bottleneckName: string;
  bottleneckCurrent: number | null;
  bottleneckPeople: number | null;
};

// ── Component ──────────────────────────────────────────────────

export function ProfitCalculator() {
  const [step, setStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [data, setData] = useState<Data>({
    revenue: null,
    margin: null,
    headcount: 12,
    tools: null,
    admin: 40,
    growth: null,
    bottleneckName: "",
    bottleneckCurrent: null,
    bottleneckPeople: null,
  });

  const calendlyLink =
    process.env.NEXT_PUBLIC_CALENDLY_LINK ||
    "https://calendly.com/cappawork/discovery_call";

  const totalSteps = 7;

  const set = useCallback(
    (key: keyof Data, value: Data[keyof Data]) =>
      setData((prev) => ({ ...prev, [key]: value })),
    []
  );

  function goTo(n: number) {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function calculate() {
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Calculations ────────────────────────────────────────────

  const rev = data.revenue || 0;
  const hc = data.headcount;
  const margin = data.margin === -1 ? 0.07 : data.margin || 0;
  const tools = data.tools || 0;
  const adminPct = data.admin / 100;
  const growthMult = data.growth || 1;

  const revenuePerEmployee = hc > 0 ? rev / hc : 0;
  const currentProfit = rev * margin;

  const avgFullyLoadedCost = rev < 5000000 ? 75000 : 90000;
  const totalLaborCost = hc * avgFullyLoadedCost;
  const recoverableAdminPct = Math.max(0, adminPct - 0.2);

  const hourlyRate = Math.round(avgFullyLoadedCost / 2080);
  const adminHoursPerWeek = Math.round(hc * 40 * adminPct);
  const recoverableHoursPerWeek = Math.round(hc * 40 * recoverableAdminPct);
  const recoverableLaborValue = recoverableHoursPerWeek * 52 * hourlyRate;

  const avgToolCostPerUser = 150;
  const toolWaste = Math.round(tools * hc * avgToolCostPerUser * 12 * 0.3);

  const totalOpportunity = recoverableLaborValue + toolWaste;

  const potentialProfit = currentProfit + totalOpportunity;
  const potentialMargin = rev > 0 ? Math.min(0.2, potentialProfit / rev) : 0;

  // Growth projections
  const futureRev = rev * growthMult;
  const futureHC = Math.ceil(hc * growthMult * 0.95);
  const nonLaborCosts = rev - totalLaborCost - currentProfit;
  const futureNonLaborCosts = nonLaborCosts * (1 + (growthMult - 1) * 0.7);
  const additionalNewEmployees = futureHC - hc;
  const hiringCostPerEmployee = 15000;
  const optimizedFutureHC = Math.ceil(hc * growthMult * 0.7);
  const optimizedNewHires = Math.max(0, optimizedFutureHC - hc);

  // Bottleneck
  const hasBottleneck =
    data.bottleneckName && data.bottleneckCurrent && data.bottleneckPeople;
  const bTotalNow = (data.bottleneckCurrent || 0) * (data.bottleneckPeople || 0);
  const conservativeMultiplier = 3;
  const moderateMultiplier = 5;
  const aggressiveMultiplier = 10;

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

  const growthLabel =
    growthMult === 1.25
      ? "25%"
      : growthMult === 1.5
        ? "50%"
        : growthMult === 2
          ? "100%"
          : "10%";

  // ── Render ──────────────────────────────────────────────────

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
              Your AI Opportunity
            </div>
            <div className="text-5xl font-black tracking-tight mb-1">
              ${totalOpportunity.toLocaleString()}
            </div>
            <div className="text-base opacity-80">
              in annual profit waiting to be captured
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
                Generating ${Math.round(revenuePerEmployee).toLocaleString()}{" "}
                per person
              </div>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                With AI Optimization
              </div>
              <div className="text-2xl font-black text-stone-900">
                {(potentialMargin * 100).toFixed(0)}% margin
              </div>
              <div className="text-xs text-stone-500 mt-1">
                Up from {data.margin === -1 ? "~7" : (margin * 100).toFixed(0)}
                % today
              </div>
            </div>
            <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-xl p-5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                Capacity You Can Unlock
              </div>
              <div className="text-2xl font-black text-[#92750a]">
                {recoverableHoursPerWeek} hrs/wk
              </div>
              <div className="text-xs text-stone-500 mt-1">
                {data.admin}% admin → 20% with automation
              </div>
            </div>
            {toolWaste > 5000 && (
              <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-xl p-5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Tool Consolidation Savings
                </div>
                <div className="text-2xl font-black text-[#92750a]">
                  ${toolWaste.toLocaleString()}/yr
                </div>
                <div className="text-xs text-stone-500 mt-1">
                  {tools} tools → streamlined stack
                </div>
              </div>
            )}
          </div>

          {/* Math section */}
          <div className={card}>
            <h3 className="text-lg font-bold text-[#0a1628] mb-1">
              The Math Behind Your Opportunity
            </h3>
            <p className="text-sm text-stone-500 mb-4">
              Every line uses your inputs. No black boxes.
            </p>

            <div className="text-[11px] font-bold uppercase tracking-wider text-[#0a7c42] mb-2">
              Capacity AI Can Unlock
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
              label="Hours AI can give back"
              formula={`${hc * 40} x ${Math.round(recoverableAdminPct * 100)}%`}
              value={`${recoverableHoursPerWeek} hrs/wk`}
              highlight
            />
            <MathRow
              label="That's like adding"
              formula={`${recoverableHoursPerWeek} / 40`}
              value={`${(recoverableHoursPerWeek / 40).toFixed(1)} full-time people`}
              highlight
            />
            <MathRow
              label="Value of that capacity"
              formula={`${recoverableHoursPerWeek} hrs x 52 wks x $${hourlyRate}/hr`}
              value={`$${recoverableLaborValue.toLocaleString()}/yr`}
            />

            {toolWaste > 5000 && (
              <>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#0a7c42] mt-5 mb-2">
                  Software Stack Savings
                </div>
                <MathRow label="Current tools" value={`${tools} tools`} />
                <MathRow
                  label="Est. annual tool spend"
                  formula={`${tools} x ${hc} x $${avgToolCostPerUser} x 12`}
                  value={`$${Math.round(tools * hc * avgToolCostPerUser * 12).toLocaleString()}`}
                />
                <MathRow
                  label="Savings from consolidation (est. 30%)"
                  formula="x 0.30"
                  value={`$${toolWaste.toLocaleString()}/yr`}
                  highlight
                />
              </>
            )}

            <div className="border-t-2 border-[#0a7c42] mt-5 pt-3">
              <div className="flex justify-between items-center py-2">
                <span className="font-bold text-stone-900 text-sm">
                  Total Annual Opportunity
                </span>
                <span className="font-black text-[#0a7c42] text-lg">
                  ${totalOpportunity.toLocaleString()}/yr
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 mt-4 italic">
              Conservative estimates using industry benchmarks. A diagnostic
              maps your exact numbers — the real opportunity is usually larger.
            </p>
          </div>

          {/* Bottleneck multiplier */}
          {hasBottleneck && (
            <div className={card}>
              <h3 className="text-lg font-bold text-[#0a1628] mb-1">
                What {data.bottleneckName} Looks Like at {moderateMultiplier}x
                Speed
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
                      {(data.bottleneckPeople || 0) *
                        (data.bottleneckCurrent || 0) *
                        moderateMultiplier}
                    </div>
                    <div className="text-xs text-stone-500">per week</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 mt-4 text-sm text-stone-600">
                  <p className="font-bold text-stone-900 mb-2">
                    Same {data.bottleneckPeople} people. No new hires.
                  </p>
                  <p className="mb-2">
                    <strong>Month 1 ({conservativeMultiplier}x):</strong>{" "}
                    {(data.bottleneckPeople || 0) *
                      (data.bottleneckCurrent || 0) *
                      conservativeMultiplier}
                    /week. AI pre-fills data and generates templates. Your team
                    reviews and handles exceptions.
                  </p>
                  <p className="mb-2">
                    <strong>Month 3 ({moderateMultiplier}x):</strong>{" "}
                    {(data.bottleneckPeople || 0) *
                      (data.bottleneckCurrent || 0) *
                      moderateMultiplier}
                    /week. AI runs the process end-to-end. Team focuses on
                    client relationships.
                  </p>
                  <p>
                    <strong>Fully optimized ({aggressiveMultiplier}x):</strong>{" "}
                    {(data.bottleneckPeople || 0) *
                      (data.bottleneckCurrent || 0) *
                      aggressiveMultiplier}
                    /week. Automated pipeline with human oversight on
                    exceptions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Insights */}
          <div className={card}>
            <h3 className="text-lg font-bold text-[#0a1628] mb-3">
              Where the Biggest Wins Are
            </h3>

            <div className="py-3 border-b border-stone-100 text-sm text-stone-600">
              <strong className="text-[#0a1628]">Team capacity:</strong> Your
              team spends {data.admin}% of their time on admin work. AI can
              automate most of that down to ~20%, freeing{" "}
              <strong>{recoverableHoursPerWeek} hours per week</strong> —{" "}
              <span className="font-bold text-[#0a7c42]">
                ${recoverableLaborValue.toLocaleString()}/year
              </span>{" "}
              in capacity redirected to client work and strategic projects.
            </div>

            {toolWaste > 10000 && (
              <div className="py-3 border-b border-stone-100 text-sm text-stone-600">
                <strong className="text-[#0a1628]">Streamlined tools:</strong>{" "}
                With {tools} tools across {hc} people, there&apos;s an
                opportunity to consolidate overlapping systems — roughly{" "}
                <span className="font-bold text-[#0a7c42]">
                  ${toolWaste.toLocaleString()}/year
                </span>{" "}
                in savings, plus less context-switching.
              </div>
            )}

            {data.margin === -1 && (
              <div className="py-3 border-b border-stone-100 text-sm text-stone-600">
                <strong className="text-[#0a1628]">
                  Visibility opportunity:
                </strong>{" "}
                Not knowing your exact margin is common at your stage — and
                it&apos;s the first thing we solve. When you can see where every
                dollar flows, the optimization path becomes clear.
              </div>
            )}

            {revenuePerEmployee < 250000 && (
              <div className="py-3 text-sm text-stone-600">
                <strong className="text-[#0a1628]">
                  Revenue per person:
                </strong>{" "}
                At $
                {Math.round(revenuePerEmployee).toLocaleString()}
                /employee, there&apos;s room to grow toward the $250K+ benchmark
                for optimized service businesses. Not by working harder — by
                removing operational drag.
              </div>
            )}
          </div>

          {/* Growth path */}
          {growthMult > 1.15 ? (
            <div className={card}>
              <h3 className="text-lg font-bold text-[#0a1628] mb-3">
                Your Growth Path: {growthLabel} Revenue, Healthier Margins
              </h3>
              <div className="py-3 border-b border-stone-100 text-sm text-stone-600">
                <strong className="text-[#0a1628]">Without optimization:</strong>{" "}
                Hire {additionalNewEmployees} people, spend ~$
                {(additionalNewEmployees * hiringCostPerEmployee).toLocaleString()}{" "}
                on recruiting and onboarding. Every new hire carries the same{" "}
                {data.admin}% admin load.
              </div>
              <div className="py-3 border-b border-stone-100 text-sm text-stone-600">
                <strong className="text-[#0a1628]">With AI-first operations:</strong>{" "}
                Automate admin from {data.admin}% to 20%. Hit {growthLabel}{" "}
                growth with ~{optimizedNewHires} new hires instead of{" "}
                {additionalNewEmployees}. Every person is more productive from
                day one.
              </div>
              <div className="py-3 text-sm text-stone-600">
                <strong className="text-[#0a1628]">Bottom line:</strong> Margin
                moves from {data.margin === -1 ? "~7" : (margin * 100).toFixed(0)}
                % toward {(potentialMargin * 100).toFixed(0)}% — adding{" "}
                <span className="font-bold text-[#0a7c42]">
                  ${totalOpportunity.toLocaleString()}
                </span>{" "}
                to annual profit before you even start growing. Then that margin
                compounds as you scale.
              </div>
            </div>
          ) : (
            <div className={card}>
              <h3 className="text-lg font-bold text-[#0a1628] mb-3">
                More Profit, Same Headcount
              </h3>
              <div className="py-3 text-sm text-stone-600">
                With AI optimization, your margin moves from{" "}
                <strong>
                  {data.margin === -1 ? "~7" : (margin * 100).toFixed(0)}%
                </strong>{" "}
                toward <strong>{(potentialMargin * 100).toFixed(0)}%</strong>.
                That&apos;s{" "}
                <span className="font-bold text-[#0a7c42]">
                  ${totalOpportunity.toLocaleString()}
                </span>{" "}
                in additional annual profit without adding a single customer or
                dollar of revenue. It drops straight to your bottom line.
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-br from-[#0a1628] to-[#162a46] text-white rounded-2xl p-10 text-center mt-8">
            <h3 className="text-2xl font-black mb-3">
              Ready to see your exact numbers?
            </h3>
            <p className="text-sm opacity-80 mb-6 max-w-md mx-auto">
              This calculator uses industry benchmarks. A Phase I diagnostic
              maps <em>your</em> actual workflows, tools, and team — and builds
              a specific implementation roadmap.
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
            businesses ($3M-$10M revenue). Your actual opportunity depends on
            your specific operations. A Phase I diagnostic maps your exact
            numbers.
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
            AI Opportunity Calculator
          </h1>
          <p className="text-stone-500 max-w-md mx-auto">
            See how much bigger your business gets when AI multiplies what your
            team can do. Takes 2 minutes.
          </p>
        </div>

        {/* Progress */}
        <div className="text-center text-xs font-semibold text-stone-400 mb-2">
          Question {step} of {totalSteps}
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
              max={20}
              value={data.headcount}
              onChange={(e) => set("headcount", parseInt(e.target.value))}
              className="w-full h-1.5 appearance-none bg-stone-200 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-[#0a1628] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400 mt-1">
              <span>3</span>
              <span>5</span>
              <span>10</span>
              <span>15</span>
              <span>20</span>
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
              Best guess is fine. This tells us how much room there is to grow
              your bottom line.
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

        {/* Step 4: Tools */}
        {step === 4 && (
          <div className={card}>
            <h2 className="text-xl font-bold text-stone-900 mb-1">
              How many software tools does your team use daily?
            </h2>
            <p className="text-sm text-stone-500 mb-5">
              CRM, project management, accounting, communication, reporting,
              scheduling — count them all.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { v: 5, l: "1 - 5" },
                { v: 10, l: "6 - 12" },
                { v: 20, l: "13 - 20" },
                { v: 30, l: "20 - 30" },
                { v: 40, l: "30+" },
                { v: 15, l: "No idea" },
              ].map((o) => (
                <button
                  key={o.v}
                  className={`${optionBase} ${data.tools === o.v ? optionSelected : ""}`}
                  onClick={() => set("tools", o.v)}
                >
                  {o.l}
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button className={btnBack} onClick={() => goTo(3)}>
                Back
              </button>
              <button
                className={btnPrimary}
                disabled={!data.tools}
                onClick={() => goTo(5)}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Admin Time */}
        {step === 5 && (
          <div className={card}>
            <h2 className="text-xl font-bold text-stone-900 mb-1">
              What percentage of your team&apos;s time goes to admin and
              repetitive tasks?
            </h2>
            <p className="text-sm text-stone-500 mb-5">
              Data entry, status updates, moving info between systems, formatting
              reports, scheduling, follow-ups.
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
              <button className={btnBack} onClick={() => goTo(4)}>
                Back
              </button>
              <button className={btnPrimary} onClick={() => goTo(6)}>
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Bottleneck */}
        {step === 6 && (
          <div className={card}>
            <h2 className="text-xl font-bold text-stone-900 mb-1">
              What&apos;s the one process you wish ran 10x faster?
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
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl text-sm font-semibold text-stone-900 bg-stone-50 focus:outline-none focus:border-[#0a1628] placeholder:text-stone-300 placeholder:font-normal"
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
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl text-sm font-semibold text-stone-900 bg-stone-50 focus:outline-none focus:border-[#0a1628] placeholder:text-stone-300 placeholder:font-normal"
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
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl text-sm font-semibold text-stone-900 bg-stone-50 focus:outline-none focus:border-[#0a1628] placeholder:text-stone-300 placeholder:font-normal"
                  />
                  <span className="text-xs text-stone-400 shrink-0">
                    people
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className={btnBack} onClick={() => goTo(5)}>
                Back
              </button>
              <button className={btnPrimary} onClick={() => goTo(7)}>
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 7: Growth */}
        {step === 7 && (
          <div className={card}>
            <h2 className="text-xl font-bold text-stone-900 mb-1">
              Where do you want revenue in 12-18 months?
            </h2>
            <p className="text-sm text-stone-500 mb-5">
              This shows what&apos;s possible when operations scale ahead of
              revenue.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { v: 1.25, l: "25% growth", s: "Steady scaling" },
                { v: 1.5, l: "50% growth", s: "Aggressive" },
                { v: 2.0, l: "Double it", s: "2x revenue" },
                { v: 1.1, l: "Maintain", s: "Focus on profit" },
              ].map((o) => (
                <button
                  key={o.v}
                  className={`${optionBase} ${data.growth === o.v ? optionSelected : ""}`}
                  onClick={() => set("growth", o.v)}
                >
                  <span className="block">{o.l}</span>
                  <span className="block text-xs font-normal opacity-70 mt-0.5">
                    {o.s}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button className={btnBack} onClick={() => goTo(6)}>
                Back
              </button>
              <button
                className={btnPrimary}
                disabled={!data.growth}
                onClick={calculate}
              >
                See My Results
              </button>
            </div>
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
