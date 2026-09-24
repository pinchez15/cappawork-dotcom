import Link from "next/link";
import { FacebookPixel } from "./components/fb-pixel";
import DesktopProcessOrb from "@/app/components/desktop-process-orb";

export default function ScorecardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-warm-white">
      <DesktopProcessOrb />
      <nav className="border-b border-stone-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-6 flex h-14 items-center">
          <Link
            href="/"
            className="font-display text-xl tracking-tight text-stone-900"
          >
            CappaWork
          </Link>
        </div>
      </nav>
      <main>{children}</main>
      <FacebookPixel />
    </div>
  );
}
