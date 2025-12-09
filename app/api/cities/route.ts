import { NextResponse } from "next/server";
import { getCitiesData } from "@/utils/buildCities";

export const dynamic = "force-dynamic";

export async function GET() {
  const cities = getCitiesData();
  return NextResponse.json(cities);
}
