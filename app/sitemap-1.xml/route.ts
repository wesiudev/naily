import { NextResponse } from "next/server";
import { getUsers } from "@/utils/getUsers";
import { getCities } from "@/utils/getCities";
import { ICity } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://naily.pl";

  const [users, posts, allCities] = await Promise.all([
    getUsers().catch(() => []),
    // Prefer API list with real posts if available; fall back to samples util
    fetch(`${baseUrl}/api/posts/list`)
      .then((r) => r.json())
      .catch(() => []),
    getCities().catch(() => []),
  ]);

  // Filter out villages, only include cities (matching the page behavior)
  const cities = Array.isArray(allCities)
    ? allCities.filter((city: ICity) => city.type === "city")
    : [];

  const userEntries = Array.isArray(users)
    ? users
        .map((u: any) => {
          const slug = u?.userSlugUrl || u?.uid;
          if (!slug) return null;
          return {
            url: `${baseUrl}/zarezerwuj/${slug}`,
            changefreq: "weekly",
            priority: 0.8,
          };
        })
        .filter(Boolean)
    : [];

  const postEntries = Array.isArray(posts)
    ? posts
        .map((p: any) => {
          const slug = p?.slug || p?.url || p?.postId || p?.id;
          if (!slug) return null;
          return {
            url: `${baseUrl}/blog/${slug}`,
            changefreq: "weekly",
            priority: 0.7,
          };
        })
        .filter(Boolean)
    : [];

  const cityEntries = cities
    .map((c: ICity) => {
      const slug = c?.id || c?.name;
      if (!slug) return null;
      return {
        url: `${baseUrl}/manicure/${slug}`,
        changefreq: "weekly",
        priority: 0.6,
      };
    })
    .filter(Boolean);

  const base = [
    { url: `${baseUrl}/`, changefreq: "weekly", priority: 1 },
    { url: `${baseUrl}/blog`, changefreq: "weekly", priority: 0.7 },
    { url: `${baseUrl}/szkolenia`, changefreq: "weekly", priority: 0.8 },
    { url: `${baseUrl}/kariera`, changefreq: "weekly", priority: 0.8 },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${base
  .map(
    (entry) => `  <url>
    <loc>${entry.url}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join("\n")}
${userEntries
  .map(
    (entry: any) => `  <url>
    <loc>${entry.url}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join("\n")}
${postEntries
  .map(
    (entry: any) => `  <url>
    <loc>${entry.url}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join("\n")}
${cityEntries
  .map(
    (entry: any) => `  <url>
    <loc>${entry.url}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

