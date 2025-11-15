import { NextRequest, NextResponse } from "next/server";
import { createChat } from "completions";

export async function POST(req: NextRequest) {
  try {
    const { name, category } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Missing 'name' in request body" },
        { status: 400 }
      );
    }

    const chat = createChat({
      apiKey: process.env.OPENAI_API_KEY!,
      model: "gpt-4",
    });

    const prompt = `Jesteś asystentem salonu paznokci. Na podstawie nazwy usługi podaj propozycję szczegółów w języku polskim.
Nazwa usługi: ${name}
Kategoria (opcjonalna): ${category ?? ""}

Zwróć obiekt JSON z polami:
- name: zwięzła, atrakcyjna nazwa (<= 60 znaków)
- description: krótki opis (1-2 zdania)
- category: jedna z kategorii: Manicure, Pedicure, Przedłużanie, Naprawa, Stylizacja, Pielęgnacja, Inne
- price: sugerowana cena w zł (liczba całkowita)
- duration: sugerowany czas trwania w minutach (liczba, krok 15)
- features: tablica 3-6 krótkich punktów z elementami usługi
`;

    const response = await chat.sendMessage(prompt, {
      expect: {
        examples: [
          {
            name: "Manicure hybrydowy",
            description:
              "Trwały manicure z użyciem lakieru hybrydowego o wysokim połysku.",
            category: "Manicure",
            price: "90",
            duration: "60",
            features: `
              "Opracowanie skórek",
              "Nadanie kształtu",
              "Aplikacja bazy i koloru",
              "Top z połyskiem",
            `,
          },
        ],
        properties: {
          response: {
            name: "string",
            description: "string",
            category: "string",
            price: "string",
            duration: "string",
            features: "string",
          },
        },
        schema: {
          additionalProperties: true,
          type: "object",
          properties: { response: { type: "object" } },
          required: [
            "name",
            "description",
            "category",
            "price",
            "duration",
            "features",
          ],
        },
      },
    });

    const payload = response.content as unknown as Record<string, unknown>;

    // Normalize values with safe defaults
    const nameOut = (payload.name as string) || name;
    const descOut = (payload.description as string) || "";
    const catOut = (payload.category as string) || category || "Inne";
    const priceOut = Number(payload.price) || 0;
    const durationOut = Number(payload.duration) || 60;
    const featuresRaw = payload.features as unknown as string[] | undefined;
    const featuresOut = Array.isArray(featuresRaw)
      ? featuresRaw
          .filter((f) => typeof f === "string" && f.trim() !== "")
          .slice(0, 8)
      : [];

    return NextResponse.json({
      name: nameOut,
      description: descOut,
      category: catOut,
      price: priceOut,
      duration: durationOut,
      features: featuresOut,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Service generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate service" },
      { status: 500 }
    );
  }
}
