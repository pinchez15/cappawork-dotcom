import Navigation from "../../components/navigation"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function CohortSuccessPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navigation />
      <div className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-sm border border-stone-200 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-light text-stone-900 mb-4">
              Payment Successful!
            </h1>

            <p className="text-lg text-stone-600 mb-8">
              Your spot in The CappaWork Builder Cohort has been reserved.
            </p>

            <div className="bg-stone-50 p-6 rounded-sm border border-stone-200 mb-8 text-left">
              <h2 className="text-lg font-serif font-medium text-stone-900 mb-4">
                What's Next?
              </h2>
              <ul className="space-y-3 text-stone-700">
                <li className="flex items-start gap-2">
                  <span className="text-stone-400">•</span>
                  <span>You'll receive an email confirmation with payment details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-stone-400">•</span>
                  <span>We'll send you cohort details and access information within 24 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-stone-400">•</span>
                  <span>Look for an invitation to the private LinkedIn group</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-stone-400">•</span>
                  <span>We'll share the schedule for the 3 live calls (Tuesday nights EST)</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/cohort"
                className="group bg-stone-900 text-stone-50 px-8 py-4 rounded-sm font-medium hover:bg-stone-800 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Back to Cohort Page
              </Link>
              <Link
                href="/"
                className="text-stone-700 px-8 py-4 font-medium hover:text-stone-900 transition-colors border border-stone-300 rounded-sm hover:border-stone-400"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

