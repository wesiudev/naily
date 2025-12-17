import { NextResponse } from "next/server";
import { getUsers } from "@/utils/getUsers";
import { getCitiesData } from "@/utils/buildCities";
import { createLinkFromText } from "@/utils/createLinkFromText";
import { User, ICity } from "@/types";

export const dynamic = "force-dynamic";

// Common service keywords
const SERVICE_KEYWORDS = [
  "manicure", "pedicure", "hybrydowy", "klasyczny", "przedłużanie",
  "zdobienie", "nail art", "akryl", "żel", "hybryda", "szyjka",
  "stylizacja", "paznokcie", "nail", "manicurzystka", "pedicurzystka"
];

// Extract city and service from query
function parseQuery(query: string): { city?: string; service?: string; rawQuery: string } {
  const normalized = query.toLowerCase().trim();
  const words = normalized.split(/\s+/);
  
  // Try to find city name (usually Polish city names)
  const cities = getCitiesData();
  let foundCity: ICity | undefined;
  
  // Check for exact city match first
  for (const city of cities) {
    const cityLower = city.name.toLowerCase();
    if (normalized.includes(cityLower)) {
      // Check if it's a whole word match
      const regex = new RegExp(`\\b${cityLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(normalized)) {
        foundCity = city;
        break;
      }
    }
  }
  
  // If no exact match, try partial match
  if (!foundCity) {
    for (const city of cities) {
      const cityLower = city.name.toLowerCase();
      if (normalized.includes(cityLower) && cityLower.length >= 4) {
        foundCity = city;
        break;
      }
    }
  }
  
  // Extract service keywords
  let foundService: string | undefined;
  for (const keyword of SERVICE_KEYWORDS) {
    if (normalized.includes(keyword)) {
      foundService = keyword;
      break;
    }
  }
  
  // If city found, remove it from query to find service
  if (foundCity && !foundService) {
    const remainingQuery = normalized.replace(foundCity.name.toLowerCase(), '').trim();
    for (const keyword of SERVICE_KEYWORDS) {
      if (remainingQuery.includes(keyword)) {
        foundService = keyword;
        break;
      }
    }
  }
  
  return {
    city: foundCity?.id,
    service: foundService,
    rawQuery: query,
  };
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    
    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return NextResponse.json({ users: [], cities: [] });
    }
    
    const parsed = parseQuery(query);
    const users = await getUsers() as User[];
    const cities = getCitiesData();
    
    // Filter users based on parsed query
    let filteredUsers = users.filter((user: User) => {
      // Must be configured and public
      if (!user.configured || user.settings?.publicProfile === false) {
        return false;
      }
      
      let matchesCity = true;
      let matchesService = true;
      
      // Check city match
      if (parsed.city) {
        const userCityLink = createLinkFromText(user.location?.address || "");
        matchesCity = userCityLink.includes(parsed.city);
      } else {
        // If no city specified in parsed query, try to match city from raw query
        const queryLower = query.toLowerCase();
        const userCityLink = createLinkFromText(user.location?.address || "");
        
        // Check if query contains any city name that matches user's city
        const cityMatches = cities.some(city => {
          const cityLower = city.name.toLowerCase();
          const cityInQuery = queryLower.includes(cityLower);
          const userInCity = userCityLink.includes(city.id);
          return cityInQuery && userInCity;
        });
        
        // If query contains a city name, only show users from that city
        // Otherwise, show users from all cities (will be filtered by service if specified)
        matchesCity = cityMatches || !parsed.service; // Show all cities if no service specified
      }
      
      // Check service match
      if (parsed.service) {
        matchesService = user.services?.some((s) => 
          s.flatten_name.toLowerCase().includes(parsed.service!.toLowerCase()) ||
          s.real_name.toLowerCase().includes(parsed.service!.toLowerCase())
        ) || false;
      } else {
        // If no service keyword found, check if query matches any service
        const queryLower = query.toLowerCase();
        matchesService = user.services?.some((s) => 
          s.flatten_name.toLowerCase().includes(queryLower) ||
          s.real_name.toLowerCase().includes(queryLower)
        ) || false;
        
        // If query doesn't match services, don't filter by service (show all)
        if (!matchesService && parsed.city) {
          matchesService = true; // Show all services for the city
        }
      }
      
      return matchesCity && matchesService;
    });
    
    // Sort results: exact city matches first, then by relevance
    if (parsed.city) {
      filteredUsers.sort((a, b) => {
        const aCityLink = createLinkFromText(a.location?.address || "");
        const bCityLink = createLinkFromText(b.location?.address || "");
        const aExact = aCityLink === parsed.city;
        const bExact = bCityLink === parsed.city;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        return 0;
      });
    }
    
    // Limit results
    filteredUsers = filteredUsers.slice(0, 50);
    
    // Get unique cities from results
    const resultCities = new Set<string>();
    filteredUsers.forEach((user) => {
      const cityLink = createLinkFromText(user.location?.address || "");
      const city = cities.find(c => cityLink.includes(c.id));
      if (city) resultCities.add(city.id);
    });
    
    return NextResponse.json({
      users: filteredUsers.map((user: User) => ({ ...user, email: "hidden" })),
      cities: Array.from(resultCities).map(id => cities.find(c => c.id === id)).filter(Boolean),
      parsed,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ users: [], cities: [], error: "Search failed" }, { status: 500 });
  }
}

