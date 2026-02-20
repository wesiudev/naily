"use server";
import { getCityTypeCitiesData } from "@/utils/buildCities";

export async function getCities() {
  try {
    // Use the data source directly instead of fetching from API
    // This avoids ECONNREFUSED errors during build time
    return getCityTypeCitiesData();
  } catch (error) {
    console.warn("Error getting cities:", error);
    return [];
  }
}
