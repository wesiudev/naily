import { NextResponse } from "next/server";
import { getCities } from "@/utils/getCities";
import { ICity } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://naily.pl";

  const allCities = await getCities().catch(() => []);
  // Filter out villages, only include cities (matching the page behavior)
  const cities = Array.isArray(allCities)
    ? allCities.filter((city: ICity) => city.type === "city")
    : [];

  const base = [
    { url: `${baseUrl}/szkolenia`, changefreq: "weekly", priority: 0.8 },
  ];

  const cityEntries = cities
    .map((c: ICity) => {
      const slug = c?.id || c?.name;
      if (!slug) return null;
      return {
        url: `${baseUrl}/szkolenia-manicure/${slug}`,
        changefreq: "weekly",
        priority: 0.7,
      };
    })
    .filter(Boolean);

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

