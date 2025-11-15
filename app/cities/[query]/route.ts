import data from "polskie-miejscowosci";
import { createLinkFromText } from "@/utils/createLinkFromText";
import { NextResponse } from "next/server";

// Cache the processed cities data
let cachedCities: { id: string; name: string }[] | null = null;

function getCities() {
  if (!cachedCities) {
    cachedCities = Array.from(new Set(data.map((city) => city.Name))).map(
      (name) => ({
        id: createLinkFromText(name),
        name,
      })
    );
  }
  return cachedCities;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ query: string }> }
) {
  const query = (await params).query.toLowerCase();
  const cities = getCities();

  // More efficient filtering - search in both id and name, limit results
  const filteredCities = cities
    .filter(
      (city) =>
        city.id.toLowerCase().includes(query) ||
        city.name.toLowerCase().includes(query)
    )
    .slice(0, 10); // Limit to 10 results for better performance

  // Sort exact matches first
  filteredCities.sort((a, b) => {
    const aIdMatch = a.id.toLowerCase() === query;
    const bIdMatch = b.id.toLowerCase() === query;
    const aNameMatch = a.name.toLowerCase() === query;
    const bNameMatch = b.name.toLowerCase() === query;

    if (aIdMatch && !bIdMatch) return -1;
    if (bIdMatch && !aIdMatch) return 1;
    if (aNameMatch && !bNameMatch) return -1;
    if (bNameMatch && !aNameMatch) return 1;

    // Then sort by how early the match appears
    const aIdIndex = a.id.toLowerCase().indexOf(query);
    const bIdIndex = b.id.toLowerCase().indexOf(query);
    if (aIdIndex !== bIdIndex) return aIdIndex - bIdIndex;

    return a.name.localeCompare(b.name);
  });

  return NextResponse.json(filteredCities);
}
