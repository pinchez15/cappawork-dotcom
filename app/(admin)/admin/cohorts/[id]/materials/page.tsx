import Link from "next/link"
import { revalidatePath } from "next/cache"
import { notFound } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Eye, EyeOff } from "lucide-react"
import { requireAdmin } from "@/lib/auth/guards"
import {
  getCohort,
  listMaterialsForCohortAdmin,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  sectionLabel,
  type CohortMaterial,
} from "@/server/repos/cohorts"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const inputClass =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"

async function createMaterialAction(formData: FormData) {
  "use server"
  await requireAdmin()
  const cohortId = String(formData.get("cohortId") ?? "")
  const cohort = await getCohort(cohortId)
  if (!cohort) return

  const shared = formData.get("shared") === "on"
  const publishedRaw = String(formData.get("published_at") ?? "").trim()

  await createMaterial({
    cohort_id: shared ? null : cohortId,
    cohort_type: shared ? cohort.type : null,
    section: String(formData.get("section") ?? "").trim() || "session_1",
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    type: String(formData.get("type") ?? "video") as CohortMaterial["type"],
    url: String(formData.get("url") ?? "").trim(),
    published_at: publishedRaw ? new Date(publishedRaw).toISOString() : null,
    display_order: Number(formData.get("display_order") ?? 0),
  })
  revalidatePath(`/admin/cohorts/${cohortId}/materials`)
}

async function togglePublishAction(formData: FormData) {
  "use server"
  await requireAdmin()
  const materialId = String(formData.get("materialId") ?? "")
  const cohortId = String(formData.get("cohortId") ?? "")
  const publish = formData.get("publish") === "true"
  if (!materialId) return
  await updateMaterial(materialId, {
    published_at: publish ? new Date().toISOString() : null,
  })
  revalidatePath(`/admin/cohorts/${cohortId}/materials`)
}

async function deleteMaterialAction(formData: FormData) {
  "use server"
  await requireAdmin()
  const materialId = String(formData.get("materialId") ?? "")
  const cohortId = String(formData.get("cohortId") ?? "")
  if (!materialId) return
  await deleteMaterial(materialId)
  revalidatePath(`/admin/cohorts/${cohortId}/materials`)
}

function isLive(m: CohortMaterial): boolean {
  return m.published_at != null && new Date(m.published_at) <= new Date()
}

function statusLabel(m: CohortMaterial): string {
  if (m.published_at == null) return "Draft"
  return isLive(m) ? "Published" : `Scheduled ${new Date(m.published_at).toLocaleDateString()}`
}

export default async function MaterialsAdminPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const cohort = await getCohort(id)
  if (!cohort) notFound()
  const materials = await listMaterialsForCohortAdmin(cohort)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/admin/cohorts"
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 mb-6"
      >
        <ArrowLeft size={16} /> All cohorts
      </Link>

      <h1 className="text-2xl font-semibold text-stone-900">Materials</h1>
      <p className="text-stone-600 mt-1 mb-8">{cohort.name}</p>

      {/* Add material */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 mb-10">
        <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5" /> Add material
        </h2>
        <form action={createMaterialAction} className="grid sm:grid-cols-2 gap-4">
          <input type="hidden" name="cohortId" value={cohort.id} />
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
            <input name="title" required placeholder="Session 1 recording" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Section
            </label>
            <input
              name="section"
              required
              placeholder="ai_basics, session_1, session_2…"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Type</label>
            <select name="type" className={inputClass} defaultValue="video">
              <option value="video">Video</option>
              <option value="recording">Recording</option>
              <option value="pdf">PDF</option>
              <option value="worksheet">Worksheet</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-1">
              URL (Mux/Loom playback or signed download link)
            </label>
            <input name="url" required placeholder="https://…" className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Description (optional)
            </label>
            <input name="description" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Display order</label>
            <input type="number" name="display_order" defaultValue={0} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Publish at (leave blank to stage)
            </label>
            <input type="datetime-local" name="published_at" className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 text-sm text-stone-700">
              <input type="checkbox" name="shared" className="h-4 w-4 rounded border-stone-300" />
              Shared library (visible to all {cohort.type} cohorts, e.g. AI Basics)
            </label>
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" /> Add material
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      {materials.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-500">
          No materials yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white divide-y divide-stone-100">
          {materials.map((m) => {
            const live = isLive(m)
            return (
              <div key={m.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-stone-900">{m.title}</span>
                    <span className="text-xs rounded-full bg-stone-100 px-2 py-0.5 text-stone-600">
                      {sectionLabel(m.section)}
                    </span>
                    <span className="text-xs rounded-full bg-stone-100 px-2 py-0.5 text-stone-500 uppercase">
                      {m.type}
                    </span>
                    {m.cohort_id == null && (
                      <span className="text-xs rounded-full bg-purple-50 px-2 py-0.5 text-purple-700">
                        shared
                      </span>
                    )}
                    <span
                      className={`text-xs rounded-full px-2 py-0.5 ${
                        live
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {statusLabel(m)}
                    </span>
                  </div>
                  <p className="text-sm text-stone-400 mt-0.5 truncate">{m.url}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <form action={togglePublishAction}>
                    <input type="hidden" name="materialId" value={m.id} />
                    <input type="hidden" name="cohortId" value={cohort.id} />
                    <input type="hidden" name="publish" value={live ? "false" : "true"} />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50"
                    >
                      {live ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {live ? "Unpublish" : "Publish now"}
                    </button>
                  </form>
                  <form action={deleteMaterialAction}>
                    <input type="hidden" name="materialId" value={m.id} />
                    <input type="hidden" name="cohortId" value={cohort.id} />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
