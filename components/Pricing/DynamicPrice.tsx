"use client";

import React from "react";

type DynamicPriceProps = {
  basePrice: number;
  serviceName: string;
  cityName: string;
  className?: string;
};

type TempPoint = {
  name: string;
  latitude: number;
  longitude: number;
};

const US_TEMP_POINTS: TempPoint[] = [
  { name: "New York", latitude: 40.7128, longitude: -74.006 },
  { name: "Los Angeles", latitude: 34.0522, longitude: -118.2437 },
  { name: "Chicago", latitude: 41.8781, longitude: -87.6298 },
  { name: "Miami", latitude: 25.7617, longitude: -80.1918 },
  { name: "Denver", latitude: 39.7392, longitude: -104.9903 },
  { name: "Seattle", latitude: 47.6062, longitude: -122.3321 },
];

function dayKey(date: Date): string {
  return `${date.getUTCFullYear()}-${
    date.getUTCMonth() + 1
  }-${date.getUTCDate()}`;
}

function simpleHash(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + input.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

async function fetchCurrentTemp(
  latitude: number,
  longitude: number
): Promise<number | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();
    const t = data?.current_weather?.temperature;
    return typeof t === "number" && !Number.isNaN(t) ? t : null;
  } catch {
    return null;
  }
}

function computeDeterministicPrice(
  basePrice: number,
  temperatures: number[],
  serviceName: string,
  cityName: string,
  key: string
): number {
  // Ensure basePrice is a valid number
  if (typeof basePrice !== "number" || Number.isNaN(basePrice)) {
    return 20; // Return minimum price if basePrice is invalid
  }

  if (temperatures.length === 0) {
    // Fallback: small deterministic jitter (±8%)
    const h = simpleHash(`${key}-${serviceName}-${cityName}`) % 17; // 0..16
    const jitter = (h - 8) / 100; // -0.08..+0.08
    return Math.max(20, Math.round(basePrice * (1 + jitter)));
  }

  // Filter out any NaN values from temperatures
  const validTemps = temperatures.filter((t) => !Number.isNaN(t));

  if (validTemps.length === 0) {
    return Math.max(20, basePrice);
  }

  // Core temperature features
  const avg = validTemps.reduce((a, b) => a + b, 0) / validTemps.length;
  const max = Math.max(...validTemps);
  const min = Math.min(...validTemps);
  const range = Math.max(1, max - min);

  // Normalize to a factor centered near 1.0
  // Heavier weight on avg temperature, small weight on range/volatility
  const avgFactor = 0.6 * (avg / 30); // 30°C as a reference baseline
  const rangeFactor = 0.2 * (range / 20); // 20°C spread baseline

  // Deterministic seasoning per day+service+city
  const spiceSeed = simpleHash(`${key}:${serviceName}:${cityName}`) % 11; // 0..10
  const spice = (spiceSeed - 5) / 100; // -0.05..+0.05

  // Final multiplier, clamped to sensible bounds (0.85..1.35)
  const multiplier = Math.min(
    1.35,
    Math.max(0.85, 1 + avgFactor + rangeFactor + spice)
  );
  const computed = Math.round(basePrice * multiplier);
  return Math.max(20, computed);
}

export default function DynamicPrice({
  basePrice,
  serviceName,
  cityName,
  className,
}: DynamicPriceProps) {
  const [price, setPrice] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const todayKey = React.useMemo(() => dayKey(new Date()), []);

  React.useEffect(() => {
    // Validate basePrice early
    if (typeof basePrice !== "number" || Number.isNaN(basePrice)) {
      setPrice(20);
      setLoading(false);
      return;
    }

    const storageKey = `dynamic-price-v1:${todayKey}:${serviceName}:${cityName}:${basePrice}`;
    const cached =
      typeof window !== "undefined"
        ? window.localStorage.getItem(storageKey)
        : null;
    if (cached) {
      const parsed = Number(cached);
      if (!Number.isNaN(parsed) && parsed > 0) {
        setPrice(parsed);
        setLoading(false);
        return;
      }
    }

    let cancelled = false;
    (async () => {
      try {
        const temps = await Promise.all(
          US_TEMP_POINTS.map((p) => fetchCurrentTemp(p.latitude, p.longitude))
        );
        const cleanTemps = temps.filter(
          (t): t is number => typeof t === "number" && !Number.isNaN(t)
        );
        const computed = computeDeterministicPrice(
          basePrice,
          cleanTemps,
          serviceName,
          cityName,
          todayKey
        );
        if (!cancelled) {
          setPrice(computed);
          setLoading(false);
          try {
            window.localStorage.setItem(storageKey, String(computed));
          } catch {
            // ignore storage errors
          }
        }
      } catch {
        if (!cancelled) {
          const fallback = computeDeterministicPrice(
            basePrice,
            [],
            serviceName,
            cityName,
            todayKey
          );
          setPrice(fallback);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [basePrice, serviceName, cityName, todayKey]);

  if (loading || price === null) {
    return (
      <span className={className} aria-busy="true">
        Od … zł
      </span>
    );
  }

  return <span className={className}>Od {price} zł</span>;
}
