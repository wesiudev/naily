import NotFound from "@/app/not-found";
import JoinNowButton from "@/components/AdCard/JoinNowButton";
import Link from "next/link";
import { ICity } from "@/types";
import { getSingleCity } from "@/utils/getSingleCity";
import { getCities } from "@/utils/getCities";
import { Viewport } from "next";
import Image from "next/image";
import FAQ, { type FaqItem } from "@/components/FAQ/FAQ";
import { FaCheck, FaMapMarkerAlt, FaClock, FaUser, FaCertificate } from "react-icons/fa";
import Logic from "@/components/SearchBar/Logic";
import { fetchTrainingOffersByCity } from "@/firebase";
import { TrainingOffer } from "@/types";

// Enable ISR: Revalidate every hour to keep training offers fresh while maintaining fast static pages
// Pages are generated on-demand (on first request) and then cached - no need to pre-generate all at build time
export const revalidate = 3600; // 1 hour

export default async function SzkoleniaPedicureCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const cityParam = (await params).city;
  const city = await getSingleCity(cityParam);

  if (city?.error) {
    return <NotFound />;
  }

  // Fetch training offers for this city
  const trainingOffers = await fetchTrainingOffersByCity(city.id) as TrainingOffer[];

  // Get nearby cities (excluding villages)
  const allCities: ICity[] = await getCities();
  const citiesOnly = allCities.filter((c) => c.type === "city");
  const nearbyCities = citiesOnly
    .filter((c) => c.id !== city.id)
    .slice(0, 18);

  // Add promotional AD
  const offersWithAd: (TrainingOffer | { isAd: boolean })[] = [
    ...trainingOffers,
    {
      isAd: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Featured Training Offers Section */}
      <section className="pb-20 px-6 bg-purple-50">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-4xl lg:text-5xl font-baloo font-bold text-black mb-4">
              Szkolenia z Pedicure {city.name}
            </h2>
            <p className="text-gray-500 max-w-2xl font-poppins font-normal">
              Profesjonalne szkolenia i kursy z pedicure w {city.name}. Rozwijaj swoje umiejętności pod okiem doświadczonych instruktorów.
            </p>
            <div className="mt-6">
              <Logic slugCity={city.name} variant="inline" baseRoute="szkolenia-pedicure" />
            </div>
          </div>

          {/* Training Offers List */}
          {trainingOffers.length > 0 && (
            <div className="flex flex-col gap-6 md:gap-8 mb-10">
              {trainingOffers.map((offer: TrainingOffer) => (
                <div
                  key={offer.id}
                  className="bg-white rounded-2xl p-6 md:p-8 lg:p-10 border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="md:grid md:grid-cols-12 gap-8">
                    {offer.image && (
                      <div className="relative md:col-span-4 rounded-xl overflow-hidden bg-primary-50 flex items-center justify-center min-h-[220px] md:min-h-[260px]">
                        <Image
                          src={offer.image}
                          alt={offer.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className={`${offer.image ? "md:col-span-8" : "md:col-span-12"} flex flex-col justify-between`}>
                      <div>
                        <div className="flex flex-row items-start justify-between gap-3 mb-4">
                          <h3 className="text-3xl font-baloo font-bold text-zinc-800">
                            {offer.title}
                          </h3>
                          {offer.price > 0 && (
                            <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-3.5 py-1.5 text-sm font-inter font-medium">
                              {offer.price} PLN
                            </span>
                          )}
                        </div>
                        <p className="text-neutral-700 font-poppins mb-4">
                          {offer.description}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-4">
                          {offer.duration && (
                            <div className="flex items-center gap-2 text-sm text-neutral-700 font-inter">
                              <FaClock className="text-blue-500" />
                              <span>{offer.duration} godzin</span>
                            </div>
                          )}
                          {offer.instructor && (
                            <div className="flex items-center gap-2 text-sm text-neutral-700 font-inter">
                              <FaUser className="text-blue-500" />
                              <span>{offer.instructor}</span>
                            </div>
                          )}
                          {offer.maxParticipants && (
                            <div className="flex items-center gap-2 text-sm text-neutral-700 font-inter">
                              <FaUser className="text-blue-500" />
                              <span>Max {offer.maxParticipants} uczestników</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-neutral-700 font-inter">
                            <FaMapMarkerAlt className="text-blue-500" />
                            <span>{city.name}</span>
                          </div>
                        </div>
                        {offer.whatYouWillLearn && offer.whatYouWillLearn.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-bold text-lg mb-2">Czego się nauczysz:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {offer.whatYouWillLearn.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-neutral-700">
                                  <FaCheck className="text-green-500" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {offer.requirements && offer.requirements.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-bold text-lg mb-2">Wymagania:</h4>
                            <ul className="list-disc list-inside text-sm text-neutral-700">
                              {offer.requirements.map((req, idx) => (
                                <li key={idx}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      {(offer.contactEmail || offer.contactPhone) && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <p className="text-sm text-neutral-600 mb-2">Kontakt:</p>
                          {offer.contactEmail && (
                            <a href={`mailto:${offer.contactEmail}`} className="text-blue-600 hover:underline">
                              {offer.contactEmail}
                            </a>
                          )}
                          {offer.contactPhone && (
                            <a href={`tel:${offer.contactPhone}`} className="text-blue-600 hover:underline ml-4">
                              {offer.contactPhone}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Promotion AD Card */}
          <div className="grid grid-cols-1 gap-8">
            <div className="group bg-white h-max rounded-2xl transition-all duration-300 overflow-hidden animate-fade-in-up border border-primary-200 hover:shadow-lg">
              <div className="md:grid md:grid-cols-12 gap-8 p-6 md:p-8 lg:p-10">
                {/* AD Image */}
                <div className="relative md:col-span-4 rounded-xl overflow-hidden bg-primary-50 flex items-center justify-center min-h-[220px] md:min-h-[260px] lg:min-h-[300px]">
                  <Image
                    src="/naily-logo2.png"
                    alt="Naily Logo"
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-contain p-10 md:p-4 lg:p-12"
                  />
                </div>

                {/* AD Content */}
                <div className="md:col-span-8 flex flex-col justify-between h-full">
                  <div className="flex flex-col gap-4">
                    <div className="mt-4 md:mt-0 mb-2 md:mb-4 flex flex-row items-start justify-between gap-3">
                      <h3 className="text-3xl font-baloo font-bold text-zinc-800 transition-colors">
                        Prowadź szkolenia z Naily
                      </h3>
                      <span className="inline-flex items-center rounded-full bg-primary-50 text-blue-700 px-3.5 py-1.5 text-xs md:text-sm font-inter font-medium">
                        Miesiąc za darmo
                      </span>
                    </div>

                    {/* AD Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                      {[
                        "Rezerwacje online",
                        "Profesjonalny cennik",
                        "Większa widoczność",
                        "Prowadzenie szkoleń",
                        "Zarządzanie uczestnikami",
                        "0% prowizji",
                      ].map((feature: string, featureIndex: number) => (
                        <div
                          key={featureIndex}
                          className="flex items-center gap-2 text-sm text-neutral-700 font-inter font-normal leading-relaxed"
                        >
                          <FaCheck className="text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8 md:mt-10 lg:mt-0 flex flex-col gap-3">
                    <span className="text-xs md:text-sm text-neutral-500 font-inter font-normal pr-0 md:pr-12">
                      Promocja tylko dla pierwszych 10 instruktorów w Twoim mieście — zajmij miejsce zanim zniknie.
                    </span>
                    <div>
                      <JoinNowButton />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Cities Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container">
          <h3 className="mb-20 text-4xl lg:text-5xl font-baloo font-bold text-neutral-900">
            Szukaj też w innych miastach
          </h3>
          <div className="flex flex-wrap gap-6">
            {nearbyCities.map((c) => (
              <Link
                key={c.id}
                href={`/szkolenia-pedicure/${c.id}`}
                className="group py-3 relative w-max text-xl text-black hover:border-blue-800 hover:text-blue-800"
              >
                {`Szkolenia ${c.name}`}
                <div className="absolute bottom-0 left-0 w-full h-[4px] bg-blue-800 group-hover:h-[6px] duration-100 rounded-full"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <div className="py-20">
        <FAQ className="animate-fade-in-up" items={szkoleniaFaq} />
      </div>
    </div>
  );
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1e40af",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const cityData: ICity = await getSingleCity(city);
  return {
    title: `Szkolenia z Pedicure ${cityData.name} - Profesjonalne Kursy`,
    description: `Znajdź najlepsze szkolenia z pedicure w ${cityData.name}. Profesjonalne kursy, certyfikaty i rozwój umiejętności.`,
    openGraph: {
      type: "website",
      title: `Szkolenia z Pedicure ${cityData.name} - Profesjonalne Kursy`,
      description: `Znajdź najlepsze szkolenia z pedicure w ${cityData.name}. Profesjonalne kursy, certyfikaty i rozwój umiejętności.`,
      siteName: "Naily",
    },
  };
}

const szkoleniaFaq: FaqItem[] = [
  {
    id: "szkolenia-booking",
    question: "Jak zapisać się na szkolenie?",
    answer:
      "Skontaktuj się bezpośrednio z instruktorem poprzez podany kontakt email lub telefon. Większość szkoleń wymaga wcześniejszej rezerwacji.",
  },
  {
    id: "szkolenia-price",
    question: "Ile kosztują szkolenia?",
    answer:
      "Ceny szkoleń różnią się w zależności od instruktora, długości kursu i zakresu materiału. Szczegóły znajdziesz w opisie każdego szkolenia.",
  },
  {
    id: "szkolenia-certificate",
    question: "Czy otrzymam certyfikat po szkoleniu?",
    answer:
      "Większość profesjonalnych szkoleń kończy się wydaniem certyfikatu. Szczegóły dotyczące certyfikacji znajdziesz w opisie szkolenia.",
  },
  {
    id: "szkolenia-level",
    question: "Jakie są wymagania wstępne?",
    answer:
      "Wymagania różnią się w zależności od poziomu szkolenia. Niektóre kursy są dla początkujących, inne wymagają już pewnego doświadczenia. Sprawdź sekcję 'Wymagania' w opisie szkolenia.",
  },
];




