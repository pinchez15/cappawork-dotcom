import Link from "next/link"
import { revalidatePath } from "next/cache"
import { ExternalLink, Inbox } from "lucide-react"
import { requireAdmin } from "@/lib/auth/guards"
import {
  listLeads,
  updateLeadStatus,
  COHORT_TYPE_LABELS,
  type CohortLead,
} from "@/server/repos/cohorts"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const STATUSES: CohortLead["status"][] = [
  "new",
  "contacted",
  "qualified",
  "paid",
  "declined",
]

const STATUS_STYLES: Record<CohortLead["status"], string> = {
  new: "bg-blue-50 text-blue-700",
  contacted: "bg-amber-50 text-amber-700",
  qualified: "bg-purple-50 text-purple-700",
  paid: "bg-green-50 text-green-700",
  declined: "bg-stone-100 text-stone-500",
}

async function updateLeadStatusAction(formData: FormData) {
  "use server"
  await requireAdmin()
  const id = String(formData.get("id") ?? "")
  const status = String(formData.get("status") ?? "") as CohortLead["status"]
  if (!id || !STATUSES.includes(status)) return
  await updateLeadStatus(id, status)
  revalidatePath("/admin/leads")
}

function formatShort(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default async function LeadsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  await requireAdmin()
  const { status } = await searchParams
  const activeStatus = STATUSES.includes(status as CohortLead["status"])
    ? (status as CohortLead["status"])
    : undefined

  const leads = await listLeads(activeStatus ? { status: activeStatus } : undefined)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-stone-900 flex items-center gap-2">
          <Inbox className="h-7 w-7" /> Cohort Leads
        </h1>
        <p className="text-stone-600 mt-1">Seat requests from the cohort landing pages.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <FilterPill label="All" href="/admin/leads" active={!activeStatus} />
        {STATUSES.map((s) => (
          <FilterPill
            key={s}
            label={s}
            href={`/admin/leads?status=${s}`}
            active={activeStatus === s}
          />
        ))}
      </div>

      {leads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-500">
          No leads{activeStatus ? ` with status "${activeStatus}"` : ""} yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white divide-y divide-stone-100">
          {leads.map((lead) => (
            <div key={lead.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-stone-900">
                    {lead.name || lead.email}
                  </span>
                  <span className="text-xs rounded-full bg-stone-100 px-2 py-0.5 text-stone-600">
                    {COHORT_TYPE_LABELS[lead.cohort_type]}
                  </span>
                  <span className={`text-xs rounded-full px-2 py-0.5 capitalize ${STATUS_STYLES[lead.status]}`}>
                    {lead.status}
                  </span>
                </div>
                <div className="text-sm text-stone-500 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <a href={`mailto:${lead.email}`} className="hover:text-stone-900">{lead.email}</a>
                  <a
                    href={lead.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700"
                  >
                    LinkedIn <ExternalLink size={12} />
                  </a>
                  <span>requested {formatShort(lead.created_at)}</span>
                </div>
              </div>
              <form action={updateLeadStatusAction} className="flex items-center gap-2 shrink-0">
                <input type="hidden" name="id" value={lead.id} />
                <select
                  name="status"
                  defaultValue={lead.status}
                  className="rounded-lg border border-stone-300 bg-white px-2 py-1.5 text-sm text-stone-900"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="capitalize">
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="rounded-lg bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
                >
                  Update
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function FilterPill({
  label,
  href,
  active,
}: {
  label: string
  href: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 text-sm capitalize transition-colors ${
        active
          ? "bg-stone-900 text-white"
          : "border border-stone-300 text-stone-600 hover:bg-stone-50"
      }`}
    >
      {label}
    </Link>
  )
}
