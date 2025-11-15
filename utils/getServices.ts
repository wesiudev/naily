"use server";
export async function getServices() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/services/`, {
      next: { revalidate: 3600 },
      method: "GET",
    });
    if (!res.ok) {
      console.warn(`Failed to fetch services: ${res.status} ${res.statusText}`);
      return [];
    }
    try {
      return await res.json();
    } catch (error) {
      console.warn("Error parsing services JSON:", error);
      return [];
    }
  } catch (error) {
    console.warn("Error fetching services:", error);
    return [];
  }
}
