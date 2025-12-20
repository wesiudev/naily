import type { MetadataRoute } from "next";
import { getCities } from "@/utils/getCities";
import { ICity } from "@/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://naily.pl";

  const allCities = await getCities().catch(() => []);
  // Filter out villages, only include cities (matching the page behavior)
  const cities = Array.isArray(allCities)
    ? allCities.filter((city: ICity) => city.type === "city")
    : [];

  const base: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/kariera`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const cityEntries: MetadataRoute.Sitemap = cities
    .map((c: ICity) => {
      const slug = c?.id || c?.name;
      if (!slug) return null;
      return {
        url: `${baseUrl}/kariera/${slug}`,
        changeFrequency: "weekly",
        priority: 0.7,
      } as const;
    })
    .filter(Boolean) as MetadataRoute.Sitemap;

  return [...base, ...cityEntries];
}

