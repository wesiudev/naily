import { NextResponse } from "next/server";
import { getDocument } from "@/firebase";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params;
    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }
    const user = await getDocument("users", uid);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const body = await request.json().catch(() => ({}));
    const { secret } = body;
    
    // If secret is provided, validate it
    if (secret !== undefined) {
      if (secret !== process.env.SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
    
    // Backward compatibility: allow POST without secret (public access)
    return GET(request, { params });
  } catch (error) {
    // If JSON parsing fails, still allow public access
    return GET(request, { params });
  }
}
