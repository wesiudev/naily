import { NextRequest, NextResponse } from "next/server";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  try {
    const { uid, email, amountPLN } = await req.json();
    if (!email || typeof amountPLN !== "number") {
      return NextResponse.json(
        { success: false, error: "Missing email or amount" },
        { status: 400 }
      );
    }

    const unitAmount = Math.max(0, Math.floor(Number(amountPLN) * 100));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "pln",
            product_data: {
              name: "Budżet reklamowy Google Ads",
              description: `Jednorazowe doładowanie kampanii. Szacowana liczba kliknięć: ${Math.floor(
                (unitAmount / 100) / 0.25
              ).toLocaleString("pl-PL")} kl.`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        uid: uid ?? "",
        adBudgetPLN: String(amountPLN),
        type: "ads_one_time",
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error("One-time payment error:", error?.message || error);
    return NextResponse.json(
      { success: false, error: error?.message || "unknown" },
      { status: 500 }
    );
  }
}


