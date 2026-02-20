import { NextResponse } from "next/server";
import { getCityTypeCitiesData } from "@/utils/buildCities";

export const dynamic = "force-dynamic";

export async function GET() {
  const cities = getCityTypeCitiesData();
  return NextResponse.json(cities);
}
