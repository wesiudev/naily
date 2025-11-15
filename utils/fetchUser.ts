type FetchUserError = { error: string };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnknownRecord = any;

export async function fetchUser(
  uid: string
): Promise<UnknownRecord | FetchUserError> {
  // Always use a relative URL to ensure we hit the same environment (dev/prod)
  const url = `/api/users/${uid}`;

  // Small retry to avoid race immediately after registration
  const maxAttempts = 3;
  const baseDelayMs = 300;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        const err = (await response
          .json()
          .catch(() => ({} as UnknownRecord))) as
          | { error?: string }
          | UnknownRecord;
        const message = err?.error || `HTTP ${response.status}`;

        // Retry on 404 as the user document may not have propagated yet
        if (response.status === 404 && attempt < maxAttempts) {
          await new Promise((r) => setTimeout(r, baseDelayMs * attempt));
          continue;
        }
        return { error: message } as FetchUserError;
      }
      const user: UnknownRecord = await response.json();
      return user;
    } catch (error) {
      // Network or transient error – retry unless last attempt
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, baseDelayMs * attempt));
        continue;
      }
      console.error("Error fetching user:", error);
      return { error: "Failed to fetch user data" } as FetchUserError;
    }
  }

  // Fallback, though loop should have returned earlier
  return { error: "Failed to fetch user data" } as FetchUserError;
}
