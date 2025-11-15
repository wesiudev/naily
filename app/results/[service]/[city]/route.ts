import { User } from "@/types";
import { createLinkFromText } from "@/utils/createLinkFromText";
import { getUsers } from "@/utils/getUsers";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ service: string; city: string }> }
) {
  const { city, service } = await params;
  const users = await getUsers();
  const filteredUsers = users.filter(
    (user: User) =>
      createLinkFromText(user.location.address).includes(city) &&
      user.services.some((s) => s.flatten_name.includes(service))
  );
  if (filteredUsers.length === 0) {
    return NextResponse.json([]);
  } else {
    return NextResponse.json(
      filteredUsers.map((user: User) => ({ ...user, email: "hidden" }))
    );
  }
}
