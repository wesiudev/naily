"use server";
export async function getCityUsers(city: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/cityUsers/${city}`,
    {
      method: "POST",
    }
  ).then((res) => res.json());

  return response;
}
