import Link from "next/link"
import {
  Video,
  FileText,
  PlayCircle,
  Calendar,
  ExternalLink,
  ClipboardList,
} from "lucide-react"
import {
  type Cohort,
  type CohortMaterial,
  type CohortType,
  listPublishedMaterialsForCohort,
  sectionLabel,
  sectionSortKey,
  nextSessionDate,
  COHORT_TYPE_LABELS,
  COHORT_TYPE_LANDING,
} from "@/server/repos/cohorts"

function formatDate(value: string): string {
  const iso = value.length === 10 ? `${value}T00:00:00` : value
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function formatShort(value: string): string {
  const iso = value.length === 10 ? `${value}T00:00:00` : value
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const MATERIAL_ICON: Record<CohortMaterial["type"], typeof Video> = {
  video: PlayCircle,
  recording: Video,
  pdf: FileText,
  worksheet: ClipboardList,
}

export default async function CohortPortalView({
  cohort,
  accessExpiresAt,
  adminPreview = false,
}: {
  cohort: Cohort
  accessExpiresAt?: string | null
  adminPreview?: boolean
}) {
  const materials = await listPublishedMaterialsForCohort(cohort)
  const next = nextSessionDate(cohort)

  // Group materials by section, ordered AI Basics → sessions → other.
  const groups = new Map<string, CohortMaterial[]>()
  for (const m of materials) {
    groups.set(m.section, [...(groups.get(m.section) ?? []), m])
  }
  const sections = [...groups.keys()].sort(
    (a, b) => sectionSortKey(a) - sectionSortKey(b)
  )

  const otherType: CohortType = cohort.type === "build" ? "literacy" : "build"

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {adminPreview && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Admin preview — you're viewing this cohort portal as a participant would. Access rules don't apply to you.
        </div>
      )}

      {/* Header */}
      <header className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-2">
          {COHORT_TYPE_LABELS[cohort.type]}
        </p>
        <h1 className="font-display text-2xl sm:text-3xl tracking-tight text-navy">
          {cohort.name}
        </h1>
        <p className="mt-2 text-stone-500">
          {formatShort(cohort.start_date)} – {formatShort(cohort.end_date)} · {cohort.session_count} sessions
        </p>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
          {next ? (
            <div className="flex items-center gap-2 text-stone-700">
              <Calendar size={18} className="text-stone-400" />
              <span>
                Next session: <span className="font-medium text-stone-900">{formatDate(next)}</span>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-stone-500">
              <Calendar size={18} className="text-stone-400" />
              <span>All live sessions complete — recordings are in the library below.</span>
            </div>
          )}

          {cohort.zoom_link && (
            <a
              href={cohort.zoom_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-medium text-navy transition-all hover:bg-gold/90 hover:scale-[1.02] sm:ml-auto"
            >
              <Video size={18} />
              Join live session
            </a>
          )}
        </div>
      </header>

      {/* Materials library */}
      <section className="mt-10">
        <h2 className="font-display text-xl tracking-tight text-navy mb-6">Materials library</h2>

        {sections.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-500">
            Materials will appear here as they're released. Check back after your first session.
          </div>
        ) : (
          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-400 mb-3">
                  {sectionLabel(section)}
                </h3>
                <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white divide-y divide-stone-100">
                  {(groups.get(section) ?? []).map((m) => {
                    const Icon = MATERIAL_ICON[m.type] ?? FileText
                    return (
                      <Link
                        key={m.id}
                        href={`/portal/cohort/materials/${m.id}`}
                        className="flex items-center gap-4 px-5 py-4 hover:bg-stone-50 transition-colors group"
                      >
                        <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100 text-stone-500 group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                          <Icon size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-stone-900 truncate">{m.title}</p>
                          {m.description && (
                            <p className="text-sm text-stone-500 truncate">{m.description}</p>
                          )}
                        </div>
                        <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-stone-400">
                          {m.type}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-12 border-t border-stone-200 pt-8 text-sm text-stone-500 space-y-2">
        {accessExpiresAt && (
          <p>
            Access expires on{" "}
            <span className="font-medium text-stone-700">{formatShort(accessExpiresAt)}</span>. Want more time?{" "}
            <a href="mailto:nate@cappawork.com?subject=Extend%20cohort%20access" className="text-gold hover:text-gold/80 underline">
              Email Nate to extend
            </a>
            .
          </p>
        )}
        <p>
          <Link href={COHORT_TYPE_LANDING[otherType]} className="text-gold hover:text-gold/80 underline inline-flex items-center gap-1">
            Check out {COHORT_TYPE_LABELS[otherType]}
            <ExternalLink size={13} />
          </Link>
        </p>
      </footer>
    </div>
  )
}
