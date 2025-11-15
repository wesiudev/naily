import type { MetadataRoute } from "next";
import { getPostSamples } from "@/utils/getPostSamples";
import { getUsers } from "@/utils/getUsers";
import { getCities } from "@/utils/getCities";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://naily.pl";

  const [users, posts, cities] = await Promise.all([
    getUsers().catch(() => []),
    // Prefer API list with real posts if available; fall back to samples util
    fetch(`${baseUrl}/api/posts/list`)
      .then((r) => r.json())
      .catch(() => []),
    getCities().catch(() => []),
  ]);

  const userEntries: MetadataRoute.Sitemap = Array.isArray(users)
    ? (users
        .map((u: any) => {
          const slug = u?.userSlugUrl || u?.uid;
          if (!slug) return null;
          return {
            url: `${baseUrl}/u/${slug}`,
            changeFrequency: "weekly",
            priority: 0.8,
          } as const;
        })
        .filter(Boolean) as any)
    : [];

  const postEntries: MetadataRoute.Sitemap = Array.isArray(posts)
    ? (posts
        .map((p: any) => {
          const slug = p?.slug || p?.url || p?.postId || p?.id;
          if (!slug) return null;
          return {
            url: `${baseUrl}/blog/${slug}`,
            changeFrequency: "weekly",
            priority: 0.7,
          } as const;
        })
        .filter(Boolean) as any)
    : [];

  const cityEntries: MetadataRoute.Sitemap = Array.isArray(cities)
    ? (cities
        .map((c: any) => {
          const slug = c?.id || c?.name;
          if (!slug) return null;
          return {
            url: `${baseUrl}/manicure-pedicure/${slug}`,
            changeFrequency: "weekly",
            priority: 0.6,
          } as const;
        })
        .filter(Boolean) as any)
    : [];

  const base: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.7 },
  ];

  return [...base, ...userEntries, ...postEntries, ...cityEntries];
}
