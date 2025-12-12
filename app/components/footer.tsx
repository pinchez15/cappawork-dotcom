import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-xl font-semibold tracking-tight text-white mb-4 inline-block">
              CappaWork
            </Link>
            <p className="text-stone-400 text-sm max-w-md">
              Building modern, scalable software for owner-led businesses who want speed without the overhead.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-stone-400 hover:text-white text-sm transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-stone-400 hover:text-white text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-stone-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-stone-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-800 text-center text-sm text-stone-500 space-y-2">
          <p>&copy; {new Date().getFullYear()} CappaWork. All rights reserved.</p>
          <p>Built by CappaWork.</p>
        </div>
      </div>
    </footer>
  )
}
