import { NextRequest, NextResponse } from "next/server";
import { createChat } from "completions";

export async function GET(req: NextRequest) {
  const topic = req.nextUrl.searchParams.get("topic");

  const chat = createChat({
    apiKey: process.env.OPENAI_API_KEY!,
    model: "gpt-4",
  });

  await chat.sendMessage("Ping");
  const response = await chat.sendMessage(
    `Generujesz post na bloga, który ma być bardziej rozbudowany i obejmować 7 sekcji. Napisz angażujący tekst na temat ${topic}. Uwzględnij poprawne odmiany pisowni polskiej. Tekst powinien składać się z 1500-2000 znaków`,
    {
      expect: {
        examples: [
          {
            title: "Jak algorytm TikToka może zmienić strategię twórców",
            shortDesc:
              "Poznaj zaawansowane metody, które umożliwiają dotarcie do większej liczby odbiorców na TikToku.",
            text1Title: "Wprowadzenie",
            text1Desc: `
              TikTok jest obecnie jedną z najczęściej używanych platform społecznościowych na świecie. Sukces ten opiera się na unikalnym algorytmie rekomendacji, który umożliwia odkrywanie nowych treści w sposób, który utrzymuje zaangażowanie użytkowników.
            `,
            text2Title: "Mechanika Algorytmu",
            text2Desc: `
              TikTok analizuje każdy ruch użytkowników: od czasu oglądania, przez polubienia, po sposób przeglądania profili. Ta szczegółowa analiza tworzy złożony obraz użytkownika, który umożliwia TikTokowi dostosowywanie treści.
            `,
            text3Title: "Wpływ na Twórców",
            text3Desc: `
              Dzięki algorytmowi TikToka, nawet początkujący twórcy mogą dotrzeć do szerokiego grona odbiorców, co umożliwia szybszy rozwój bez konieczności posiadania dużego grona obserwujących na starcie.
            `,
            text4Title: "Strategie Twórców",
            text4Desc: `
              Wykorzystanie popularnych hashtagów, ścieżek dźwiękowych oraz czasu publikacji są kluczowe, aby w pełni wykorzystać algorytm TikToka i dotrzeć do większej liczby osób.
            `,
            text5Title: "Analiza Danych",
            text5Desc: `
              Analizowanie statystyk oglądalności i reakcji odbiorców może pomóc twórcom lepiej zrozumieć, co przyciąga ich widzów, a także jakie formaty i tematy sprawdzają się najlepiej.
            `,
            text6Title: "Odkrywanie Nowych Trendów",
            text6Desc: `
              Algorytm TikToka stale dostosowuje się do trendów, co pozwala na szybkie odkrywanie nowości. Twórcy, którzy monitorują te zmiany, mogą korzystać z popularnych tematów, aby zwiększyć swoje zasięgi.
            `,
            text7Title: "Przyszłość Algorytmów",
            text7Desc: `
              Algorytmy rekomendacyjne będą ewoluować, a zrozumienie ich działania jest kluczem do utrzymania pozycji na platformach takich jak TikTok. Poznaj przyszłe kierunki rozwoju i dowiedz się, jak mogą wpłynąć na strategie twórców.
            `,
            googleTitle:
              "Algorytm TikToka - pełny przewodnik po strategiach dla twórców",
            googleDescription:
              "Sprawdź, jak działa algorytm TikToka i jak go wykorzystać do rozwinięcia strategii twórczej.",
            googleKeywords:
              "algorytm TikTok, strategie twórców TikTok, rozwój profilu TikTok",
            url: "algorytm-tiktoka-strategie",
            urlLabel: "Dowiedz się więcej o algorytmie TikToka",
            category: "Social Media",
            tags: "TikTok,algorytm,strategie,twórców,media społecznościowe",
          },
        ],
        properties: {
          response: {
            title: "string",
            shortDesc: "string",
            text1Title: "string",
            text1Desc: "string",
            text2Title: "string",
            text2Desc: "string",
            text3Title: "string",
            text3Desc: "string",
            text4Title: "string",
            text4Desc: "string",
            text5Title: "string",
            text5Desc: "string",
            text6Title: "string",
            text6Desc: "string",
            text7Title: "string",
            text7Desc: "string",
            googleTitle: "string",
            googleDescription: "string",
            googleKeywords: "string",
            url: "string",
            urlLabel: "string",

            category: "string",
            tags: "string",
          },
        },
        schema: {
          additionalProperties: true,
          type: "object",
          properties: {
            response: {
              type: "object",
            },
          },
          required: [
            "title",
            "shortDesc",
            "text1Title",
            "text1Desc",
            "text2Title",
            "text2Desc",
            "text3Title",
            "text3Desc",
            "text4Title",
            "text4Desc",
            "text5Title",
            "text5Desc",
            "text6Title",
            "text6Desc",
            "text7Title",
            "text7Desc",
            "googleTitle",
            "googleDescription",
            "googleKeywords",
            "url",
            "urlLabel",
            "category",
            "tags",
          ],
        },
      },
    }
  );

  // Build HTML sections on the server in a single endpoint
  async function buildSectionHTML(title: string, description: string) {
    const sec = await chat.sendMessage(
      `Generujesz sekcję na bloga, która powinna składać się z semantycznego HTML (h2/h3, p, ul/li gdzie ma sens). Zachowaj profesjonalny ton. tytuł:(${title}) opis:(${description})`,
      {
        expect: {
          examples: [
            {
              section:
                "<div><h2>Tytuł</h2><p>Wprowadzenie...</p><ul><li>Punkt</li></ul></div>",
            },
          ],
          properties: { response: { section: "string" } },
          schema: {
            additionalProperties: true,
            type: "object",
            properties: { response: { type: "object" } },
            required: ["section"],
          },
        },
      }
    );
    return sec.content as unknown as string;
  }

  const base = (response.content as unknown as Record<string, unknown>) || {};
  // Generate section HTML for 2..7 using the just-created titles/descriptions
  const sections: Record<string, { content: string; image: string }> = {};
  const pairs: Array<[number, string, string]> = [
    [2, (base.text2Title as string) || "", (base.text2Desc as string) || ""],
    [3, (base.text3Title as string) || "", (base.text3Desc as string) || ""],
    [4, (base.text4Title as string) || "", (base.text4Desc as string) || ""],
    [5, (base.text5Title as string) || "", (base.text5Desc as string) || ""],
    [6, (base.text6Title as string) || "", (base.text6Desc as string) || ""],
    [7, (base.text7Title as string) || "", (base.text7Desc as string) || ""],
  ];
  for (const [idx, t, d] of pairs) {
    if (t || d) {
      const html = await buildSectionHTML(t, d);
      sections[`section${idx}`] = { content: html, image: "" };
    }
  }

  const payload = { ...base, ...sections };
  return NextResponse.json(payload);
}
