import { updateUserSubscriptionData } from "@/firebase";
import { NextResponse } from "next/server";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  const data = await req.json();
  const sessionId = data.session_id;
  console.log(`to jest sesja: ${sessionId}`);
  if (!sessionId) {
    return NextResponse.json({
      success: false,
      error: "No session_id provided",
    });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const subscriptionId = session.subscription; // Subscription ID
    const customerId = session.customer; // Customer ID

    const paymentData = {
      amount: session.amount_total,
      date: Date.now(),
      result: session.payment_status,
    };

    await updateUserSubscriptionData(
      session.metadata.uid,
      subscriptionId,
      customerId,
      paymentData
    );

    return NextResponse.json({
      success: true,
      message: "Subscription successful",
      subscriptionId,
      customerId,
      session,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error retrieving session:", error.message);
    return NextResponse.json({ success: false, error: error.message });
  }
}
