import { NextResponse } from "next/server";
import { staticBlogPosts } from "@/data/blogPosts";

export async function GET() {
  try {
    // Map static posts to a lightweight sample format consumed by EnhancedPostSamples
    const samples = staticBlogPosts
      .filter((p) => p.published)
      .map((p) => ({
        id: p.id,
        title: p.title,
        shortDesc: p.excerpt || "",
        image: p.coverImageUrl || "/services.png",
        url: p.slug,
        tags: Array.isArray(p.tags) ? p.tags.join(", ") : "",
      }));
    return NextResponse.json(samples);
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}
