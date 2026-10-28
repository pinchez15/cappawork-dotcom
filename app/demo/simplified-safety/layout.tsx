import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan-to-Order Demo — Simplified Safety × CappaWork",
  description:
    "Demo of CappaWork's AI plan-to-order quoting for Simplified Safety (Kee Safety): roof plan takeoff → OSHA-checked KeeGuard BOM.",
  robots: "noindex, nofollow",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F6F3] text-stone-900 antialiased">
      {children}
    </div>
  );
}
