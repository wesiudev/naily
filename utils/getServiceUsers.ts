"use server";
export async function getCityServiceUsers(city: string, service: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL ?? ""}/results/${service}/${city}`,
      {
        method: "POST",
      }
    );
    if (!res.ok) return [];
    try {
      return await res.json();
    } catch {
      return [];
    }
  } catch {
    return [];
  }
}
