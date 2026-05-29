import Link from "next/link"
import { revalidatePath } from "next/cache"
import { Plus, Users, FileText, GraduationCap } from "lucide-react"
import { requireAdmin } from "@/lib/auth/guards"
import {
  listCohorts,
  createCohort,
  COHORT_TYPE_LABELS,
  type CohortType,
} from "@/server/repos/cohorts"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const inputClass =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"

async function createCohortAction(formData: FormData) {
  "use server"
  await requireAdmin()
  await createCohort({
    name: String(formData.get("name") ?? "").trim(),
    type: String(formData.get("type") ?? "build") as CohortType,
    start_date: String(formData.get("start_date") ?? ""),
    end_date: String(formData.get("end_date") ?? ""),
    session_count: Number(formData.get("session_count") ?? 0),
    zoom_link: String(formData.get("zoom_link") ?? "").trim() || null,
    status: String(formData.get("status") ?? "upcoming") as
      | "upcoming"
      | "active"
      | "completed",
  })
  revalidatePath("/admin/cohorts")
}

export default async function CohortsAdminPage() {
  await requireAdmin()
  const cohorts = await listCohorts()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-stone-900 flex items-center gap-2">
          <GraduationCap className="h-7 w-7" />
          Cohorts
        </h1>
        <p className="text-stone-600 mt-1">Create and manage teaching cohorts.</p>
      </div>

      {/* List */}
      {cohorts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-500 mb-10">
          No cohorts yet. Create your first one below.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white divide-y divide-stone-100 mb-12">
          {cohorts.map((c) => (
            <div key={c.id} className="flex items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-stone-900">{c.name}</span>
                  <span className="text-xs rounded-full bg-stone-100 px-2 py-0.5 text-stone-600">
                    {COHORT_TYPE_LABELS[c.type]}
                  </span>
                  <span className="text-xs rounded-full bg-blue-50 px-2 py-0.5 text-blue-700 capitalize">
                    {c.status}
                  </span>
                </div>
                <p className="text-sm text-stone-500 mt-0.5">
                  {c.start_date} – {c.end_date} · {c.session_count} sessions
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/cohorts/${c.id}/participants`}
                  className="inline-flex items-center gap-1 rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50"
                >
                  <Users className="h-4 w-4" /> Roster
                </Link>
                <Link
                  href={`/admin/cohorts/${c.id}/materials`}
                  className="inline-flex items-center gap-1 rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50"
                >
                  <FileText className="h-4 w-4" /> Materials
                </Link>
                <Link
                  href={`/admin/cohorts/${c.id}`}
                  className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create form */}
      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5" /> New cohort
        </h2>
        <form action={createCohortAction} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
            <input
              name="name"
              required
              placeholder="AI for Business Leaders — June 2026"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Type</label>
            <select name="type" className={inputClass} defaultValue="build">
              <option value="build">AI for Business Leaders (build)</option>
              <option value="literacy">AI Literacy Bootcamp (literacy)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Status</label>
            <select name="status" className={inputClass} defaultValue="upcoming">
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Start date</label>
            <input type="date" name="start_date" required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              End date (last session)
            </label>
            <input type="date" name="end_date" required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Session count</label>
            <input
              type="number"
              name="session_count"
              min={1}
              defaultValue={3}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Zoom link (optional)
            </label>
            <input name="zoom_link" placeholder="https://zoom.us/j/…" className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" /> Create cohort
            </button>
          </div>
        </form>
        <p className="mt-3 text-xs text-stone-500">
          Participant access runs until 90 days after the end date.
        </p>
      </div>
    </div>
  )
}
