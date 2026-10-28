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
import { AnnotationOverlay, FeatureLegend } from "./annotation-overlay";
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
  { id: "upload", label: "1. Upload" },
  { id: "extract", label: "2. Extraction" },
  { id: "questions", label: "3. Clarify" },
  { id: "quote", label: "4. Quote" },
];

export function DemoApp() {
  const [step, setStep] = useState<Step>("upload");
  const [selectedSample, setSelectedSample] = useState<SampleImage | null>(null);
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
    previewUrl?: string;
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
    setSelectedSample(sample);
    setImageSrc(sample.imagePath);
    setImageName(sample.name);
    setAnswers(sample.defaultAnswers);
    void runExtraction({ sampleId: sample.id, defaults: sample.defaultAnswers });
  }

  function onFileChange(file: File | null) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSelectedSample(null);
    setImageSrc(url);
    setImageName(file.name);
    setAnswers(DEFAULT_ANSWERS);
    void runExtraction({ file, previewUrl: url });
  }

  function goToQuote() {
    if (!extraction) return;
    const q = buildQuote(extraction, answers, `Demo — ${imageName || "Roof project"}`);
    setQuote(q);
    setStep("quote");
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
              CappaWork × Simplified Safety
            </p>
            <h1 className="mt-1 font-display text-4xl text-stone-900 sm:text-5xl">
              Plan-to-order demo
            </h1>
            <p className="mt-2 max-w-2xl text-stone-600">
              Upload a roof plan or satellite photo. AI extracts edges and openings; OSHA rules and
              the Simplified Safety catalog build a priced, auditable order list.
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 shadow-sm">
            <div className="font-medium text-stone-900">For Nate × Dan — Oct 30</div>
            <div>KeeGuard · Kee Dome · Kee Gate</div>
          </div>
        </div>

        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Demo steps">
          {STEPS.map((s) => {
            const active = step === s.id;
            const done =
              STEPS.findIndex((x) => x.id === step) > STEPS.findIndex((x) => x.id === s.id);
            return (
              <span
                key={s.id}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                  active
                    ? "bg-stone-900 text-white"
                    : done
                      ? "bg-blue-50 text-blue-800"
                      : "bg-stone-200/70 text-stone-500"
                }`}
              >
                {done ? <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" /> : null}
                {s.label}
              </span>
            );
          })}
        </nav>
      </header>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 print:hidden">
          {error}
        </div>
      )}

      {step === "upload" && (
        <section className="space-y-8 print:hidden">
          <div>
            <h2 className="text-xl font-semibold text-stone-900">Preloaded samples</h2>
            <p className="mt-1 text-sm text-stone-600">
              One-click takeoffs with hand-checked extractions — demo-safe even if live AI is offline.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => selectSample(sample)}
                  className="group overflow-hidden rounded-2xl border border-stone-200 bg-white text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sample.imagePath}
                    alt={sample.name}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
                      <FileImage className="h-3.5 w-3.5" />
                      {sample.kind}
                    </div>
                    <div className="mt-1 font-semibold text-stone-900 group-hover:text-blue-700">
                      {sample.name}
                    </div>
                    <p className="mt-1 text-sm text-stone-600">{sample.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center">
            <Upload className="mx-auto h-8 w-8 text-stone-400" />
            <h2 className="mt-3 text-lg font-semibold text-stone-900">Or upload your own image</h2>
            <p className="mt-1 text-sm text-stone-600">
              Satellite roof photo, blueprint, or marked-up plan (PNG / JPG). Live vision needs{" "}
              <code className="rounded bg-stone-100 px-1">ANTHROPIC_API_KEY</code> or{" "}
              <code className="rounded bg-stone-100 px-1">OPENAI_API_KEY</code>; otherwise the demo
              returns a labeled simulated extraction.
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
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Choose image
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {step === "extract" && (
        <section className="space-y-6 print:hidden">
          {pending || !extraction || !imageSrc ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="mt-3 text-sm font-medium text-stone-700">
                Reading roof outline, edges, and openings…
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-stone-900">{extraction.title}</h2>
                  <p className="mt-1 text-sm text-stone-600">{extraction.summary}</p>
                </div>
                <SourceBadge source={extraction.source} mode={extractMode} />
              </div>

              {extractNotice && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  {extractNotice}
                </div>
              )}

              <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                <AnnotationOverlay
                  imageSrc={imageSrc}
                  extraction={extraction}
                  alt={imageName || "Roof image"}
                />
                <div className="space-y-4">
                  <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                    <h3 className="font-semibold text-stone-900">Takeoff summary</h3>
                    <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <dt className="text-stone-500">Perimeter</dt>
                        <dd className="text-lg font-semibold tabular-nums">
                          {extraction.perimeterFt.toLocaleString()} lf
                        </dd>
                      </div>
                      <div>
                        <dt className="text-stone-500">Area (est.)</dt>
                        <dd className="text-lg font-semibold tabular-nums">
                          {extraction.estimatedAreaSqFt.toLocaleString()} sf
                        </dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-stone-500">Edge lengths</dt>
                        <dd className="font-medium">
                          {extraction.edgeLengthsFt.map((n) => `${n} ft`).join(" · ")}
                        </dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-stone-500">Scale basis</dt>
                        <dd className="font-medium">{extraction.scale.basis}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-3 font-semibold text-stone-900">Numbered features</h3>
                    <FeatureLegend features={extraction.features} />
                  </div>

                  <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5 text-sm text-stone-700">
                    <h3 className="font-semibold text-stone-900">Assumptions</h3>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      {extraction.assumptions.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setStep("upload")}
                  className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-white"
                >
                  ← Start over
                </button>
                <button
                  type="button"
                  onClick={() => setStep("questions")}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Confirm & continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </section>
      )}

      {step === "questions" && extraction && (
        <section className="space-y-6 print:hidden">
          <div>
            <h2 className="text-xl font-semibold text-stone-900">Clarifying questions</h2>
            <p className="mt-1 text-sm text-stone-600">
              Sensible defaults are pre-filled. A known dimension recalibrates all extracted lengths.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <fieldset className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <legend className="px-1 text-sm font-semibold text-stone-900">Roof geometry</legend>

              <label className="block text-sm">
                <span className="font-medium text-stone-700">Roof profile</span>
                <select
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2"
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
              </label>

              {answers.roofProfile === "pitched" && (
                <label className="block text-sm">
                  <span className="font-medium text-stone-700">Pitch (degrees)</span>
                  <input
                    type="number"
                    min={0}
                    max={45}
                    className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
                    value={answers.pitchDegrees}
                    onChange={(e) =>
                      setAnswers((a) => ({ ...a, pitchDegrees: Number(e.target.value) || 0 }))
                    }
                  />
                  <span className="mt-1 block text-xs text-stone-500">
                    KeeGuard freestanding rated to 5°. Above that, metal-roof / fixed bases.
                  </span>
                </label>
              )}

              <label className="block text-sm">
                <span className="font-medium text-stone-700">Parapet height (inches)</span>
                <input
                  type="number"
                  min={0}
                  max={60}
                  className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
                  value={answers.parapetHeightIn}
                  onChange={(e) =>
                    setAnswers((a) => ({ ...a, parapetHeightIn: Number(e.target.value) || 0 }))
                  }
                />
                <span className="mt-1 block text-xs text-stone-500">
                  ≥21 in may waive midrail; ≥39 in may omit perimeter guardrail (confirm on site).
                </span>
              </label>

              <label className="block text-sm">
                <span className="font-medium text-stone-700">
                  Known dimension to calibrate ({answers.knownDimensionLabel})
                </span>
                <input
                  type="number"
                  min={1}
                  step={0.1}
                  className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
                  value={answers.knownDimensionFt ?? ""}
                  placeholder="e.g. 180"
                  onChange={(e) =>
                    setAnswers((a) => ({
                      ...a,
                      knownDimensionFt: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                />
                <span className="mt-1 block text-xs text-stone-500">
                  Rescales perimeter and edge lengths relative to the longest extracted edge (
                  {Math.max(...extraction.edgeLengthsFt)} ft).
                </span>
              </label>
            </fieldset>

            <fieldset className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <legend className="px-1 text-sm font-semibold text-stone-900">System preferences</legend>

              <label className="block text-sm">
                <span className="font-medium text-stone-700">Mounting type</span>
                <select
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2"
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
              </label>

              <label className="block text-sm">
                <span className="font-medium text-stone-700">Permanent or temporary</span>
                <select
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2"
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
                <span className="mt-1 block text-xs text-stone-500">
                  Temporary prefers skylight screens over Kee Dome guardrail kits.
                </span>
              </label>

              <label className="block text-sm">
                <span className="font-medium text-stone-700">Finish / color</span>
                <select
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2"
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
              </label>

              {quotePreview && (
                <div className="rounded-xl bg-stone-50 p-4 text-sm">
                  <div className="text-stone-500">Live estimate preview</div>
                  <div className="mt-1 font-display text-3xl text-stone-900">
                    {formatUsd(quotePreview.subtotal)}
                  </div>
                  <div className="mt-1 text-xs text-stone-500">
                    {quotePreview.lineItems.length} line items ·{" "}
                    {quotePreview.guardedPerimeterFt.toLocaleString()} lf guarded
                  </div>
                </div>
              )}
            </fieldset>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setStep("extract")}
              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-white"
            >
              ← Back to extraction
            </button>
            <button
              type="button"
              onClick={goToQuote}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Generate quote
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {step === "quote" && quote && (
        <QuoteView quote={quote} onPrint={handlePrint} onBack={() => setStep("questions")} />
      )}

      <footer className="mt-12 border-t border-stone-200 pt-6 text-xs text-stone-500 print:hidden">
        <p>
          Demo only — not a production SSI quote. Catalog sources:{" "}
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
          . OSHA references are advisory; final compliance stays with Simplified Safety.
        </p>
        <p className="mt-2 inline-flex items-center gap-1">
          <Printer className="h-3.5 w-3.5" /> Use Print / Save as PDF on the quote step for a
          shareable handout.
        </p>
      </footer>

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

function SourceBadge({ source, mode }: { source: string; mode: string | null }) {
  const label =
    source === "precomputed"
      ? "Precomputed (hand-checked)"
      : source === "live_ai"
        ? `Live AI (${mode || "vision"})`
        : "Simulated / estimated";
  const cls =
    source === "precomputed"
      ? "bg-green-50 text-green-800 border-green-200"
      : source === "live_ai"
        ? "bg-blue-50 text-blue-800 border-blue-200"
        : "bg-amber-50 text-amber-900 border-amber-200";
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}>{label}</span>
  );
}
