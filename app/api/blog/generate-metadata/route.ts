import { NextRequest, NextResponse } from "next/server";
import { createChat } from "completions";

export async function POST(req: NextRequest) {
  const { title, intro, sections, tags } = await req.json();

  const chat = createChat({
    apiKey: process.env.OPENAI_API_KEY!,
    model: "gpt-4",
  });

  const context = `
  Kontekst posta na blogu (PL):
  Tytuł: ${title ?? ""}
  Wstęp: ${intro ?? ""}
  Sekcje: ${(sections ?? [])
    .map(
      (s: { title?: string; content?: unknown }) =>
        `${s?.title ?? ""}: ${String(s?.content ?? "").slice(0, 240)}`
    )
    .join("\n")}
  Istniejące tagi: ${(tags ?? []).join(", ")}
  `;

  const response = await chat.sendMessage(
    `${context}\n\nZwróć zoptymalizowane metadane SEO w języku polskim. Zwróć obiekt z polami: metaTitle (<=60 znaków), metaDescription (<=160 znaków), url (slug, małe litery, bez polskich znaków, myślniki), tags (tablica 4-10 precyzyjnych tagów).`,
    {
      expect: {
        examples: [
          {
            metaTitle: "Jak zadbać o manicure hybrydowy w domu",
            metaDescription:
              "Poznaj zasady pielęgnacji manicure hybrydowego: krok po kroku, najczęstsze błędy i praktyczne wskazówki.",
            url: "manicure-hybrydowy-pielegnacja-w-domu",
            tags: '["manicure", "hybryda", "paznokcie", "pielęgnacja", "porady"]',
          },
        ],
        properties: {
          response: {
            metaTitle: "string",
            metaDescription: "string",
            url: "string",
            tags: "string",
          },
        },
        schema: {
          additionalProperties: true,
          type: "object",
          properties: {
            response: { type: "object" },
          },
          required: ["metaTitle", "metaDescription", "url", "tags"],
        },
      },
    }
  );

  const payload = response.content as unknown as Record<string, unknown>;
  // Normalize tags to a string[] regardless of whether the model returned JSON string or array
  let resultTags: string[] = [];
  const rawTags = payload.tags as unknown;
  if (Array.isArray(rawTags)) {
    resultTags = rawTags as string[];
  } else if (typeof rawTags === "string") {
    try {
      const parsed = JSON.parse(rawTags);
      if (Array.isArray(parsed)) resultTags = parsed as string[];
    } catch {
      // ignore parse errors, keep empty tags
    }
  }
  return NextResponse.json({
    metaTitle: payload.metaTitle ?? "",
    metaDescription: payload.metaDescription ?? "",
    url: payload.url ?? "",
    tags: resultTags,
  });
}
