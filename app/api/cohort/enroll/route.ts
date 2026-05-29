import { NextRequest, NextResponse } from "next/server"
import { enrollParticipant } from "@/server/repos/cohorts"
import { sendWelcomeEmail } from "@/lib/cohort/notifications"

export const runtime = "nodejs"

/**
 * Programmatic enrollment endpoint, guarded by a shared secret.
 *
 * The primary v1 enrollment path is the admin roster page (manual). This
 * endpoint exists so enrollment can be automated later — e.g. a thin Stripe
 * `checkout.session.completed` adapter that maps the customer email + payment
 * link to a cohortId and POSTs here. No Stripe SDK is wired in v1.
 *
 * POST with header `x-cohort-enroll-secret: <COHORT_ENROLL_SECRET>`
 * Body: { email: string, cohortId: string, sendEmail?: boolean }
 */
export async function POST(req: NextRequest) {
  const secret = process.env.COHORT_ENROLL_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: "Enrollment endpoint not configured" },
      { status: 503 }
    )
  }
  if (req.headers.get("x-cohort-enroll-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { email, cohortId, sendEmail = true } = body ?? {}

    if (!email || typeof email !== "string" || !cohortId || typeof cohortId !== "string") {
      return NextResponse.json(
        { error: "email and cohortId are required" },
        { status: 400 }
      )
    }

    const { participant, cohort } = await enrollParticipant({
      email: email.trim(),
      cohortId,
    })

    if (sendEmail) {
      try {
        await sendWelcomeEmail({ email: participant.email, cohort })
      } catch (emailError) {
        console.error("Welcome email failed:", emailError)
      }
    }

    return NextResponse.json({ success: true, participantId: participant.id })
  } catch (error) {
    console.error("Cohort enrollment failed:", error)
    return NextResponse.json({ error: "Enrollment failed" }, { status: 500 })
  }
}
