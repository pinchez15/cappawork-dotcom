import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { getProfileByClerkId } from "@/server/repos/profiles"
import { getActiveParticipationsForUser, getCohort } from "@/server/repos/cohorts"
import CohortPortalView from "../cohort-portal-view"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default async function CohortByIdPage({
  params,
}: {
  params: Promise<{ cohortId: string }>
}) {
  const { cohortId } = await params
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const profile = await getProfileByClerkId(userId)
  const participations = await getActiveParticipationsForUser(
    userId,
    profile?.email ?? null
  )

  const match = participations.find((p) => p.cohort_id === cohortId)
  if (match) {
    return <CohortPortalView cohort={match.cohort} accessExpiresAt={match.access_expires_at} />
  }

  // Admins can preview any cohort's portal without being enrolled.
  if (profile?.is_admin) {
    const cohort = await getCohort(cohortId)
    if (cohort) return <CohortPortalView cohort={cohort} adminPreview />
  }

  redirect("/portal/cohort")
}
