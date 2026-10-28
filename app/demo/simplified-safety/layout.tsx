import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan-to-Order Demo — Simplified Safety × CappaWork",
  description:
    "Demo of CappaWork's AI plan-to-order quoting for Simplified Safety (Kee Safety): roof plan takeoff → OSHA-checked KeeGuard BOM.",
  robots: "noindex, nofollow",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[#F4F5F7] text-stone-900 antialiased">
      {/* Hide Clerk keyless/dev claim toast so it does not cover takeoff controls during demos. */}
      <style>{`#clerk-components, .cl-internal-b3fm6y { display: none !important; }`}</style>
      {children}
    </div>
  );
}
