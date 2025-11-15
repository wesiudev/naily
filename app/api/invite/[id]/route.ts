import { NextResponse } from "next/server";
import { getInvite, getInviteByAlias } from "@/firebase";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // support both IDs and aliases
  let invite = await getInvite(id);
  if (!invite) {
    const byAlias = await getInviteByAlias(id);
    invite = byAlias || null;
  }
  if (!invite) return NextResponse.json({ exists: false }, { status: 404 });
  return NextResponse.json({ exists: true, invite });
}
