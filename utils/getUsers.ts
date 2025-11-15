"use server";
export async function getUsers() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/users`, {
    method: "POST",
    body: JSON.stringify({ secret: process.env.SECRET }),
  });
  const users = await response.json();
  return users;
}
