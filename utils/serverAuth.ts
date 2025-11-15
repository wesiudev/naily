"use server";

import { cookies, headers } from "next/headers";
import { User } from "@/types";

export async function getCurrentUser(): Promise<User | null> {
  try {
    // For now, we'll use a simple approach with cookies
    // In a production app, you'd want to implement proper JWT verification
    const cookieStore = await cookies();
    const uid = cookieStore.get("uid")?.value;
    
    if (!uid) {
      return null;
    }

    // Fetch user data from the API endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/users/${uid}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const user = await response.json();
    return user as User;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("Authentication required");
  }
  
  return user;
}
