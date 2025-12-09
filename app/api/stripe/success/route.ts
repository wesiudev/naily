import { updateUserSubscriptionData, updateUser } from "@/firebase";
import { fetchUser } from "@/utils/fetchUser";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
    const uid = session.metadata?.uid;

    if (!uid) {
      return NextResponse.json({
        success: false,
        error: "No user ID in session metadata",
      });
    }

    // Fetch the subscription to get its status and period end
    let subscription: Stripe.Subscription | null = null;
    if (subscriptionId) {
      try {
        // session.subscription can be a string (ID) or Subscription object (if expanded)
        if (typeof subscriptionId === "string") {
          subscription = await stripe.subscriptions.retrieve(subscriptionId);
        } else {
          // Already a Subscription object (expanded)
          subscription = subscriptionId;
        }
      } catch (subError) {
        console.error("Error retrieving subscription:", subError);
        // Continue anyway, webhook will handle it
      }
    }

    const paymentData = {
      amount: session.amount_total,
      date: Date.now(),
      result: session.payment_status === "paid" ? "paid" : "unpaid",
    };

    // Update subscription data (basic info)
    // Ensure subscriptionId is a string for the update function
    // Prefer subscription.id if we have the full object, otherwise use the original subscriptionId
    const subscriptionIdString = subscription?.id || (typeof subscriptionId === "string" ? subscriptionId : subscriptionId?.id || null);
    await updateUserSubscriptionData(
      uid,
      subscriptionIdString,
      customerId,
      paymentData
    );

    // If we have subscription data, update premium status immediately
    if (subscription) {
      const user = await fetchUser(uid);
      // Treat "active" and "trialing" as active (trialing is common in sandbox/test mode)
      const isActive = subscription.status === "active" || subscription.status === "trialing";
      
      const userData = {
        ...user,
        subscriptionId: subscription.id,
        customerId: subscription.customer,
        premiumActive: isActive,
        active: isActive, // keep for backward compatibility
        subscription: {
          id: subscription.id,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
        allowedTabs: isActive ? ["calendar", "portfolio", "services"] : undefined,
      };

      await updateUser(uid, userData);
    }

    return NextResponse.json({
      success: true,
      message: "Subscription successful",
      subscriptionId: subscriptionIdString,
      customerId,
      session,
      subscriptionStatus: subscription?.status,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error retrieving session:", error.message);
    return NextResponse.json({ success: false, error: error.message });
  }
}
