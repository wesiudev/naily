import { fetchUser } from "@/utils/fetchUser";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { uid } = await req.json(); // Get UID from request body

    if (!uid) {
      return NextResponse.json({
        success: false,
        error: "No UID provided",
      });
    }

    // Fetch the user to get the customer ID
    const user = await fetchUser(uid);

    if (!user || (user as any).error) {
      return NextResponse.json({
        success: false,
        error: "User not found",
      });
    }

    const customerId = (user as any).customerId;

    if (!customerId) {
      return NextResponse.json({
        success: false,
        error: "Customer ID not found. Please ensure you have an active subscription.",
      });
    }

    // Create a Stripe Customer Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId, // Use the Stripe customer ID
      return_url: `${process.env.NEXT_PUBLIC_URL || ''}/dashboard`, // Where to return after portal actions
    });

    console.log("Portal session created:", {
      url: portalSession.url,
      customer: customerId,
    });

    if (!portalSession.url) {
      return NextResponse.json({
        success: false,
        error: "Failed to create portal session URL",
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      url: portalSession.url, // Return the Customer Portal URL
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(
      "Error creating Stripe Customer Portal session:",
      error.message
    );
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
