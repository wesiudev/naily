import { NextResponse } from "next/server";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ query: string }> }
) {
  const query = (await params).query;
  return NextResponse.json(query);
}
