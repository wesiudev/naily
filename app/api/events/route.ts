import { NextRequest, NextResponse } from "next/server";
import { addDocument, getDocuments } from "@/firebase";
import { randomUUID } from "crypto";

type CreateEventBody = {
  userId: string;
  title: string;
  date: string; // ISO date format YYYY-MM-DD
  time?: string; // HH:mm format
  description?: string;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    const all = (await getDocuments("events")) as any[];
    const filtered = all.filter((e) => e.userId === userId);
    // Sort by date, then by time if available
    filtered.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      const timeA = a.time || "00:00";
      const timeB = b.time || "00:00";
      return timeA.localeCompare(timeB);
    });
    return NextResponse.json(filtered);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateEventBody;
    if (!body?.userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }
    if (!body?.title) {
      return NextResponse.json(
        { error: "Missing title" },
        { status: 400 }
      );
    }
    if (!body?.date) {
      return NextResponse.json(
        { error: "Missing date" },
        { status: 400 }
      );
    }

    const id = `evt_${randomUUID()}`;
    const now = new Date().toISOString();
    const event = {
      id,
      userId: body.userId,
      title: body.title,
      date: body.date,
      time: body.time || null,
      description: body.description || null,
      createdAt: now,
      updatedAt: now,
    };
    await addDocument("events", id, event);
    return NextResponse.json(event, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";

