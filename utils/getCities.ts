"use server";
export async function getCities() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/cities/`, {
      next: { revalidate: 3600 },
      method: "GET",
    });
    if (!res.ok) {
      console.warn(`Failed to fetch cities: ${res.status} ${res.statusText}`);
      return [];
    }
    try {
      return await res.json();
    } catch (error) {
      console.warn("Error parsing cities JSON:", error);
      return [];
    }
  } catch (error) {
    console.warn("Error fetching cities:", error);
    return [];
  }
}
