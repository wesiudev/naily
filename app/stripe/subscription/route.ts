import { NextResponse } from "next/server";
import { getInvite, getPromoCounter } from "@/firebase";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  try {
    const { uid, email, successRedirect, inviteId, adBudgetPLN } =
      await req.json();
    // Determine pricing: promo 1 PLN for first 100 valid invites, otherwise 49.99 PLN
    let unitAmount = 4999; // default 49.99 PLN
    let isPromo = false;
    if (inviteId) {
      const invite = await getInvite(inviteId);
      if (
        invite &&
        invite.status === "pending" &&
        invite.type === "manicure-pricing"
      ) {
        const counter = await getPromoCounter("manicure_1pln");
        if ((counter?.usedCount ?? 0) < 100) {
          unitAmount = 100; // 1 PLN
          isPromo = true;
        }
      }
    }

    // If user provided an advertisement budget, we include it as a metered/adjustable cap note.
    // Here we convert a monthly budget into the subscription price. The base premium stays at 0,
    // and the ad budget becomes the subscription amount. Clamp 0–25_000 PLN.
    if (typeof adBudgetPLN === "number") {
      const clamped = Math.max(0, Math.min(25000, Math.floor(adBudgetPLN)));
      // Override unitAmount to use the user's input
      unitAmount = Math.round(clamped * 100);
    }

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription", // Subscription mode
      payment_method_types: ["card"], // Accept card payments
      customer_email: email, // Pre-fill email for the user
      line_items: [
        {
          price_data: {
            currency: "pln",
            product_data: {
              name: isPromo
                ? "Premium Subscription - Oferta 1 PLN/mies."
                : "Premium Subscription (price based on monthly ad budget)",
              description: isPromo
                ? "Specjalna oferta dla profesjonalistów manicure: 1 PLN/mies. (pierwsze 100 osób)"
                : "Miesięczna subskrypcja premium z limitem budżetu reklamowego",
            },
            unit_amount: unitAmount,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        uid,
        inviteId: inviteId ?? "",
        adBudgetPLN: adBudgetPLN ?? "",
      },
      subscription_data: {
        metadata: {
          uid,
          inviteId: inviteId ?? "",
          promo: isPromo ? "1pln_first100" : "",
          adBudgetPLN: adBudgetPLN ?? "",
        },
      },
      success_url: `${
        successRedirect || process.env.NEXT_PUBLIC_URL + "/success"
      }?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/`,
    });

    // Optionally, save the session ID to track progress (e.g., save to your database with userId)

    return NextResponse.json({
      success: true,
      url: session.url, // Send the Checkout page URL back to the client
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating Stripe Checkout Session:", error.message);
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
