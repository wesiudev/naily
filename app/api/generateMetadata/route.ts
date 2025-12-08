import { NextRequest, NextResponse } from "next/server";
import { createChat } from "completions";
import { updateUser, getDocument } from "@/firebase";

export async function POST(req: NextRequest) {
  try {
    const { description, uid, name, city } = await req.json();

    if (!uid || typeof uid !== "string") {
      return NextResponse.json(
        { error: "Missing 'uid' in request body" },
        { status: 400 }
      );
    }

    // If no description provided, try to get it from user document
    let userDescription = description;
    let userName = name;
    let userCity = city;
    
    if (!userDescription || !userName || !userCity) {
      const user = await getDocument("users", uid);
      if (!userDescription) userDescription = user?.description || "";
      if (!userName) userName = user?.name || "";
      if (!userCity) userCity = user?.location?.address || "";
    }

    // Extract city name from address if it's a full address
    // Try to extract just the city name (usually the last part before postal code or first part)
    let cityName = userCity;
    if (userCity) {
      // Remove postal codes and extra whitespace
      cityName = userCity.split(/\d{2}-\d{3}/)[0].trim();
      // If address contains commas, take the city part (usually before postal code or last part)
      const parts = cityName.split(",");
      if (parts.length > 1) {
        cityName = parts[parts.length - 1].trim();
      }
      // Remove common address prefixes
      cityName = cityName.replace(/^(ul\.|ulica|pl\.|plac|al\.|aleja)\s+/i, "").trim();
    }

    // If still no description, use name as fallback
    if (!userDescription && !userName) {
      return NextResponse.json(
        { error: "Missing 'description' or 'name' in request body or user profile" },
        { status: 400 }
      );
    }

    const chat = createChat({
      apiKey: process.env.OPENAI_API_KEY!,
      model: "gpt-4",
    });

    const cityContext = cityName ? ` Lokalizacja: ${cityName}` : "";
    const context = `
    Profil salonu paznokci / stylisty paznokci (PL):
    Nazwa: ${userName || "Salon paznokci"}
    Opis: ${userDescription || "Profesjonalny salon paznokci"}${cityContext}
    
    Wygeneruj zoptymalizowane metadane SEO dla profilu salonu paznokci w języku polskim.${cityName ? ` Uwzględnij lokalizację (${cityName}) w tytule i opisie, aby były bardziej atrakcyjne dla lokalnych wyszukiwań.` : ""}
    `;

    const response = await chat.sendMessage(
      `${context}\n\nZwróć zoptymalizowane metadane SEO w języku polskim. Zwróć obiekt z polami: seoTitle (dokładnie <=60 znaków, atrakcyjny tytuł dla wyników Google), seoDescription (dokładnie <=160 znaków, zachęcający opis dla wyników Google).`,
      {
        expect: {
          examples: [
            {
              seoTitle: "Manicure hybrydowy Warszawa - Profesjonalny salon paznokci",
              seoDescription:
                "Profesjonalny salon paznokci w Warszawie. Manicure hybrydowy, przedłużanie paznokci, stylizacja. Umów wizytę online!",
            },
            {
              seoTitle: "Salon paznokci Kraków - Manicure i pedicure",
              seoDescription:
                "Najlepszy salon paznokci w Krakowie. Profesjonalny manicure hybrydowy, pedicure, przedłużanie. Rezerwacja online!",
            },
          ],
          properties: {
            response: {
              seoTitle: "string",
              seoDescription: "string",
            },
          },
          schema: {
            additionalProperties: true,
            type: "object",
            properties: {
              response: { type: "object" },
            },
            required: ["seoTitle", "seoDescription"],
          },
        },
      }
    );

    const payload = response.content as unknown as Record<string, unknown>;
    
    // Ensure length constraints
    let seoTitle = String(payload.seoTitle || userName || "Salon paznokci").slice(0, 60);
    let seoDescription = String(payload.seoDescription || userDescription || "Profesjonalny salon paznokci").slice(0, 160);

    // Get current user to preserve existing metadata
    const user = await getDocument("users", uid);
    const currentMetadata = user?.metadata || {};

    // Update user metadata
    const updatedMetadata = {
      ...currentMetadata,
      seoTitle,
      seoDescription,
    };

    // Save to database
    await updateUser(uid, {
      metadata: updatedMetadata,
    });

    return NextResponse.json({
      success: true,
      seoTitle,
      seoDescription,
    });
  } catch (error) {
    console.error("Metadata generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate metadata" },
      { status: 500 }
    );
  }
}

