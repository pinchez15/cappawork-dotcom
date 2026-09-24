import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-navy text-white/50 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link href="/" className="text-xl font-display tracking-tight text-white mb-4 inline-block">
              CappaWork
            </Link>
            <p className="text-white/55 text-sm max-w-sm leading-relaxed">
              We change how operational work gets done. Agents go in where the work calls for them. The judgment stays with your team.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-xs uppercase tracking-[0.16em]">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#how-it-works" className="text-white/50 hover:text-white text-sm transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/#work" className="text-white/50 hover:text-white text-sm transition-colors">
                  Work
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-white/50 hover:text-white text-sm transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/#discovery" className="text-white/50 hover:text-white text-sm transition-colors">
                  Discovery
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/50 hover:text-white text-sm transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white/50 hover:text-white text-sm transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/50 hover:text-white text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-xs uppercase tracking-[0.16em]">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-white/50 hover:text-white text-sm transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/50 hover:text-white text-sm transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-sm text-white/40">
          <p>&copy; {new Date().getFullYear()} CappaWork. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
