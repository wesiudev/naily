"use server";
export async function getPost(url: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/posts/${url}`
  ).then((res) => res.json());
  return response;
}
