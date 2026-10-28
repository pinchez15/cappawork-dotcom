"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  FileImage,
  Loader2,
  Printer,
  Upload,
} from "lucide-react";
import { ExtractionWorkspace } from "./extraction-workspace";
import { QuoteView } from "./quote-view";
import { formatUsd } from "@/lib/demo/simplified-safety/catalog";
import { buildQuote } from "@/lib/demo/simplified-safety/quote-engine";
import {
  DEFAULT_ANSWERS,
  SAMPLES,
  type SampleImage,
} from "@/lib/demo/simplified-safety/samples";
import type {
  ClarifyingAnswers,
  ExtractionResult,
  QuoteResult,
} from "@/lib/demo/simplified-safety/types";

type Step = "upload" | "extract" | "questions" | "quote";

const STEPS: { id: Step; label: string }[] = [
  { id: "upload", label: "Upload" },
  { id: "extract", label: "Takeoff" },
  { id: "questions", label: "Clarify" },
  { id: "quote", label: "Quote" },
];

export function DemoApp() {
  const [step, setStep] = useState<Step>("upload");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [extraction, setExtraction] = useState<ExtractionResult | null>(null);
  const [extractMode, setExtractMode] = useState<string | null>(null);
  const [extractNotice, setExtractNotice] = useState<string | null>(null);
  const [answers, setAnswers] = useState<ClarifyingAnswers>(DEFAULT_ANSWERS);
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const quotePreview = useMemo(() => {
    if (!extraction) return null;
    return buildQuote(extraction, answers);
  }, [extraction, answers]);

  async function runExtraction(opts: {
    sampleId?: string;
    file?: File;
    defaults?: ClarifyingAnswers;
  }) {
    setError(null);
    setExtractNotice(null);
    setStep("extract");
    setExtraction(null);
    setPending(true);

    try {
      let res: Response;
      if (opts.sampleId) {
        res = await fetch("/api/demo/simplified-safety/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sampleId: opts.sampleId }),
        });
      } else if (opts.file) {
        const fd = new FormData();
        fd.append("image", opts.file);
        res = await fetch("/api/demo/simplified-safety/extract", {
          method: "POST",
          body: fd,
        });
      } else {
        throw new Error("Nothing to extract");
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Extraction failed");

      setExtraction(data.extraction as ExtractionResult);
      setExtractMode(data.mode ?? data.extraction?.source ?? "unknown");
      setExtractNotice(data.notice ?? null);
      if (opts.defaults) setAnswers(opts.defaults);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Extraction failed");
      setStep("upload");
    } finally {
      setPending(false);
    }
  }

  function selectSample(sample: SampleImage) {
    setImageSrc(sample.imagePath);
    setImageName(sample.name);
    setAnswers(sample.defaultAnswers);
    void runExtraction({ sampleId: sample.id, defaults: sample.defaultAnswers });
  }

  function onFileChange(file: File | null) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setImageName(file.name);
    setAnswers(DEFAULT_ANSWERS);
    void runExtraction({ file });
  }

  function goToQuote() {
    if (!extraction) return;
    const q = buildQuote(extraction, answers, `Demo — ${imageName || "Roof project"}`);
    setQuote(q);
    setStep("quote");
  }

  const sourceLabel =
    extraction?.source === "precomputed"
      ? "Precomputed"
      : extraction?.source === "live_ai"
        ? `Live AI${extractMode ? ` · ${extractMode}` : ""}`
        : "Simulated";

  const isWorkspace = step === "extract" && !pending && extraction && imageSrc;

  return (
    <div
      className={`mx-auto flex max-w-7xl flex-col px-4 print:max-w-none ${
        isWorkspace ? "h-[100dvh] py-3 sm:px-5" : "min-h-screen py-5 sm:px-6 lg:px-8"
      }`}
    >
      <header className="shrink-0 print:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-700">
                CappaWork × Simplified Safety
              </p>
              <span className="hidden text-[10px] text-stone-400 sm:inline">
                Plan-to-order
              </span>
            </div>
            {!isWorkspace && (
              <h1 className="mt-0.5 font-display text-3xl text-stone-900 sm:text-4xl">
                Plan-to-order demo
              </h1>
            )}
          </div>
          <div className="hidden shrink-0 text-right text-[11px] text-stone-500 sm:block">
            <div className="font-medium text-stone-800">Nate × Dan · Oct 30</div>
            <div>KeeGuard · Kee Dome · Kee Gate</div>
          </div>
        </div>

        <nav className="mt-3 flex items-center gap-1" aria-label="Demo steps">
          {STEPS.map((s, i) => {
            const active = step === s.id;
            const done =
              STEPS.findIndex((x) => x.id === step) > STEPS.findIndex((x) => x.id === s.id);
            return (
              <div key={s.id} className="flex items-center gap-1">
                {i > 0 && <span className="mx-0.5 h-px w-4 bg-stone-300 sm:w-6" />}
                <span
                  className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-semibold ${
                    active
                      ? "bg-stone-900 text-white"
                      : done
                        ? "bg-blue-50 text-blue-800"
                        : "bg-stone-100 text-stone-400"
                  }`}
                >
                  {done ? <CheckCircle2 className="h-3 w-3" /> : <span>{i + 1}</span>}
                  {s.label}
                </span>
              </div>
            );
          })}
        </nav>
      </header>

      {error && (
        <div className="mt-3 shrink-0 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 print:hidden">
          {error}
        </div>
      )}

      {step === "upload" && (
        <section className="mt-5 space-y-5 print:hidden">
          <div>
            <h2 className="text-sm font-semibold text-stone-900">Choose a drawing</h2>
            <p className="mt-0.5 text-xs text-stone-500">
              Blueprint / roof plan preferred. Samples include hand-checked takeoffs for a reliable
              demo.
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => selectSample(sample)}
                  className="group overflow-hidden rounded-lg border border-stone-200 bg-white text-left transition hover:border-blue-400"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sample.imagePath}
                    alt={sample.name}
                    className="h-36 w-full object-cover object-top"
                  />
                  <div className="p-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                      <FileImage className="h-3 w-3" />
                      {sample.kind}
                    </div>
                    <div className="mt-0.5 text-sm font-semibold text-stone-900 group-hover:text-blue-700">
                      {sample.name}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs text-stone-500">
                      {sample.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-dashed border-stone-300 bg-white px-5 py-6 text-center">
            <Upload className="mx-auto h-6 w-6 text-stone-400" />
            <h2 className="mt-2 text-sm font-semibold text-stone-900">Upload a plan or photo</h2>
            <p className="mx-auto mt-1 max-w-lg text-xs text-stone-500">
              Dimensioned blueprints work best. Live vision needs{" "}
              <code className="rounded bg-stone-100 px-1">ANTHROPIC_API_KEY</code> or{" "}
              <code className="rounded bg-stone-100 px-1">OPENAI_API_KEY</code>; otherwise a labeled
              simulated takeoff is returned.
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Choose image
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>
      )}

      {step === "extract" && (
        <section className="mt-3 flex min-h-0 flex-1 flex-col print:hidden">
          {pending || !extraction || !imageSrc ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-stone-200 bg-white">
              <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
              <p className="mt-2 text-sm font-medium text-stone-700">
                Reading outline, edges, and openings…
              </p>
            </div>
          ) : (
            <ExtractionWorkspace
              imageSrc={imageSrc}
              imageName={imageName}
              extraction={extraction}
              sourceLabel={sourceLabel}
              notice={extractNotice}
              onBack={() => setStep("upload")}
              onContinue={() => setStep("questions")}
            />
          )}
        </section>
      )}

      {step === "questions" && extraction && (
        <section className="mt-5 space-y-4 print:hidden">
          <div>
            <h2 className="text-base font-semibold text-stone-900">Site conditions</h2>
            <p className="text-xs text-stone-500">
              Defaults are filled from the takeoff. A known dimension recalibrates all lengths.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <fieldset className="space-y-3 rounded-lg border border-stone-200 bg-white p-4">
              <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-stone-500">
                Geometry
              </legend>

              <Field label="Roof profile">
                <select
                  className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm"
                  value={answers.roofProfile}
                  onChange={(e) =>
                    setAnswers((a) => ({
                      ...a,
                      roofProfile: e.target.value as ClarifyingAnswers["roofProfile"],
                    }))
                  }
                >
                  <option value="flat">Flat / low-slope</option>
                  <option value="pitched">Pitched</option>
                </select>
              </Field>

              {answers.roofProfile === "pitched" && (
                <Field label="Pitch (degrees)" hint="KeeGuard freestanding rated to 5°.">
                  <input
                    type="number"
                    min={0}
                    max={45}
                    className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
                    value={answers.pitchDegrees}
                    onChange={(e) =>
                      setAnswers((a) => ({ ...a, pitchDegrees: Number(e.target.value) || 0 }))
                    }
                  />
                </Field>
              )}

              <Field
                label="Parapet height (in)"
                hint="≥21 in may waive midrail; ≥39 in may omit perimeter rail."
              >
                <input
                  type="number"
                  min={0}
                  max={60}
                  className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
                  value={answers.parapetHeightIn}
                  onChange={(e) =>
                    setAnswers((a) => ({ ...a, parapetHeightIn: Number(e.target.value) || 0 }))
                  }
                />
              </Field>

              <Field
                label={`Known dimension — ${answers.knownDimensionLabel}`}
                hint={`Rescales vs longest extracted edge (${Math.max(...extraction.edgeLengthsFt)} ft).`}
              >
                <input
                  type="number"
                  min={1}
                  step={0.1}
                  className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
                  value={answers.knownDimensionFt ?? ""}
                  placeholder="e.g. 180"
                  onChange={(e) =>
                    setAnswers((a) => ({
                      ...a,
                      knownDimensionFt: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                />
              </Field>
            </fieldset>

            <fieldset className="space-y-3 rounded-lg border border-stone-200 bg-white p-4">
              <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-stone-500">
                System
              </legend>

              <Field label="Mounting">
                <select
                  className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm"
                  value={answers.mountingType}
                  onChange={(e) =>
                    setAnswers((a) => ({
                      ...a,
                      mountingType: e.target.value as ClarifyingAnswers["mountingType"],
                    }))
                  }
                >
                  <option value="non_penetrating">Non-penetrating counterweighted (KeeGuard)</option>
                  <option value="fixed">Fixed / top-fix</option>
                </select>
              </Field>

              <Field
                label="Permanent or temporary"
                hint="Temporary prefers skylight screens over Kee Dome kits."
              >
                <select
                  className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm"
                  value={answers.permanence}
                  onChange={(e) =>
                    setAnswers((a) => ({
                      ...a,
                      permanence: e.target.value as ClarifyingAnswers["permanence"],
                    }))
                  }
                >
                  <option value="permanent">Permanent</option>
                  <option value="temporary">Temporary</option>
                </select>
              </Field>

              <Field label="Finish / color">
                <select
                  className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm"
                  value={answers.finish}
                  onChange={(e) =>
                    setAnswers((a) => ({
                      ...a,
                      finish: e.target.value as ClarifyingAnswers["finish"],
                    }))
                  }
                >
                  <option value="galvanized">Galvanized (standard)</option>
                  <option value="safety_yellow">Safety yellow (gates)</option>
                  <option value="ral_custom">RAL custom powder coat (quote separately)</option>
                </select>
              </Field>

              {quotePreview && (
                <div className="rounded-md bg-stone-50 px-3 py-3">
                  <div className="text-[10px] uppercase tracking-wide text-stone-500">
                    Live estimate
                  </div>
                  <div className="font-mono text-2xl font-semibold tabular-nums text-stone-900">
                    {formatUsd(quotePreview.subtotal)}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {quotePreview.lineItems.length} lines ·{" "}
                    {quotePreview.guardedPerimeterFt.toLocaleString()} lf guarded
                  </div>
                </div>
              )}
            </fieldset>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStep("extract")}
              className="rounded-md border border-stone-300 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-white"
            >
              ← Back to takeoff
            </button>
            <button
              type="button"
              onClick={goToQuote}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Generate quote
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>
      )}

      {step === "quote" && quote && (
        <div className="mt-4">
          <QuoteView quote={quote} onPrint={() => window.print()} onBack={() => setStep("questions")} />
        </div>
      )}

      {!isWorkspace && (
        <footer className="mt-8 border-t border-stone-200 pt-4 text-[11px] text-stone-500 print:hidden">
          <p>
            Demo only — not a production SSI quote. Sources:{" "}
            <a className="underline" href="https://simplifiedsafety.com/" target="_blank" rel="noreferrer">
              simplifiedsafety.com
            </a>
            ,{" "}
            <a
              className="underline"
              href="https://www.simplifiedbuilding.com/"
              target="_blank"
              rel="noreferrer"
            >
              simplifiedbuilding.com
            </a>
            .
          </p>
          <p className="mt-1 inline-flex items-center gap-1">
            <Printer className="h-3 w-3" /> Print / Save as PDF on the quote step.
          </p>
        </footer>
      )}

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #ssi-quote-print,
          #ssi-quote-print * {
            visibility: visible;
          }
          #ssi-quote-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="text-xs font-medium text-stone-700">{label}</span>
      <div className="mt-1">{children}</div>
      {hint && <span className="mt-1 block text-[11px] text-stone-500">{hint}</span>}
    </label>
  );
}
