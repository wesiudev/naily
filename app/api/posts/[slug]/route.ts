import { NextRequest, NextResponse } from "next/server";
import { db, getBlogPosts } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit as qLimit,
  query,
  where,
} from "firebase/firestore";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    // 1) Direct document lookup by postId (used as document ID)
    const byIdRef = doc(db, "blog", slug);
    const byIdSnap = await getDoc(byIdRef);
    if (byIdSnap.exists()) {
      return NextResponse.json(byIdSnap.data());
    }

    // 2) Query by URL slug in collection
    const col = collection(db, "blog");
    const q = query(col, where("url", "==", slug), qLimit(1));
    const qs = await getDocs(q);
    if (!qs.empty) {
      return NextResponse.json(qs.docs[0].data());
    }

    // 3) Fallback: legacy single document with posts array
    const legacy = await getBlogPosts();
    const legacyPost = Array.isArray(legacy?.posts)
      ? legacy.posts.find(
          (p: any) => p?.url === slug || p?.postId === slug || p?.slug === slug
        )
      : null;
    if (legacyPost) {
      return NextResponse.json(legacyPost);
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
