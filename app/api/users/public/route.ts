import { NextResponse } from "next/server";
import { getDocuments } from "@/firebase";
import { User } from "@/types";

export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const users: any = await getDocuments("users");

    const publicUsers = users
      .filter(
        (user: User) =>
          user.configured && user.settings?.publicProfile !== false
      )
      .map((user: User) => ({ ...user, email: "hidden" }));

    return NextResponse.json(publicUsers);
  } catch (e) {
    console.error("Failed to fetch public users:", e);
    return NextResponse.json([], { status: 200 });
  }
}
