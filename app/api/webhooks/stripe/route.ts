import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/db/client";

export const runtime = "nodejs";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  });
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = (
      session.client_reference_id ||
      session.customer_details?.email ||
      ""
    )
      .trim()
      .toLowerCase();

    if (!email) {
      console.error("Stripe webhook: no email found in session", session.id);
      return NextResponse.json({ received: true });
    }

    // Determine product by amount
    const amountTotal = session.amount_total ?? 0; // in cents
    const isCall = amountTotal >= 29700; // $297
    const isPdf = amountTotal > 0 && amountTotal < 29700; // $27 or similar

    const updateField = isCall
      ? "purchased_call"
      : isPdf
        ? "purchased_pdf"
        : null;

    if (updateField) {
      const { error } = await supabaseAdmin
        .from("scorecard_leads")
        .update({ [updateField]: true, updated_at: new Date().toISOString() })
        .eq("email", email);

      if (error) {
        console.error(`Stripe webhook: failed to update ${updateField}`, error);
      } else {
        console.log(`Stripe webhook: ${updateField} = true for ${email}`);
      }
    }
  }

  return NextResponse.json({ received: true });
}
