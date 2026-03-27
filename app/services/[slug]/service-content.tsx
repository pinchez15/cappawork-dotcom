"use client";

import type { Service } from "../data";

export function ServiceContent({
  service,
  calendlyLink,
}: {
  service: Service;
  calendlyLink: string;
}) {
  const handleCTA = () => {
    window.open(calendlyLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="max-w-[680px] mx-auto px-6 py-20">
      {/* Header */}
      <span className="text-xs font-semibold tracking-widest uppercase text-gold block mb-4">
        CappaWork
      </span>
      <h1 className="font-display text-4xl sm:text-5xl font-normal leading-tight tracking-tight mb-6">
        {service.title}
      </h1>
      <p className="text-lg text-stone-500 mb-12 max-w-[540px]">
        {service.subtitle}
      </p>

      {/* Price */}
      <div className="flex items-baseline gap-3 mb-12 pb-12 border-b border-card-border">
        <span className="font-display text-5xl sm:text-6xl font-normal">
          {service.price}
        </span>
        <span className="text-sm text-stone-500">{service.priceNote}</span>
      </div>

      {/* How it works */}
      <div className="mb-12">
        <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-5">
          How it works
        </span>
        <div>
          {service.howItWorks.map((item, i) => (
            <div
              key={i}
              className="py-4 border-b border-card-border first:border-t text-base leading-relaxed"
            >
              <strong className="font-semibold">{item.label}</strong>{" "}
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* What we cover (cohort only) */}
      {service.whatWeCover && (
        <div className="mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-5">
            What we cover
          </span>
          <div>
            {service.whatWeCover.map((item, i) => (
              <div
                key={i}
                className="py-4 border-b border-card-border first:border-t text-base leading-relaxed"
              >
                {item.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Provocation block (dev team workshop) */}
      {service.provocationBlock && (
        <div className="bg-navy text-warm-white p-10 my-12 rounded md:rounded">
          <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-5">
            {service.provocationBlock.label}
          </span>
          <ul className="space-y-0">
            {service.provocationBlock.items.map((item, i) => (
              <li
                key={i}
                className="py-2.5 border-b border-white/10 last:border-none text-base opacity-90"
              >
                <span className="text-gold font-semibold mr-3">
                  {item.number}
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Callout block */}
      {service.callout && (
        <div className="bg-[#F5F0E8] p-8 my-12 border-l-[3px] border-gold">
          <p className="text-sm leading-relaxed font-semibold mb-3">
            {service.callout.title}
          </p>
          {service.callout.paragraphs.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-stone-700 mt-3">
              {p}
            </p>
          ))}
        </div>
      )}

      {/* Framework block (org training) */}
      {service.frameworkBlock && (
        <div className="bg-[#F5F0E8] p-8 my-12">
          <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-4">
            {service.frameworkBlock.label}
          </span>
          {service.frameworkBlock.steps.map((step, i) => (
            <div
              key={i}
              className="py-3 border-t border-[#E0D9CC] first:border-none text-sm leading-relaxed"
            >
              <strong className="font-semibold text-gold mr-2">
                {step.label}
              </strong>
              {step.text}
            </div>
          ))}
        </div>
      )}

      {/* Proof block (full build) */}
      {service.proofBlock && (
        <div className="bg-[#F5F0E8] p-8 my-12">
          <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-4">
            {service.proofBlock.label}
          </span>
          {service.proofBlock.items.map((item, i) => (
            <div
              key={i}
              className="py-4 border-t border-[#E0D9CC] first:border-none text-sm leading-relaxed"
            >
              {item.stat && (
                <span className="font-display text-2xl text-gold block mb-1">
                  {item.stat}
                </span>
              )}
              {!item.stat ? (
                <strong className="font-semibold">{item.text}</strong>
              ) : (
                item.text
              )}
            </div>
          ))}
        </div>
      )}

      {/* Who this is for */}
      <div className="bg-navy text-warm-white p-10 my-12 -mx-6 md:mx-0 md:rounded">
        <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-5">
          This is for you if
        </span>
        <p className="text-base leading-relaxed opacity-90">
          {service.whoBlock}
        </p>
      </div>

      {/* About Nate */}
      <div className="mb-12">
        <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-5">
          About Nate Pinches
        </span>
        <div className="py-4 border-t border-b border-card-border text-base leading-relaxed">
          {service.aboutNate}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12">
        <button
          onClick={handleCTA}
          className="inline-block bg-navy text-warm-white text-sm font-semibold px-10 py-4 tracking-wide hover:bg-[#1a2035] transition-colors"
        >
          {service.ctaText}
        </button>
        <p className="mt-3 text-sm text-stone-500">{service.ctaSub}</p>
      </div>

      {/* Terms */}
      <div className="mt-12 pt-8 border-t border-card-border">
        <p className="text-xs text-stone-500 leading-relaxed">
          <strong>All sales are final.</strong> This engagement is
          non-refundable and non-reschedulable. {service.termsNote} This policy
          reflects the seriousness of the work and the value of the time. See
          our{" "}
          <a
            href="/fulfillment-policy"
            className="underline hover:text-navy transition-colors"
          >
            fulfillment policy
          </a>{" "}
          for full details.
        </p>
      </div>
    </div>
  );
}
