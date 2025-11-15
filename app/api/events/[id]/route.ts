import { NextRequest, NextResponse } from "next/server";
import { getDocument, removeDocument, updateDocument } from "@/firebase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const event = await getDocument("events", id);
    if (!event) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ id, ...event });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const allowedKeys = [
      "title",
      "date",
      "time",
      "description",
    ] as const;
    const keys: string[] = [];
    const values: any[] = [];
    for (const k of allowedKeys) {
      if (k in body) {
        keys.push(k);
        values.push(body[k] || null);
      }
    }
    if (keys.length === 0) {
      return NextResponse.json({ error: "No valid fields" }, { status: 400 });
    }
    // Always update updatedAt
    keys.push("updatedAt");
    values.push(new Date().toISOString());
    await updateDocument(keys, values, "events", id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await removeDocument("events", id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";

