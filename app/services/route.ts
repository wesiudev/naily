import { getDocuments } from "@/firebase";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const services = await getDocuments("content");
    return NextResponse.json(services ?? []);
  } catch {
    return NextResponse.json([]);
  }
}
