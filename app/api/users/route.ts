import { getDocuments } from "@/firebase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { secret } = await request.json();
  if (secret !== process.env.SECRET) {
    return NextResponse.json({ error: "Unauthorized" });
  }
  const users = await getDocuments("users");
  return NextResponse.json(users);
}
