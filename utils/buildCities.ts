import data from "polskie-miejscowosci";
import { createLinkFromText } from "@/utils/createLinkFromText";
import { ICity } from "@/types";

// Cache the processed cities data
let cachedCities: ICity[] | null = null;

type PLRecord = {
  Commune: string;
  District: string;
  Id: string | number;
  Latitude: number | string;
  Longitude: number | string;
  Name: string;
  Province: string;
  Type: string;
};

function buildCities(): ICity[] {
  // Group by Name and choose best record with valid coords (prefer city)
  const byName = new Map<string, PLRecord[]>();
  for (const record of data as unknown as PLRecord[]) {
    const name = record?.Name;
    if (!name) continue;
    const list = byName.get(name) ?? [];
    list.push(record);
    byName.set(name, list);
  }

  const parseCoord = (val: number | string | undefined): number => {
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const cleaned = val
        .trim()
        .replace(/,/g, ".")
        .replace(/[^0-9+\-.]/g, "");
      const num = Number(cleaned);
      return Number.isFinite(num) ? num : NaN;
    }
    return NaN;
  };

  const isValidCoord = (lat: number, lon: number): boolean => {
    return (
      Number.isFinite(lat) &&
      Number.isFinite(lon) &&
      lat >= 48 &&
      lat <= 55 &&
      lon >= 14 &&
      lon <= 24
    );
  };

  const normalizeType = (t: string | undefined): "village" | "city" => {
    const s = (t || "").toString().toLowerCase();
    if (s.includes("miasto") || s === "city") return "city";
    if (s.includes("wieś") || s.includes("wies") || s.includes("village"))
      return "village";
    return "city";
  };

  const result: ICity[] = [];
  for (const [name, records] of byName) {
    const best = records
      .map((r) => {
        const lat = parseCoord(r.Latitude);
        const lon = parseCoord(r.Longitude);
        const valid = isValidCoord(lat, lon) ? 1 : 0;
        const cityScore = normalizeType(r.Type) === "city" ? 1 : 0;
        return { r, lat, lon, valid, cityScore };
      })
      .sort((a, b) => {
        if (b.valid !== a.valid) return b.valid - a.valid;
        if (b.cityScore !== a.cityScore) return b.cityScore - a.cityScore;
        return 0;
      })[0];
    if (!best) continue;

    result.push({
      id: createLinkFromText(name),
      name,
      commune: best.r.Commune ?? "",
      district: best.r.District ?? "",
      province: best.r.Province ?? "",
      latitude: best.valid ? best.lat : 0,
      longitude: best.valid ? best.lon : 0,
      type: normalizeType(best.r.Type),
      sourceId: best.r?.Id?.toString?.() ?? "",
    });
  }

  return result;
}

export function getCitiesData(): ICity[] {
  if (!cachedCities) {
    cachedCities = buildCities();
  }
  return cachedCities;
}









