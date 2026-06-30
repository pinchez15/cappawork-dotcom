import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-navy text-white/50 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-xl font-display tracking-tight text-white mb-4 inline-block">
              CappaWork
            </Link>
            <p className="text-white/50 text-sm max-w-md">
              We help founder-led businesses become AI-native. You own the IP. We keep it working.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/discover" className="text-white/50 hover:text-white text-sm transition-colors">
                  Discover
                </Link>
              </li>
              <li>
                <Link href="/build" className="text-white/50 hover:text-white text-sm transition-colors">
                  Build
                </Link>
              </li>
              <li>
                <Link href="/modernize" className="text-white/50 hover:text-white text-sm transition-colors">
                  Modernize
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#services" className="text-white/50 hover:text-white text-sm transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-white/50 hover:text-white text-sm transition-colors">
                  The Journey
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-white/50 hover:text-white text-sm transition-colors">
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
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Cohorts</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/ai-for-business-leaders" className="text-white/50 hover:text-white text-sm transition-colors">
                  AI for Business Leaders
                </Link>
              </li>
              <li>
                <Link href="/ai-literacy-bootcamp" className="text-white/50 hover:text-white text-sm transition-colors">
                  AI Literacy Bootcamp
                </Link>
              </li>
              <li>
                <Link href="/cohorts" className="text-white/50 hover:text-white text-sm transition-colors">
                  Compare cohorts
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-white/50 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/50 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/40 space-y-2">
          <p>&copy; {new Date().getFullYear()} CappaWork. All rights reserved.</p>
          <p>Built by CappaWork.</p>
        </div>
      </div>
    </footer>
  )
}
