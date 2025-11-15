"use server";
export async function getSingleCity(city: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL ?? ""}/city/${city}`,
      {
        next: { revalidate: 3600 },
        method: "GET",
      }
    );
    if (!res.ok) return { error: true } as any;
    try {
      return await res.json();
    } catch {
      return { error: true } as any;
    }
  } catch {
    return { error: true } as any;
  }
}
