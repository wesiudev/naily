import NotFound from "@/app/not-found";
import JoinNowButton from "@/components/AdCard/JoinNowButton";
import Link from "next/link";
import { getCityUsers } from "@/utils/getCityUsers";
import { ICity } from "@/types";
import { getSingleCity } from "@/utils/getSingleCity";
import { getCities } from "@/utils/getCities";
import { Viewport } from "next";
import Image from "next/image";
import RecentPosts from "@/components/Blog/RecentPosts";
import FAQ, { type FaqItem } from "@/components/FAQ/FAQ";
import {
  FaMapMarkerAlt,
  FaGem,
  FaStar,
  FaClock,
  FaPhone,
} from "react-icons/fa";
import { MdSpa } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import slug1 from "../../../public/slug/slug1.png";
import slug2 from "../../../public/slug/slug2.png";
import slug3 from "../../../public/slug/slug3.png";
import Logic from "@/components/SearchBar/Logic";

export const dynamic = "force-dynamic";

export default async function ServiceCitySlug({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const cityParam = (await params).city;
  const city = await getSingleCity(cityParam);

  if (city?.error) {
    return <NotFound />;
  }

  // Fetch registered users matching city
  const cityUsers = await getCityUsers(city.id);

  // Add promotional AD to salons array
  const salonsWithAd = [
    {
      id: "ad",
      name: "Twój profil tutaj!",
      isAd: true,
      title: "Zarejestruj się",
      subtitle: "Miesiąc za darmo",
      description: "Wyświetlaj się wśród najlepszych w mieście",
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop&crop=center",
      features: [
        "Rezerwacje online",
        "Profesjonalny cennik",
        "Większa widoczność",
        "Nowe klientki",
        "Prowadzenie szkoleń",
        "0% prowizji",
      ],
    },
  ];

  const calculateDistanceKm = (
    latitudeA: number,
    longitudeA: number,
    latitudeB: number,
    longitudeB: number
  ): number => {
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const earthRadiusKm = 6371;
    const dLat = toRadians(latitudeB - latitudeA);
    const dLon = toRadians(longitudeB - longitudeA);
    const lat1Rad = toRadians(latitudeA);
    const lat2Rad = toRadians(latitudeB);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  };

  const allCities: ICity[] = await getCities();
  // Validate current city coords. If invalid, try to find a city with the same name that has valid coords
  const hasValidOrigin =
    typeof city.latitude === "number" &&
    typeof city.longitude === "number" &&
    city.latitude !== 0 &&
    city.longitude !== 0;
  const origin = hasValidOrigin
    ? city
    : allCities.find(
        (c) => c.name === city.name && c.latitude !== 0 && c.longitude !== 0
      ) || city;

  const nearbyCities: ICity[] = Array.isArray(allCities)
    ? allCities
        .filter(
          (c) =>
            c &&
            typeof c.latitude === "number" &&
            typeof c.longitude === "number" &&
            c.latitude !== 0 &&
            c.longitude !== 0 &&
            c.id !== origin.id
        )
        .map((c) => {
          const distance = calculateDistanceKm(
            origin.latitude,
            origin.longitude,
            c.latitude,
            c.longitude
          );
          const sameProvince =
            origin.province && c.province && origin.province === c.province
              ? 1
              : 0;
          return { city: c, distance, sameProvince };
        })
        .filter((x) => Number.isFinite(x.distance))
        .sort((a, b) => {
          if (b.sameProvince !== a.sameProvince)
            return b.sameProvince - a.sameProvince;
          return a.distance - b.distance;
        })
        .slice(0, 18)
        .map((x) => x.city)
    : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Featured Salons Section - Modern Design */}
      <section className="pb-20 px-6 bg-purple-50">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-4xl lg:text-5xl font-baloo font-bold text-black mb-4">
              Najlepszy Manicure {city.name}
            </h2>
            <p className="text-gray-500 max-w-2xl font-poppins font-normal">
              Sprawdzone miejsca z najwyższymi ocenami klientek i profesjonalną
              obsługą
            </p>
            {/* Inline search bar matching screenshot */}
            <div className="mt-6">
              <Logic slugCity={city.name} variant="inline" />
            </div>
          </div>

          {/* Results grid moved here */}
          {Array.isArray(cityUsers) && cityUsers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 mb-10">
              {cityUsers.map(
                (u: {
                  uid: string;
                  name: string;
                  logo?: string;
                  userSlugUrl?: string;
                  services?: unknown[];
                  portfolioImages?: unknown[];
                  premiumActive?: boolean;
                  seek?: boolean;
                  location?: { address?: string };
                }) => (
                  <Link
                    key={u.uid}
                    href={`/zarezerwuj/${u.userSlugUrl || u.uid}`}
                    className="group bg-white rounded-2xl border border-neutral-200 p-4 md:p-5 hover:shadow-md transition text-left"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={u.logo || "/default-user.png"}
                        alt={u.name}
                        width={72}
                        height={72}
                        className="w-16 h-16 rounded-full object-cover border"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-baloo text-lg md:text-xl font-bold text-neutral-900 group-hover:text-blue-700 truncate">
                            {u.name}
                          </h3>
                          {u?.premiumActive && (
                            <span className="inline-flex items-center rounded-full bg-yellow-100 text-yellow-800 px-2.5 py-0.5 text-[10px] md:text-xs font-poppins">
                              Premium
                            </span>
                          )}
                          {u?.seek && (
                            <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 px-2.5 py-0.5 text-[10px] md:text-xs font-poppins">
                              Przyjmuje nowe klientki
                            </span>
                          )}
                        </div>
                        <p className="text-xs md:text-sm text-neutral-600 truncate font-poppins">
                          {u.location?.address || ""}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1 font-poppins">
                          Usługi: {u?.services?.length || 0} • Zdjęcia:{" "}
                          {u?.portfolioImages?.length || 0}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>
          )}

          <div className="grid grid-cols-1 gap-8">
            {salonsWithAd.map((salon, index) => {
              // Special rendering for AD card
              if (salon.isAd) {
                return (
                  <div
                    key={salon.id}
                    className="group bg-white h-max rounded-2xl transition-all duration-300 overflow-hidden animate-fade-in-up border border-primary-200 hover:shadow-lg"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
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
                              {salon.title}
                            </h3>
                            <span className="inline-flex items-center rounded-full bg-primary-50 text-blue-700 px-3.5 py-1.5 text-xs md:text-sm font-inter font-medium">
                              {salon.subtitle}
                            </span>
                          </div>

                          {/* AD Features */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                            {salon.features?.map(
                              (feature: string, featureIndex: number) => (
                                <div
                                  key={featureIndex}
                                  className="flex items-center gap-2 text-sm text-neutral-700 font-inter font-normal leading-relaxed"
                                >
                                  <FaCheck className="text-green-500" />
                                  <span>{feature}</span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                        <div className="mt-8 md:mt-10 lg:mt-0 flex flex-col gap-3">
                          <span className="text-xs md:text-sm text-neutral-500 font-inter font-normal pr-0 md:pr-12">
                            Promocja tylko dla pierwszych 10 specjalistek w
                            Twoim mieście — zajmij miejsce zanim zniknie.
                          </span>
                          {/* CTA Button */}
                          <div>
                            <JoinNowButton />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </section>
      {/* City Overview Section - Enhanced */}
      <section className="py-20 px-6">
        <div className="container">
          <h2 className="mb-16 text-4xl lg:text-5xl font-baloo font-bold text-neutral-900 leading-tight">
            Manicure i Pedicure {city.name}
          </h2>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
            <div className="">
              <Image
                src={slug1}
                alt={`Najlepsza jakość manicure ${city.name}`}
                width={500}
                height={500}
                className="w-[350px]"
              />
              <h3 className="text-3xl font-baloo mt-8 lg:mt-12 mb-6 font-bold text-zinc-800">
                Jakość, której możesz zaufać
              </h3>
              <p className="text-neutral-600 font-poppins font-normal">
                Znajdź zaufaną stylistkę w swoim mieście i odkryj manicure,
                który podkreśli Twój charakter.
              </p>
            </div>

            <div className="">
              <Image
                src={slug2}
                alt={`Najlepsze opinie manicure ${city.name}`}
                width={500}
                height={500}
                className="w-[350px]"
              />

              <h3 className="text-3xl font-baloo mt-8 lg:mt-12 mb-6 font-bold text-zinc-800">
                Zachwycone klientki
              </h3>
              <p className="text-neutral-600 font-poppins font-normal">
                Setki pozytywnych opinii i tysiące zachwyconych dłoni. Sprawdź,
                dlaczego kobiety wybierają Naily.
              </p>
            </div>

            <div className="">
              <Image
                src={slug3}
                alt={`Rezerwuj manicure ${city.name}`}
                width={500}
                height={500}
                className="w-[350px]"
              />

              <h3 className="text-3xl font-baloo mt-8 lg:mt-12 mb-6 font-bold text-zinc-800">
                Zawsze, kiedy chcesz
              </h3>
              <p className="text-neutral-600 font-poppins font-normal">
                Zarezerwuj termin lub przyjmuj klientki wtedy, gdy to dla Ciebie
                najwygodniejsze.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Nearby Cities Section - distance based */}
      <section className="py-20 px-6 bg-white">
        <div className="container">
          <h3 className="mb-20 text-4xl lg:text-5xl font-baloo font-bold text-neutral-900">
            Szukaj też w innych miastach
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl lg:text-3xl font-baloo font-bold text-neutral-900 mb-4">
                Manicure
              </h2>
              <div className="flex flex-wrap gap-6">
                {nearbyCities.map((c) => (
                  <Link
                    key={c.id}
                    href={`/manicure/${c.id}`}
                    className="group py-3 relative w-max text-xl text-black hover:border-blue-800 hover:text-blue-800"
                  >
                    {`${c.name}`}
                    <div className="absolute bottom-0 left-0 w-full h-[4px] bg-blue-800 group-hover:h-[6px] duration-100 rounded-full"></div>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-baloo font-bold text-neutral-900 mb-4">
                Pedicure
              </h2>
              <div className="flex flex-wrap gap-6">
                {nearbyCities.map((c) => (
                  <Link
                    key={c.id}
                    href={`/pedicure/${c.id}`}
                    className="group py-3 relative w-max text-xl text-black hover:border-blue-800 hover:text-blue-800"
                  >
                    {`${c.name}`}
                    <div className="absolute bottom-0 left-0 w-full h-[4px] bg-blue-800 group-hover:h-[6px] duration-100 rounded-full"></div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Professional Salons */}
      <section className="py-12 px-6 bg-neutral-50">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-4xl lg:text-5xl font-baloo font-bold text-zinc-800 mb-4">
              Dlaczego warto?
            </h2>
            <p className="text-neutral-600 max-w-2xl font-poppins font-normal">
              Profesjonalne salony oferują najwyższą jakość usług i
              bezpieczeństwo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-16">
            <div>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaGem className="text-4xl text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold font-baloo text-2xl text-zinc-800 mb-2">
                    Certyfikowane produkty
                  </h3>
                  <p className="text-neutral-600 text-sm font-poppins font-normal">
                    Używanie tylko sprawdzonych i bezpiecznych kosmetyków
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaStar className="text-4xl text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold font-baloo text-2xl text-zinc-800 mb-2">
                    Doświadczone stylistki
                  </h3>
                  <p className="text-neutral-600 text-sm font-poppins font-normal">
                    Wykwalifikowany personel z wieloletnim doświadczeniem
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaClock className="text-4xl text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold font-baloo text-2xl text-zinc-800 mb-2">
                    Dogodne terminy
                  </h3>
                  <p className="text-neutral-600 text-sm font-poppins font-normal">
                    Elastyczne godziny otwarcia dostosowane do Twoich potrzeb
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaPhone className="text-4xl text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold font-baloo text-2xl text-zinc-800 mb-2">
                    Łatwa rezerwacja
                  </h3>
                  <p className="text-neutral-600 text-sm font-poppins font-normal">
                    Szybkie i wygodne umawianie wizyt online lub telefonicznie
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-4xl text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold font-baloo text-2xl text-zinc-800 mb-2">
                    Dogodne lokalizacje
                  </h3>
                  <p className="text-neutral-600 text-sm font-poppins font-normal">
                    Salony w centrum miasta z łatwym dojazdem komunikacją
                    miejską
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MdSpa className="text-4xl text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold font-baloo text-2xl text-zinc-800 mb-2">
                    Sterylne narzędzia
                  </h3>
                  <p className="text-neutral-600 text-sm font-poppins font-normal">
                    Dezynfekcja i sterylizacja wszystkich narzędzi po każdym
                    kliencie
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent blog posts */}
      <RecentPosts limit={3} columns={3} className="bg-white" />

      {/* City FAQ */}
      <div className="py-20">
        <FAQ className="animate-fade-in-up" items={cityFaq} />
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
    title: `Manicure ${cityData.name} - Pedicure ${cityData.name} - Salon Manicure ${cityData.name}`,
    description: `Profesjonalne salony manicure i pedicure w ${cityData.name}. Sprawdzone miejsca z najwyższymi ocenami. Rezerwuj online.`,
    publisher: "naily.pl",
    url: `https://naily.pl/manicure-pedicure/${cityData.id}`,
    authors: [
      {
        name: "Naily",
        url: "https://naily.pl",
      },
    ],
    icons: [
      {
        url: "/fav/favicon.ico",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    openGraph: {
      type: "website",
      title: `Manicure ${cityData.name} - Pedicure ${cityData.name} - Salon Manicure ${cityData.name}`,
      description: `Profesjonalne salony manicure i pedicure w ${cityData.name}. Sprawdzone miejsca z najwyższymi ocenami. Rezerwuj online.`,
      siteName: "Naily",
      images: [
        {
          url: "/pricing.png",
          type: "image/png",
        },
      ],
    },
    twitter: {
      cardType: "summary_large_image",
      site: "@Naily",
      title: `Manicure ${cityData.name} - Pedicure ${cityData.name} - Salon Manicure ${cityData.name}`,
      description: `Profesjonalne salony manicure i pedicure w ${cityData.name}. Sprawdzone miejsca z najwyższymi ocenami. Rezerwuj online.`,
      image: {
        url: "/pricing.png",
      },
    },
    meta: [
      {
        name: "theme-color",
        image: {
          url: "/pricing.png",
        },
      },
    ],
  };
}

const cityFaq: FaqItem[] = [
  {
    id: "booking-city",
    question: "Jak zarezerwować wizytę w tym mieście?",
    answer:
      "Wybierz specjalistkę z listy w Twoim mieście, sprawdź jej dostępne terminy i potwierdź rezerwację online.",
  },
  {
    id: "prices-city",
    question: "Czy ceny różnią się między specjalistkami?",
    answer:
      "Tak, ceny ustalane są indywidualnie. Aktualny cennik znajdziesz na profilu każdej specjalistki.",
  },
  {
    id: "location-city",
    question: "Jak sprawdzić lokalizację salonu?",
    answer:
      "Adres i wskazówki dojazdu są widoczne na profilu specjalistki, często z mapą i informacją o parkingu.",
  },
  {
    id: "change-city",
    question: "Czy mogę zmienić termin wizyty?",
    answer:
      "Tak, zgodnie z polityką danej specjalistki. Szczegóły znajdziesz w potwierdzeniu rezerwacji.",
  },
];
