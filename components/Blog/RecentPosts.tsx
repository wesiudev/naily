"use server";
import { BlogGrid } from "./BlogLayout";

async function fetchRecent(limit = 6) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/posts/list`, {
      next: { revalidate: 300 },
      cache: "force-cache",
    });
    if (!res.ok) return [];
    const data = await res.json();
    const normalized = (Array.isArray(data) ? data : [])
      .filter((p: any) => p?.postId)
      .map((post: any, index: number) => ({
        id: post.postId || index,
        title: post.title || "Bez tytułu",
        shortDesc: post.metaDescription || post.intro || post.excerpt || "",
        image:
          typeof post.mainImage === "string" &&
          (post.mainImage.startsWith("http://") ||
            post.mainImage.startsWith("https://") ||
            post.mainImage.startsWith("/"))
            ? post.mainImage
            : post.coverImageUrl &&
              (post.coverImageUrl.startsWith("http://") ||
                post.coverImageUrl.startsWith("https://") ||
                post.coverImageUrl.startsWith("/"))
            ? post.coverImageUrl
            : "/services.png",
        url: post.url || post.slug || post.postId,
        date: new Date(post.creationTime || Date.now()).toLocaleDateString(
          "pl-PL",
          { year: "numeric", month: "long", day: "numeric" }
        ),
        readTime:
          (post.statistics && post.statistics.readingTimeMinutes) || undefined,
        tags: Array.isArray(post.tags) ? post.tags : [],
      }));
    return normalized.slice(0, limit);
  } catch (e) {
    return [];
  }
}

export default async function RecentPosts({
  title = "Najnowsze z bloga",
  subtitle = "Porady, inspiracje i wiedza od ekspertek",
  limit = 6,
  columns = 3,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  limit?: number;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}) {
  const posts = await fetchRecent(limit);

  if (!posts.length) return null;

  return (
    <section
      className={`section-padding px-4 sm:px-6 bg-neutral-50 ${className}`}
    >
      <div className="container-professional">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
            {title}
          </h2>
          {subtitle && (
            <p className="text-neutral-600 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>
        <BlogGrid posts={posts} columns={columns} />
      </div>
    </section>
  );
}
