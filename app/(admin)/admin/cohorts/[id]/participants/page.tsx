import Link from "next/link"
import { revalidatePath } from "next/cache"
import { notFound } from "next/navigation"
import { ArrowLeft, UserPlus, Trash2, Mail, CheckCircle2 } from "lucide-react"
import { requireAdmin } from "@/lib/auth/guards"
import {
  getCohort,
  listParticipants,
  enrollParticipant,
  removeParticipant,
} from "@/server/repos/cohorts"
import { sendWelcomeEmail } from "@/lib/cohort/notifications"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const inputClass =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"

async function addParticipantAction(formData: FormData) {
  "use server"
  await requireAdmin()
  const cohortId = String(formData.get("cohortId") ?? "")
  const email = String(formData.get("email") ?? "").trim()
  const notify = formData.get("notify") === "on"
  if (!cohortId || !email) return

  const { participant, cohort } = await enrollParticipant({ email, cohortId })
  if (notify) {
    try {
      await sendWelcomeEmail({ email: participant.email, cohort })
    } catch (e) {
      console.error("Welcome email failed:", e)
    }
  }
  revalidatePath(`/admin/cohorts/${cohortId}/participants`)
}

async function removeParticipantAction(formData: FormData) {
  "use server"
  await requireAdmin()
  const id = String(formData.get("participantId") ?? "")
  const cohortId = String(formData.get("cohortId") ?? "")
  if (!id) return
  await removeParticipant(id)
  revalidatePath(`/admin/cohorts/${cohortId}/participants`)
}

async function resendWelcomeAction(formData: FormData) {
  "use server"
  await requireAdmin()
  const cohortId = String(formData.get("cohortId") ?? "")
  const email = String(formData.get("email") ?? "").trim()
  if (!cohortId || !email) return
  const cohort = await getCohort(cohortId)
  if (cohort) {
    try {
      await sendWelcomeEmail({ email, cohort })
    } catch (e) {
      console.error("Welcome email failed:", e)
    }
  }
}

function formatShort(value: string): string {
  const iso = value.length === 10 ? `${value}T00:00:00` : value
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default async function ParticipantsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const cohort = await getCohort(id)
  if (!cohort) notFound()
  const participants = await listParticipants(id)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/admin/cohorts"
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 mb-6"
      >
        <ArrowLeft size={16} /> All cohorts
      </Link>

      <h1 className="text-2xl font-semibold text-stone-900">Roster</h1>
      <p className="text-stone-600 mt-1 mb-8">
        {cohort.name} · {participants.length} participant{participants.length !== 1 ? "s" : ""}
      </p>

      {/* Add participant */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 mb-10">
        <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
          <UserPlus className="h-5 w-5" /> Invite a participant
        </h2>
        <form action={addParticipantAction} className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <input type="hidden" name="cohortId" value={cohort.id} />
          <div className="flex-1">
            <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
            <input type="email" name="email" required placeholder="leader@company.com" className={inputClass} />
          </div>
          <label className="flex items-center gap-2 text-sm text-stone-700 pb-2 sm:pb-2.5">
            <input type="checkbox" name="notify" defaultChecked className="h-4 w-4 rounded border-stone-300" />
            Send invite email
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <UserPlus className="h-4 w-4" /> Send invite
          </button>
        </form>
        <p className="mt-3 text-xs text-stone-500">
          Creates their seat immediately and emails an invite with a sign-in link. Access runs until 90 days after
          the cohort's end date ({formatShort(cohort.end_date)}); they get in by signing in with this email.
        </p>
      </div>

      {/* Roster */}
      {participants.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-500">
          No participants yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white divide-y divide-stone-100">
          {participants.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-stone-900">{p.email}</span>
                  {p.clerk_user_id ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle2 className="h-3.5 w-3.5" /> linked
                    </span>
                  ) : (
                    <span className="text-xs text-stone-400">not signed in yet</span>
                  )}
                </div>
                <p className="text-sm text-stone-500 mt-0.5">
                  Joined {formatShort(p.joined_at)} · access until {formatShort(p.access_expires_at)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <form action={resendWelcomeAction}>
                  <input type="hidden" name="cohortId" value={cohort.id} />
                  <input type="hidden" name="email" value={p.email} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50"
                  >
                    <Mail className="h-4 w-4" /> Resend
                  </button>
                </form>
                <form action={removeParticipantAction}>
                  <input type="hidden" name="participantId" value={p.id} />
                  <input type="hidden" name="cohortId" value={cohort.id} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
