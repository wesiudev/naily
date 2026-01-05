import { BlogGrid } from "./BlogLayout";
import { staticBlogPosts } from "@/data/blogPosts";
import { getDocuments, getBlogPosts } from "@/firebase";

function normalizePost(post: any, index: number) {
  return {
    id: post.postId || post.id || `post-${index}`,
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
    url: post.url || post.slug || post.postId || post.id || "",
    date: new Date(
      post.creationTime || post.createdAt || post.publishedAt || Date.now()
    ).toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    readTime:
      (post.statistics && post.statistics.readingTimeMinutes) || undefined,
    tags: Array.isArray(post.tags) ? post.tags : [],
  };
}

function getStaticPosts(limit: number) {
  return staticBlogPosts
    .filter((post) => post.published)
    .slice(0, limit)
    .map((post) => ({
      id: post.id,
      title: post.title,
      shortDesc: post.excerpt || "",
      image: post.coverImageUrl || "/services.png",
      url: post.slug,
      date: post.createdAt.toLocaleDateString("pl-PL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      readTime: post.statistics?.readingTimeMinutes,
      tags: post.tags || [],
    }));
}

async function fetchRecent(limit = 6) {
  try {
    // Try to fetch from Firebase first
    const [collectionDocs, legacy] = await Promise.all([
      getDocuments("blog").catch(() => []),
      getBlogPosts().catch(() => null),
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
    const firebasePosts = Array.from(map.values());

    // Normalize Firebase posts
    const normalized = firebasePosts
      .filter((p: any) => p?.postId || p?.id)
      .map((post: any, index: number) => normalizePost(post, index));

    // If we have Firebase posts, return them
    if (normalized.length > 0) {
      return normalized.slice(0, limit);
    }

    // Fallback to static blog posts
    return getStaticPosts(limit);
  } catch (e) {
    // If all else fails, use static posts
    console.error("Error fetching blog posts:", e);
    return getStaticPosts(limit);
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
      className={`py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white ${className}`}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-800 mb-3 sm:mb-4 md:mb-6 font-baloo leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="font-poppins text-neutral-600 text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed px-2">
              {subtitle}
            </p>
          )}
        </div>
        <BlogGrid posts={posts} columns={columns} />
      </div>
    </section>
  );
}
