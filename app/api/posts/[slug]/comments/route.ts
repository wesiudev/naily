import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const ref = doc(db, "blog_comments", slug);
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : { comments: [] };
    return NextResponse.json(Array.isArray(data.comments) ? data.comments : []);
  } catch (e) {
    return NextResponse.json([]);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await req.json();
  const text = String(body?.text || "").trim();
  if (!text) return NextResponse.json({ error: "empty" }, { status: 400 });
  try {
    const ref = doc(db, "blog_comments", slug);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, { comments: [{ text, createdAt: Date.now() }] });
    } else {
      await updateDoc(ref, {
        comments: arrayUnion({ text, createdAt: Date.now() }),
      });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
