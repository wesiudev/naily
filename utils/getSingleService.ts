"use server";
export async function getSingleService(service: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL ?? ""}/service/${service}`,
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
