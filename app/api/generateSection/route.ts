import { NextRequest, NextResponse } from "next/server";
import { createChat } from "completions";

export async function POST(req: NextRequest) {
  const data = await req.json();

  const chat = createChat({
    apiKey: process.env.OPENAI_API_KEY!,
    model: "gpt-4",
  });

  // Send a request to the chat model with detailed context and example
  const response = await chat.sendMessage(
    `Generujesz sekcję na bloga, która powinna składać się z tekstu, jeśli to możliwe użyj bulletpoints. Tekst nie powinien być krótki ani wyglądać na pisany na szybko. tytuł:(${data.title}) opis:(${data.description})`,
    {
      expect: {
        examples: [
          {
            section: `
              <div>
                <h2>Zalety manicure akrylowego</h2>
                <p>Manicure akrylowy to doskonały sposób na osiągnięcie zdrowo wyglądających i pięknych paznokci. Pozwala na zdobycie wyjątkowych i trwałych efektów, które zadowolą nawet najbardziej wymagające osoby.</p>
                <ul>
                  <li>Trwałość: Akryl jest odporny na uszkodzenia i długo zachowuje swój wygląd.</li>
                  <li>Łatwość modelowania: Możliwość dopasowania do indywidualnych potrzeb.</li>
                  <li>Estetyka: Naturalny wygląd i szeroka gama zdobień.</li>
                </ul>
                <p>Pomimo zalet manicure akrylowy wymaga profesjonalnego wykonania, aby uniknąć uszkodzenia naturalnej płytki paznokcia.</p>
              </div>
            `,
          },
        ],
        properties: {
          response: { section: "string" },
        },
        schema: {
          additionalProperties: true,
          type: "object",
          properties: {
            response: {
              type: "object",
            },
          },
          required: ["section"],
        },
      },
    }
  );

  // Extract and return the section response
  return NextResponse.json({ section: response.content });
}
