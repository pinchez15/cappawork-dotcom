import Link from "next/link"
import { revalidatePath } from "next/cache"
import { redirect, notFound } from "next/navigation"
import { ArrowLeft, Users, FileText, Save } from "lucide-react"
import { requireAdmin } from "@/lib/auth/guards"
import {
  getCohort,
  updateCohort,
  COHORT_TYPE_LABELS,
  type CohortType,
} from "@/server/repos/cohorts"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const inputClass =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"

async function updateCohortAction(formData: FormData) {
  "use server"
  await requireAdmin()
  const id = String(formData.get("id") ?? "")
  if (!id) return
  await updateCohort(id, {
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
  revalidatePath(`/admin/cohorts/${id}`)
  revalidatePath("/admin/cohorts")
  redirect("/admin/cohorts")
}

export default async function EditCohortPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const cohort = await getCohort(id)
  if (!cohort) notFound()

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/admin/cohorts"
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 mb-6"
      >
        <ArrowLeft size={16} /> All cohorts
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-stone-900">{cohort.name}</h1>
        <div className="flex gap-2">
          <Link
            href={`/admin/cohorts/${cohort.id}/participants`}
            className="inline-flex items-center gap-1 rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50"
          >
            <Users className="h-4 w-4" /> Roster
          </Link>
          <Link
            href={`/admin/cohorts/${cohort.id}/materials`}
            className="inline-flex items-center gap-1 rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50"
          >
            <FileText className="h-4 w-4" /> Materials
          </Link>
        </div>
      </div>

      <form action={updateCohortAction} className="grid sm:grid-cols-2 gap-4 rounded-xl border border-stone-200 bg-white p-6">
        <input type="hidden" name="id" value={cohort.id} />
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
          <input name="name" required defaultValue={cohort.name} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Type</label>
          <select name="type" className={inputClass} defaultValue={cohort.type}>
            <option value="build">{COHORT_TYPE_LABELS.build} (build)</option>
            <option value="literacy">{COHORT_TYPE_LABELS.literacy} (literacy)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Status</label>
          <select name="status" className={inputClass} defaultValue={cohort.status}>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Start date</label>
          <input type="date" name="start_date" required defaultValue={cohort.start_date} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">End date (last session)</label>
          <input type="date" name="end_date" required defaultValue={cohort.end_date} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Session count</label>
          <input type="number" name="session_count" min={1} required defaultValue={cohort.session_count} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Zoom link</label>
          <input name="zoom_link" defaultValue={cohort.zoom_link ?? ""} placeholder="https://zoom.us/j/…" className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Save className="h-4 w-4" /> Save changes
          </button>
        </div>
      </form>
    </div>
  )
}
