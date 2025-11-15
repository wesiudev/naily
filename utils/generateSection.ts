"use server";
export async function generateSection(
  title: string,
  description: string,
  service: string
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/generateSection/`,
    {
      next: { revalidate: 3600 },
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, service }),
    }
  ).then((res) => res.json());
  return response;
}
