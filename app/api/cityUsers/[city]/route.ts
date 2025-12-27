import { User } from "@/types";
import { createLinkFromText } from "@/utils/createLinkFromText";
import { getUsers } from "@/utils/getUsers";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ city: string }> }
) {
  const city = (await params).city;
  const users = await getUsers();
  const filteredUsers = users.filter((user: User) => {
    try {
      const inCity = createLinkFromText(user?.location?.address || "").includes(
        city
      );
      const isConfigured = Boolean(user?.configured);
      const isPublic = Boolean(user?.settings?.publicProfile ?? true);
      return inCity && isConfigured && isPublic;
    } catch {
      return false;
    }
  });
  if (filteredUsers.length === 0) {
    return NextResponse.json([]);
  } else {
    // Sort by priorityLevel (higher value = higher position), then by name
    const sortedUsers = filteredUsers.sort((a: User, b: User) => {
      const priorityA = a.priorityLevel ?? 0;
      const priorityB = b.priorityLevel ?? 0;
      if (priorityB !== priorityA) {
        return priorityB - priorityA; // Higher priority first
      }
      return (a.name || "").localeCompare(b.name || "");
    });

    return NextResponse.json(
      sortedUsers.map((user: User) => ({ ...user, email: "hidden" }))
    );
  }
}

