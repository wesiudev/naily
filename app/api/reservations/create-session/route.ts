import { NextRequest, NextResponse } from "next/server";
import { getDocument, addDocument } from "@/firebase";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  try {
    const {
      specialistUid,
      customerUid,
      serviceName,
      amount,
      currency = "pln",
    } = await req.json();
    if (!specialistUid || !customerUid || !serviceName || !amount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const specialist = await getDocument("users", specialistUid);
    if (!specialist?.stripeConnectId) {
      return NextResponse.json(
        { error: "Specialist not onboarded to Stripe" },
        { status: 400 }
      );
    }

    // Create a Stripe Checkout Session with destination charge to connected account
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_intent_data: {
        transfer_data: {
          destination: specialist.stripeConnectId,
        },
        application_fee_amount: 0,
      },
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: Math.round(Number(amount) * 100),
            product_data: { name: serviceName },
          },
          quantity: 1,
        },
      ],
      metadata: {
        specialistUid,
        customerUid,
        serviceName,
        reservationId: `${specialistUid}-${Date.now()}`,
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/r/${encodeURIComponent(
        serviceName
      )}`,
    });

    // Store a pending reservation record
    await addDocument("reservations", session.metadata.reservationId, {
      id: session.metadata.reservationId,
      specialistUid,
      customerUid,
      serviceName,
      amount,
      currency,
      status: "pending",
      createdAt: new Date().toISOString(),
      checkoutSessionId: session.id,
      paymentIntentId: session.payment_intent || null,
    });

    return NextResponse.json({
      url: session.url,
      reservationId: session.metadata.reservationId,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
