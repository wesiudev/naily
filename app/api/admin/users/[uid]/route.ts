import { NextRequest, NextResponse } from "next/server";
import { updateUser } from "@/firebase";
import { User } from "@/types";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params;
    const userData: Partial<User> = await request.json();

    // Remove undefined values
    const cleanedData = Object.fromEntries(
      Object.entries(userData).filter(([_, v]) => v !== undefined)
    );

    await updateUser(uid, cleanedData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

