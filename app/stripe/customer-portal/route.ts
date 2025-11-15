import { fetchUser } from "@/utils/fetchUser";
import { NextResponse } from "next/server";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  try {
    const { uid } = await req.json(); // Get UID from request body

    // Fetch the customer ID from your database (mocked here)
    // Replace this with your actual logic to retrieve the customer ID from UID
    const customer = await fetchUser(uid); // Implement this in your database logic

    if (!customer) {
      console.log("Customer not found");
    }

    // Create a Stripe Customer Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.customerId, // Use the Stripe customer ID
      return_url: `${process.env.NEXT_PUBLIC_URL}`, // Where to return after portal actions
    });

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
