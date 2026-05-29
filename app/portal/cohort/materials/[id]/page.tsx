import Link from "next/link"
import { redirect, notFound } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { ArrowLeft, ExternalLink, Download } from "lucide-react"
import { getProfileByClerkId } from "@/server/repos/profiles"
import { getActiveParticipationsForUser, getMaterial } from "@/server/repos/cohorts"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default async function MaterialPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const profile = await getProfileByClerkId(userId)
  const isAdmin = Boolean(profile?.is_admin)

  const material = await getMaterial(id)
  if (!material) notFound()

  const participations = await getActiveParticipationsForUser(
    userId,
    profile?.email ?? null
  )

  // Access: enrolled in the material's cohort, or — for shared-library items
  // (no cohort_id) — enrolled in any cohort of the matching type. Admins always.
  const hasAccess =
    isAdmin ||
    participations.some((p) =>
      material.cohort_id
        ? p.cohort_id === material.cohort_id
        : material.cohort_type
          ? p.cohort.type === material.cohort_type
          : true
    )

  const isPublished =
    material.published_at != null && new Date(material.published_at) <= new Date()

  if (!hasAccess || (!isPublished && !isAdmin)) {
    redirect("/portal/cohort")
  }

  const isVideo = material.type === "video" || material.type === "recording"

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/portal/cohort"
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to portal
      </Link>

      <h1 className="font-display text-2xl sm:text-3xl tracking-tight text-navy">
        {material.title}
      </h1>
      {material.description && (
        <p className="mt-2 text-stone-600 leading-relaxed">{material.description}</p>
      )}

      {!isPublished && isAdmin && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Not yet published — participants can't see this until its publish date.
        </div>
      )}

      <div className="mt-6">
        {isVideo ? (
          <div className="relative w-full overflow-hidden rounded-2xl border border-stone-200 bg-black aspect-video">
            <iframe
              src={material.url}
              title={material.title}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative w-full overflow-hidden rounded-2xl border border-stone-200 bg-white" style={{ height: "80vh" }}>
              <iframe
                src={material.url}
                title={material.title}
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <div className="flex gap-3">
              <a
                href={material.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <ExternalLink size={16} />
                Open in new tab
              </a>
              <a
                href={material.url}
                download
                className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-navy hover:bg-gold/90 transition-colors"
              >
                <Download size={16} />
                Download
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
