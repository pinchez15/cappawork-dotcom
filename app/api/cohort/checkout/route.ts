import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export const runtime = "nodejs"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20.acacia",
})

export async function POST(req: NextRequest) {
  try {
    const { name, email, earlyBird } = await req.json()

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
    }

    // Determine price based on early bird status
    // You'll need to create these Price IDs in your Stripe dashboard
    const priceId = earlyBird
      ? process.env.STRIPE_COHORT_EARLY_BIRD_PRICE_ID
      : process.env.STRIPE_COHORT_PRICE_ID

    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe price not configured. Please set STRIPE_COHORT_PRICE_ID and STRIPE_COHORT_EARLY_BIRD_PRICE_ID" },
        { status: 500 }
      )
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email,
      metadata: {
        customer_name: name,
        cohort_type: "builder_cohort",
        early_bird: earlyBird ? "true" : "false",
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/cohort/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/cohort/checkout`,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create checkout session" },
      { status: 500 }
    )
  }
}

