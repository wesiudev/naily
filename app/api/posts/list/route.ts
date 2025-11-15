import { NextResponse } from "next/server";
import { getDocuments, getBlogPosts } from "@/firebase";

export async function GET() {
  try {
    const [collectionDocs, legacy] = await Promise.all([
      getDocuments("blog"),
      getBlogPosts(),
    ]);

    const legacyPosts = Array.isArray(legacy?.posts) ? legacy.posts : [];
    const docs = Array.isArray(collectionDocs) ? collectionDocs : [];

    // Normalize: prefer collection docs, then legacy; dedupe by postId
    const map = new Map<string, any>();
    for (const p of [...docs, ...legacyPosts]) {
      const pid = p?.postId || p?.id;
      if (!pid) continue;
      map.set(pid, p);
    }
    const posts = Array.from(map.values());
    return NextResponse.json(posts);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Failed to list posts:", e);
    return NextResponse.json([], { status: 200 });
  }
}
