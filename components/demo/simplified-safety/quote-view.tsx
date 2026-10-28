"use client";

import { formatUsd } from "@/lib/demo/simplified-safety/catalog";
import type { QuoteResult } from "@/lib/demo/simplified-safety/types";

type Props = {
  quote: QuoteResult;
  onPrint: () => void;
  onBack: () => void;
};

export function QuoteView({ quote, onPrint, onBack }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-white"
        >
          ← Edit answers
        </button>
        <button
          type="button"
          onClick={onPrint}
          className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Print / Save as PDF
        </button>
      </div>

      <article
        id="ssi-quote-print"
        className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10 print:border-0 print:shadow-none print:p-0"
      >
        <header className="border-b border-stone-200 pb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Simplified Safety · Budgetary Quote
              </p>
              <h2 className="mt-1 font-display text-3xl text-stone-900">{quote.projectName}</h2>
              <p className="mt-2 text-sm text-stone-600">
                Generated {new Date(quote.generatedAt).toLocaleString()} · Scale{" "}
                {quote.scaleFactor.toFixed(3)}× · Guarded perimeter{" "}
                {quote.guardedPerimeterFt.toLocaleString()} lf
              </p>
            </div>
            <div className="text-right text-xs text-stone-500">
              <div className="font-semibold text-stone-800">Plan-to-Order Demo</div>
              <div>Powered by CappaWork</div>
              <div>simplifiedsafety.com</div>
            </div>
          </div>
        </header>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500">
                <th className="py-2 pr-3 font-semibold">SKU</th>
                <th className="py-2 pr-3 font-semibold">Product</th>
                <th className="py-2 pr-3 font-semibold text-right">Qty</th>
                <th className="py-2 pr-3 font-semibold text-right">Unit</th>
                <th className="py-2 pr-3 font-semibold text-right">Ext.</th>
                <th className="py-2 font-semibold">OSHA driver</th>
              </tr>
            </thead>
            <tbody>
              {quote.lineItems.map((item) => (
                <tr key={item.id} className="border-b border-stone-100 align-top">
                  <td className="py-3 pr-3 font-mono text-xs text-stone-600">{item.sku}</td>
                  <td className="py-3 pr-3">
                    <div className="font-medium text-stone-900">{item.name}</div>
                    <div className="mt-1 text-xs text-stone-500">{item.rationale}</div>
                    <div className="mt-1">
                      <span
                        className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                          item.priceKind === "published"
                            ? "bg-green-50 text-green-800"
                            : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        {item.priceKind === "published" ? "Published list" : "Estimated"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-3 text-right tabular-nums">{item.qty}</td>
                  <td className="py-3 pr-3 text-right tabular-nums">{formatUsd(item.unitPrice)}</td>
                  <td className="py-3 pr-3 text-right font-medium tabular-nums">
                    {formatUsd(item.lineTotal)}
                  </td>
                  <td className="py-3 text-xs text-stone-600">
                    {item.osha.map((o) => (
                      <div key={o.id} className="mb-1">
                        <span className="font-medium text-stone-800">{o.cfr}</span>
                        <span className="text-stone-500"> — {o.title}</span>
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-stone-200 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-sm text-stone-600">
            <div>
              Published list subtotal:{" "}
              <span className="font-medium text-stone-900">{formatUsd(quote.publishedSubtotal)}</span>
            </div>
            <div>
              Estimated subtotal:{" "}
              <span className="font-medium text-stone-900">{formatUsd(quote.estimatedSubtotal)}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wide text-stone-500">Budgetary total</div>
            <div className="font-display text-4xl text-stone-900">{formatUsd(quote.subtotal)}</div>
          </div>
        </div>

        <section className="mt-8 rounded-xl bg-stone-50 p-4 text-sm text-stone-700">
          <h3 className="font-semibold text-stone-900">Assumptions</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {quote.assumptions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </section>

        <p className="mt-6 text-xs leading-relaxed text-stone-500">{quote.disclaimer}</p>
      </article>
    </div>
  );
}
