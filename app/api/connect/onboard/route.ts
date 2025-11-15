import { NextRequest, NextResponse } from "next/server";
import { getDocument, updateUser } from "@/firebase";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  try {
    const { uid, return_url, refresh_url } = await req.json();
    if (!uid)
      return NextResponse.json({ error: "uid required" }, { status: 400 });

    const user = await getDocument("users", uid);
    if (!user)
      return NextResponse.json({ error: "user not found" }, { status: 404 });

    let accountId = user.stripeConnectId as string | undefined;
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: "PL",
        email: user.email,
        capabilities: {
          transfers: { requested: true },
          card_payments: { requested: true },
        },
        business_type: "individual",
      });
      accountId = account.id;
      await updateUser(uid, { stripeConnectId: accountId });
    }

    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refresh_url || `${process.env.NEXT_PUBLIC_URL}/dashboard`,
      return_url: return_url || `${process.env.NEXT_PUBLIC_URL}/dashboard`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: link.url, accountId });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
