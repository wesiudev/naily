"use client";

import { ICity } from "@/types";

interface KeywordRichContentProps {
  city: ICity;
  serviceType: "manicure" | "pedicure";
  userCount: number;
}

/**
 * Aggressive SEO Component 1: Keyword-Rich Content Section
 * Targets long-tail keywords and provides comprehensive content for search engines
 */
export default function KeywordRichContent({
  city,
  serviceType,
  userCount,
}: KeywordRichContentProps) {
  const serviceName = serviceType === "manicure" ? "manicure" : "pedicure";
  const serviceNameCapitalized =
    serviceType === "manicure" ? "Manicure" : "Pedicure";

  const keywords = [
    `${serviceName} ${city.name}`,
    `cennik ${serviceName} ${city.name}`,
    `najlepsze salony ${serviceName} ${city.name}`,
    `stylistki ${serviceName} ${city.name}`,
    `${serviceName} hybrydowy ${city.name}`,
    `rezerwacja ${serviceName} ${city.name}`,
    `salon paznokci ${city.name}`,
    `${serviceName} online ${city.name}`,
  ];

  return (
    <section className="py-4 px-2 sm:py-6 sm:px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <article className="prose prose-lg max-w-none">
          <h2 className="text-3xl sm:text-4xl font-baloo font-bold text-neutral-900 mb-4">
            Stylistki {serviceNameCapitalized} {city.name}
          </h2>

          <div className="space-y-4 text-neutral-700 font-poppins leading-relaxed">
            <p>
              Szukasz profesjonalnego <strong>{serviceName} w {city.name}</strong>? 
              Na naszej platformie znajdziesz {userCount > 0 ? `ponad ${userCount} sprawdzonych` : "najlepsze"}{" "}
              stylistek i salonów {serviceName} w {city.name}, które oferują najwyższą jakość usług. 
              <strong> Cennik {serviceName} {city.name}</strong> jest zróżnicowany i zależy od wielu czynników, 
              takich jak doświadczenie stylistki, lokalizacja salonu oraz zakres oferowanych usług.
            </p>

            <h3 className="text-2xl sm:text-3xl font-baloo font-bold text-neutral-900 mt-6 mb-3">
              Najlepsze salony {serviceName} {city.name} - Ranking 2026
            </h3>
            <p>
              W {city.name} działa wiele profesjonalnych salonów {serviceName}, które cieszą się 
              doskonałymi opiniami klientek. Nasz ranking <strong>najlepszych salonów {serviceName} {city.name}</strong> 
              został stworzony na podstawie ocen klientek, jakości wykonanych prac oraz profesjonalizmu obsługi. 
              Każdy salon w naszym katalogu przeszedł weryfikację i spełnia najwyższe standardy jakości.
            </p>

            <h3 className="text-2xl sm:text-3xl font-baloo font-bold text-neutral-900 mt-6 mb-3">
              {serviceNameCapitalized} hybrydowy {city.name} - Najpopularniejsza Usługa
            </h3>
            <p>
              <strong>{serviceNameCapitalized} hybrydowy {city.name}</strong> to obecnie najpopularniejsza 
              usługa w branży paznokciowej. Trwałość nawet do 3 tygodni, intensywne kolory i doskonała 
              odporność na uszkodzenia sprawiają, że {serviceName} hybrydowy jest wybierany przez coraz 
              więcej klientek. W {city.name} znajdziesz wielu specjalistów oferujących {serviceName} hybrydowy 
              w różnych cenach i stylach wykonania.
            </p>

            <h3 className="text-2xl sm:text-3xl font-baloo font-bold text-neutral-900 mt-6 mb-3">
              Rezerwacja {serviceName} {city.name} - Jak Umówić Wizytę?
            </h3>
            <p>
              <strong>Rezerwacja {serviceName} {city.name}</strong> jest bardzo prosta dzięki naszej platformie. 
              Wystarczy wybrać stylistkę, która Cię interesuje, sprawdzić dostępne terminy w kalendarzu 
              i zarezerwować wizytę online. Większość stylistek oferuje również możliwość rezerwacji telefonicznej. 
              Pamiętaj, że popularne stylistki mogą mieć terminy zarezerwowane na kilka tygodni do przodu, 
              dlatego warto planować wizyty z wyprzedzeniem.
            </p>

            <h3 className="text-2xl sm:text-3xl font-baloo font-bold text-neutral-900 mt-6 mb-3">
              Cennik {serviceName} {city.name} - Ile Kosztuje?
            </h3>
            <p>
              <strong>Cennik {serviceName} {city.name}</strong> jest zróżnicowany i zależy od wielu czynników. 
              Podstawowy {serviceName} klasyczny może kosztować od 60 do 120 złotych, {serviceName} hybrydowy 
              od 90 do 150 złotych, a przedłużanie paznokci od 100 do 200 złotych. Ceny mogą różnić się w zależności 
              od stylistki, lokalizacji salonu oraz zakresu oferowanych usług. Szczegółowy cennik znajdziesz 
              na profilu każdej stylistki.
            </p>
          </div>

          {/* Hidden keywords for SEO */}
          <div className="hidden" aria-hidden="true">
            {keywords.map((keyword, index) => (
              <span key={index}>{keyword}, </span>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
