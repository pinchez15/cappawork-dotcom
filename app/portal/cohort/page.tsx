import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { ArrowRight } from "lucide-react"
import { getProfileByClerkId } from "@/server/repos/profiles"
import {
  getActiveParticipationsForUser,
  COHORT_TYPE_LABELS,
  type ParticipationWithCohort,
} from "@/server/repos/cohorts"
import CohortPortalView from "./cohort-portal-view"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default async function CohortPortalPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const profile = await getProfileByClerkId(userId)
  const participations = await getActiveParticipationsForUser(
    userId,
    profile?.email ?? null
  )

  if (participations.length === 0) {
    return <NoCohort isAdmin={Boolean(profile?.is_admin)} />
  }

  if (participations.length === 1) {
    const p = participations[0]
    return <CohortPortalView cohort={p.cohort} accessExpiresAt={p.access_expires_at} />
  }

  return <Chooser participations={participations} />
}

function NoCohort({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900 mb-3">
        No active cohort yet
      </h1>
      <p className="text-stone-600 leading-relaxed mb-8">
        You're signed in, but we don't see an active cohort enrollment for this account. If you just paid, give it a
        few minutes and refresh — or email{" "}
        <a href="mailto:nate@cappawork.com" className="text-blue-600 hover:text-blue-700 underline">
          nate@cappawork.com
        </a>{" "}
        and we'll sort it out.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/ai-for-business-leaders"
          className="rounded-xl border border-stone-200 bg-white p-5 text-left hover:border-blue-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-stone-900">AI for Business Leaders</span>
            <ArrowRight size={16} className="text-stone-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <p className="text-sm text-stone-500 mt-1">Ship one AI workflow in a month.</p>
        </Link>
        <Link
          href="/ai-literacy-bootcamp"
          className="rounded-xl border border-stone-200 bg-white p-5 text-left hover:border-blue-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-stone-900">AI Literacy Bootcamp</span>
            <ArrowRight size={16} className="text-stone-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <p className="text-sm text-stone-500 mt-1">Get strategically fluent in AI.</p>
        </Link>
      </div>

      {isAdmin && (
        <p className="mt-8 text-sm text-stone-500">
          You're an admin —{" "}
          <Link href="/admin/cohorts" className="text-blue-600 hover:text-blue-700 underline">
            manage cohorts
          </Link>{" "}
          or open a cohort to preview its portal.
        </p>
      )}
    </div>
  )
}

function Chooser({ participations }: { participations: ParticipationWithCohort[] }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900 mb-2">Your cohorts</h1>
      <p className="text-stone-600 mb-8">Pick a cohort to open its portal.</p>
      <div className="space-y-4">
        {participations.map((p) => (
          <Link
            key={p.id}
            href={`/portal/cohort/${p.cohort_id}`}
            className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-6 hover:border-blue-300 hover:shadow-sm transition-all group"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
                {COHORT_TYPE_LABELS[p.cohort.type]}
              </p>
              <p className="font-medium text-stone-900">{p.cohort.name}</p>
            </div>
            <ArrowRight size={20} className="text-stone-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  )
}
