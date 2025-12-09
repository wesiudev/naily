/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  updateUser,
  updateDocument,
  markInviteUsed,
  incrementPromoCounter,
} from "@/firebase";
import { fetchUser } from "@/utils/fetchUser";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const stripeSignature = req.headers.get("stripe-signature");
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(
      rawBody,
      stripeSignature,
      endpointSecret
    );
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return NextResponse.json({
      success: false,
      error: "Webhook signature verification failed",
    });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any;
      const reservationId = session?.metadata?.reservationId;
      if (reservationId) {
        await updateDocument(
          ["status", "paymentIntentId"],
          ["paid", session.payment_intent],
          "reservations",
          reservationId
        );
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
      const subscription = event.data.object as any;
      const uid = event.data.object.metadata.uid as string;
      const inviteId =
        (event.data.object.metadata.inviteId as string) || undefined;
      const promoTag =
        (event.data.object.metadata.promo as string) || undefined;
      const user = await fetchUser(uid);
      
      // Check if subscription is truly active
      // "active" and "trialing" are active (trialing is common in sandbox/test mode)
      // "past_due", "unpaid", "incomplete", "incomplete_expired", "canceled", "unpaid" are not active
      const isActive = subscription.status === "active" || subscription.status === "trialing";
      
      // Also check if period has expired (even if status is active)
      const currentTime = Math.floor(Date.now() / 1000);
      const periodEnd = subscription.current_period_end;
      const isPeriodExpired = periodEnd && periodEnd < currentTime;
      
      // Premium is only active if subscription status is active AND period hasn't expired
      const premiumActive = isActive && !isPeriodExpired;
      
      const paymentRecord = {
        amount: subscription?.plan?.amount ?? 0,
        date: Date.now(),
        result: premiumActive ? "paid" : "unpaid",
      };
      const userData = {
        ...user,
        subscriptionId: subscription.id,
        customerId: subscription.customer,
        premiumActive: premiumActive,
        active: premiumActive, // keep for backward compatibility
        subscription: {
          id: subscription.id,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
        allowedTabs: premiumActive ? ["calendar", "portfolio", "services"] : undefined,
        payments: user?.payments
          ? [...user.payments, paymentRecord]
          : [paymentRecord],
      };
      await updateUser(uid, userData);
      // Mark invite as used and increment promo counter only on successful activation
      if (premiumActive && inviteId) {
        await markInviteUsed(inviteId, uid);
        if (promoTag === "1pln_first100") {
          await incrementPromoCounter("manicure_1pln");
        }
      }
      break;
    case "customer.subscription.deleted":
      const uid2 = event.data.object.metadata.uid;
      const user2 = await fetchUser(uid2);
      await updateUser(uid2, {
        ...user2,
        premiumActive: false,
        active: false,
        subscription: {
          id: event.data.object.id,
          status: "canceled",
          currentPeriodEnd: event.data.object.current_period_end,
          cancelAtPeriodEnd: true,
        },
        allowedTabs: undefined, // Clear premium tabs access
      });
      break;

    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
