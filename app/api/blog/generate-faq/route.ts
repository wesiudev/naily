import { NextRequest, NextResponse } from "next/server";
import { createChat } from "completions";

export async function POST(req: NextRequest) {
  const { title, intro, sections } = await req.json();

  const chat = createChat({
    apiKey: process.env.OPENAI_API_KEY!,
    model: "gpt-4",
  });

  const context = `
  Kontekst posta (PL):
  Tytuł: ${title ?? ""}
  Wstęp: ${intro ?? ""}
  Sekcje: ${(sections ?? [])
    .map(
      (s: any) => `${s?.title ?? ""}: ${String(s?.content ?? "").slice(0, 200)}`
    )
    .join("\n")}
  `;

  const response = await chat.sendMessage(
    `${context}\n\nWygeneruj 3-6 pytań i odpowiedzi FAQ w języku polskim. Każdy element powinien mieć pola: question, answer. Odpowiedzi zwięzłe, konkretne, praktyczne. Zwróć jako tablicę obiektów.`,
    {
      expect: {
        examples: [
          {
            faq: '[{"question":"Jak długo trzyma się manicure hybrydowy?","answer":"Zwykle 2–3 tygodnie, zależnie od pielęgnacji i kondycji paznokci."},{"question":"Czy hybryda niszczy paznokcie?","answer":"Przy poprawnym ściąganiu i pielęgnacji nie. Najważniejsze jest unikanie zrywania lakieru."}]',
          },
        ],
        properties: {
          response: { faq: "string" },
        },
        schema: {
          additionalProperties: true,
          type: "object",
          properties: { response: { type: "object" } },
          required: ["faq"],
        },
      },
    }
  );

  // Leniently parse different possible response shapes to a uniform array
  const content: unknown = response.content as unknown;
  let faqItems: Array<{ question: string; answer: string }> = [];

  try {
    const c: any = content as any;
    if (Array.isArray(c?.faq)) {
      faqItems = c.faq as Array<{ question: string; answer: string }>;
    } else if (typeof c?.faq === "string") {
      const parsed = JSON.parse(c.faq as string);
      if (Array.isArray(parsed)) {
        faqItems = parsed as Array<{ question: string; answer: string }>;
      } else if (Array.isArray(parsed?.faq)) {
        faqItems = parsed.faq as Array<{ question: string; answer: string }>;
      }
    } else if (Array.isArray(c)) {
      faqItems = c as Array<{ question: string; answer: string }>;
    } else if (typeof c === "string") {
      const parsed = JSON.parse(c as string);
      if (Array.isArray(parsed)) {
        faqItems = parsed as Array<{ question: string; answer: string }>;
      } else if (Array.isArray((parsed as any)?.faq)) {
        faqItems = (parsed as any).faq as Array<{
          question: string;
          answer: string;
        }>;
      }
    }
  } catch (err) {
    // Swallow parsing errors and return empty array below
  }

  return NextResponse.json({ faq: faqItems });
}
