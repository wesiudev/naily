"use server";

export async function getPostSamples() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/posts/postSamples`, {
      next: { revalidate: 9999 },
      method: "GET",
    });

    if (!response.ok) {
      console.warn(
        `Failed to fetch post samples: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const data = await response.json();

    // If API returns empty array, do not use placeholders
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    return data;
  } catch (error) {
    console.warn("Error fetching post samples:", error);
    return [];
  }
}
