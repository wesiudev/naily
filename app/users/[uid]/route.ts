/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDocument } from "@/firebase";
import { NextResponse } from "next/server";
export async function POST(
  request: Request,
  { params }: { params: Promise<any> }
) {
  const { secret } = await request.json();
  if (secret !== process.env.SECRET) {
    return NextResponse.json({ error: "Unauthorized" });
  }
  const { uid } = await params;
  const user = await getDocument("users", uid);
  if (!user) {
    return NextResponse.json({ error: "User not found" });
  }
  return NextResponse.json(user);
}
