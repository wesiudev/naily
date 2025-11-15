"use server";
export async function getCityQuery(id: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/cities/${id}`, {
    next: { revalidate: 3600 },
    method: "GET",
  }).then((res) => res.json());
  return response;
}
