import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { UserButton } from "@clerk/nextjs"
import { ForceTheme } from "@/components/client/force-theme"

export const runtime = "nodejs"

export default async function CohortPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <ForceTheme theme="light" />
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-card-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-display tracking-tight text-navy">
            CappaWork
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
