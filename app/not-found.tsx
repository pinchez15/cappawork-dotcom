import Link from "next/link";
import Navigation from "./components/navigation";
import Footer from "./components/footer";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navigation />
      <div className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl font-semibold text-stone-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-stone-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-stone-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-full font-medium hover:bg-stone-800 transition-all duration-200"
          >
            Go Home
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}

