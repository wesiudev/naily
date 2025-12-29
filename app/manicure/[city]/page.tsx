import NotFound from "@/app/not-found";
import JoinNowButton from "@/components/AdCard/JoinNowButton";
import Link from "next/link";
import { getCityUsers } from "@/utils/getCityUsers";
import { getUsers as getAllUsers } from "@/utils/getUsers";
import { ICity } from "@/types";
import { getSingleCity } from "@/utils/getSingleCity";
import { getCities } from "@/utils/getCities";
import { Viewport } from "next";
import Image from "next/image";
import Script from "next/script";
import RecentPosts from "@/components/Blog/RecentPosts";
import FAQ, { type FaqItem } from "@/components/FAQ/FAQ";
import {
  FaMapMarkerAlt,
  FaGem,
  FaStar,
  FaClock,
  FaPhone,
  FaArrowRight,
} from "react-icons/fa";
import { MdSpa } from "react-icons/md";
import { FaCheck, FaUserNinja } from "react-icons/fa6";
import { IService } from "@/types";
import slug1 from "../../../public/slug/slug1.png";
import slug2 from "../../../public/slug/slug2.png";
import slug3 from "../../../public/slug/slug3.png";
import Logic from "@/components/SearchBar/Logic";
import UserSliderWrapper from "@/components/CityPage/UserSliderWrapper";
import UserCard from "@/components/CityPage/UserCard";
import { getUserById, getUsers, db } from "@/firebase";
import { User } from "@/types";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Metadata } from "next";

// Enable ISR: Revalidate every hour to keep salon listings fresh while maintaining fast static pages
// Pages are generated on-demand (on first request) and then cached - no need to pre-generate all at build time
export const revalidate = 3600; // 1 hour

// Generate JSON-LD structured data for SEO
function generateStructuredData(city: ICity, serviceType: "manicure" | "pedicure") {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://naily.pl";
  const serviceName = serviceType === "manicure" ? "Manicure" : "Pedicure";
  
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${baseUrl}/${serviceType}/${city.id}#webpage`,
        "url": `${baseUrl}/${serviceType}/${city.id}`,
        "name": `TOP 10 MANICURE ${city.name} - Cennik Katalog`,
        "description": `TOP 10 najlepszych stylistek i salonów ${serviceType} ${city.name}. Pełny cennik, katalog usług i opinie.`,
        "inLanguage": "pl-PL",
        "isPartOf": {
          "@id": `${baseUrl}#website`
        },
        "breadcrumb": {
          "@id": `${baseUrl}/${serviceType}/${city.id}#breadcrumb`
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/${serviceType}/${city.id}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Strona główna",
            "item": baseUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": `${serviceName} ${city.name}`,
            "item": `${baseUrl}/${serviceType}/${city.id}`
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}/${serviceType}/${city.id}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Jak zarezerwować wizytę w tym mieście?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Rezerwacja wizyty na manicure w naszym mieście jest bardzo prosta. Najpierw przejrzyj listę dostępnych specjalistek i salonów na tej stronie. Każdy profil zawiera szczegółowe informacje o stylistce, jej doświadczeniu, portfolio prac oraz dostępnych terminach. Możesz zarezerwować wizytę bezpośrednio przez platformę online, wybierając dogodny dla Ciebie termin z kalendarza dostępności. Po wyborze terminu otrzymasz potwierdzenie rezerwacji na podany adres email lub numer telefonu. Większość specjalistek oferuje również możliwość rezerwacji telefonicznej lub przez wiadomość prywatną. Pamiętaj, że niektóre popularne stylistki mogą mieć dłuższe terminy oczekiwania, dlatego warto rezerwować z wyprzedzeniem. Szczególnie w sezonie letnim i przed ważnymi wydarzeniami, gdy zapotrzebowanie na usługi manicure jest większe, warto planować wizyty z kilkutygodniowym wyprzedzeniem."
            }
          },
          {
            "@type": "Question",
            "name": "Czy ceny różnią się między specjalistkami?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Tak, ceny usług manicure różnią się między specjalistkami i zależą od wielu czynników. Każda stylistka ustala własny cennik, który może być uzależniony od jej doświadczenia, lokalizacji salonu, używanego sprzętu i produktów, a także zakresu oferowanych usług. Podstawowy manicure klasyczny może kosztować od 40 do 80 złotych, manicure hybrydowy od 60 do 120 złotych, a przedłużanie paznokci od 100 do 200 złotych. Ceny mogą również różnić się w zależności od tego, czy wybierasz usługę w salonie czy wizyta odbywa się w domu klientki. Aktualny, szczegółowy cennik znajdziesz na profilu każdej specjalistki, gdzie często dostępne są również informacje o pakietach promocyjnych, zniżkach dla stałych klientek oraz cenach dodatkowych usług takich jak zdobienia czy przedłużanie paznokci."
            }
          },
          {
            "@type": "Question",
            "name": "Jak sprawdzić lokalizację salonu?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Lokalizacja każdego salonu i stylistki jest szczegółowo opisana na jej profilu. Znajdziesz tam pełny adres wraz z kodem pocztowym, a także interaktywną mapę Google Maps, która ułatwi Ci dotarcie na miejsce. Większość profili zawiera również informacje o dostępności komunikacji miejskiej, możliwości parkowania w pobliżu salonu oraz wskazówki dojazdu dla klientek przyjeżdżających samochodem. Niektóre stylistki oferują również usługi mobilne, przyjeżdżając do klientek do domu, co jest szczególnie wygodne w przypadku zabiegów manicure. Jeśli masz pytania dotyczące lokalizacji lub potrzebujesz dodatkowych wskazówek dojazdu, możesz skontaktować się bezpośrednio ze stylistką przez telefon lub wiadomość prywatną. Warto sprawdzić lokalizację przed rezerwacją, aby upewnić się, że salon jest dla Ciebie dogodnie położony i łatwo dostępny."
            }
          },
          {
            "@type": "Question",
            "name": "Czy mogę zmienić termin wizyty?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Tak, w większości przypadków możesz zmienić termin wizyty, jednak zasady dotyczące zmian i odwołań różnią się w zależności od polityki danej specjalistki. Szczegółowe informacje o możliwości zmiany terminu, wymaganym czasie wyprzedzenia oraz ewentualnych opłatach za odwołanie znajdziesz w potwierdzeniu rezerwacji oraz na profilu stylistki. Zazwyczaj zmiana terminu jest możliwa bez dodatkowych opłat, jeśli poinformujesz stylistkę z odpowiednim wyprzedzeniem (zwykle minimum 24-48 godzin przed wizytą). Odwołanie wizyty w ostatniej chwili może wiązać się z koniecznością uiszczenia częściowej opłaty lub pełnej kwoty za usługę, zgodnie z polityką salonu. W przypadku nagłych sytuacji losowych, większość stylistek jest elastyczna i stara się znaleźć rozwiązanie korzystne dla obu stron. Najlepiej skontaktować się bezpośrednio ze stylistką, aby omówić możliwość zmiany terminu. Pamiętaj, że wczesne poinformowanie o potrzebie zmiany terminu zwiększa szanse na znalezienie dogodnego rozwiązania."
            }
          }
        ]
      },
      {
        "@type": "ItemList",
        "@id": `${baseUrl}/${serviceType}/${city.id}#itemlist`,
        "name": `TOP 10 MANICURE ${city.name} - Cennik Katalog`,
        "description": `Lista najlepszych stylistek i salonów ${serviceType} w ${city.name}`,
        "numberOfItems": 10,
        "itemListElement": {
          "@type": "ListItem",
          "position": 1,
          "name": `Najlepsze salony ${serviceName} w ${city.name}`
        }
      }
    ]
  };
}

async function fetchUserBySlugOrUid(slug: string): Promise<User | null> {
  try {
    const all = (await getUsers()) as User[];
    const bySlug = all.find(
      (u) => (u as User & { userSlugUrl?: string })?.userSlugUrl === slug
    );
    if (bySlug) return bySlug as User;
    // fallback to uid
    const byUid = (await getUserById(slug)) as User | null;
    return byUid || null;
  } catch {
    return null;
  }
}

const preVisitFaq: FaqItem[] = [
  {
    id: "prep-before-visit",
    question: "Jak przygotować się do wizyty na manicure?",
    answer:
      "Przed wizytą na manicure warto usunąć stary lakier z paznokci, jeśli masz. Nie musisz obcinać paznokci - stylistka zrobi to za Ciebie. Jeśli masz jakiekolwiek problemy skórne wokół paznokci, poinformuj o tym stylistkę przed rozpoczęciem zabiegu. Warto również przemyśleć, jaki kolor lub styl paznokci Cię interesuje - możesz przynieść zdjęcia inspiracji. Pamiętaj, aby przyjść na wizytę z czystymi dłońmi.",
  },
  {
    id: "how-long-manicure",
    question: "Ile trwa wizyta na manicure?",
    answer:
      "Czas trwania wizyty zależy od wybranego typu manicure. Podstawowy manicure klasyczny trwa zazwyczaj około 30-45 minut, manicure hybrydowy około 60-90 minut, a przedłużanie paznokci może zająć nawet 2-3 godziny. Czas może się również różnić w zależności od stylistki i zakresu usługi. Warto zarezerwować sobie odpowiednią ilość czasu i nie planować innych pilnych spraw zaraz po wizycie.",
  },
  {
    id: "what-to-bring",
    question: "Czy muszę coś przynieść na wizytę?",
    answer:
      "Nie musisz przynosić niczego specjalnego na wizytę - stylistka ma wszystkie niezbędne narzędzia i produkty. Możesz jednak przynieść zdjęcia inspiracji, jeśli masz konkretny pomysł na wygląd paznokci. Jeśli masz własne lakiery, które chcesz użyć, możesz je przynieść, ale większość salonów ma szeroki wybór kolorów. Pamiętaj tylko o zabraniu ze sobą środków płatniczych lub możliwości płatności online.",
  },
  {
    id: "hybrid-duration",
    question: "Jak długo utrzymuje się manicure hybrydowy?",
    answer:
      "Manicure hybrydowy utrzymuje się zazwyczaj od 2 do 3 tygodni, w zależności od tempa wzrostu paznokci i sposobu pielęgnacji. Aby przedłużyć trwałość manicure hybrydowego, unikaj agresywnych środków chemicznych, używaj rękawiczek podczas prac domowych i regularnie nawilżaj dłonie i skórki. Jeśli zauważysz odklejanie się lakieru lub pękanie, skontaktuj się ze stylistką w celu korekty.",
  },
  {
    id: "first-time-visit",
    question: "Czy muszę umawiać się z wyprzedzeniem?",
    answer:
      "Zdecydowanie tak - umawianie się z wyprzedzeniem jest bardzo ważne, szczególnie jeśli chcesz wizytę u konkretnej stylistki lub w określonym terminie. Popularne stylistki mogą mieć terminy zarezerwowane nawet na kilka tygodni do przodu. Rezerwacja z wyprzedzeniem daje Ci również możliwość wyboru najlepszego dla Ciebie terminu i zapewnia, że stylistka będzie miała czas na wykonanie usługi zgodnie z Twoimi oczekiwaniami.",
  },
];

export default async function ServiceCitySlug({
  params,
  searchParams,
}: {
  params: Promise<{ city: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cityParam = (await params).city;
  const city = await getSingleCity(cityParam);

  if (city?.error) {
    return <NotFound />;
  }

  // Fetch registered users matching city
  const cityUsers = await getCityUsers(city.id);
  
  // Fetch users without a city (empty location address)
  const allUsers = await getAllUsers() as User[];
  const usersWithoutCity = allUsers.filter((user: User) => {
    const isConfigured = Boolean(user?.configured);
    const isPublic = Boolean(user?.settings?.publicProfile ?? true);
    const hasNoCity = !user?.location?.address || user.location.address.trim() === "";
    return hasNoCity && isConfigured && isPublic;
  });
  
  // Merge city users with users without city, assigning city name to users without city
  const mergedUsers = [
    ...cityUsers,
    ...usersWithoutCity.map((user: User) => ({
      ...user,
      location: {
        ...user.location,
        address: city.name, // Assign city name from slug
      },
    })),
  ];
  
  // Sort merged users by priorityLevel, then by name
  const sortedMergedUsers = mergedUsers.sort((a: User, b: User) => {
    const priorityA = a.priorityLevel ?? 0;
    const priorityB = b.priorityLevel ?? 0;
    if (priorityB !== priorityA) {
      return priorityB - priorityA; // Higher priority first
    }
    return (a.name || "").localeCompare(b.name || "");
  });

  // Pre-load user data if query parameter is present
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const userSlug = resolvedSearchParams.user as string | undefined;
  let preloadedUser: User | null = null;
  let preloadedPortfolio: Array<{ id: string; url?: string; title?: string }> = [];

  if (userSlug) {
    preloadedUser = await fetchUserBySlugOrUid(userSlug);
    if (preloadedUser?.uid) {
      try {
        const colRef = collection(db, "users", preloadedUser.uid, "portfolio");
        const q = query(colRef, orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        preloadedPortfolio = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
      } catch (_) {
        preloadedPortfolio = [];
      }
    }
  }

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

  // Generate structured data for SEO
  const structuredData = generateStructuredData(city, "manicure");

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD Structured Data for SEO */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Featured Salons Section - Modern Design */}
      <section className="pb-20 px-6 bg-purple-50">
        <div className="container">
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-baloo font-bold text-black mb-4">
              TOP 10 MANICURE {city.name} - Cennik Katalog na 2026 rok
            </h1>
            <p className="text-gray-500 max-w-2xl font-poppins font-normal">
              Sprawdzone miejsca z najwyższymi ocenami klientek i profesjonalnym manicure. Sprawdź przewidywane ceny i katalog stylistek manicure w swoim mieście.
            </p>
            {/* Inline search bar matching screenshot */}
            <div className="mt-6">
              <Logic slugCity={city.name} variant="inline" />
            </div>
            <p className="text-gray-500 font-poppins text-sm mt-3">Ostatnia aktualizacja: 06.12.2025</p>
          </div>

          {/* Results responsive grid cards */}
          {Array.isArray(sortedMergedUsers) && sortedMergedUsers.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 mb-10">
              {sortedMergedUsers.map(
                (u: {
                  uid: string;
                  name: string;
                  logo?: string;
                  userSlugUrl?: string;
                  services?: IService[];
                  portfolioImages?: unknown[];
                  portfolio?: Array<{ url?: string; id?: string; [key: string]: unknown }>;
                  premiumActive?: boolean;
                  seek?: boolean;
                  location?: { address?: string };
                  phoneNumber?: string;
                  description?: string;
                }) => {
                  const isIndividualSpecialist = u.seek === true;
                  const isSalon = u.seek === false;
                  // Get portfolio images from either portfolioImages or portfolio field
                  // portfolioImages uses {src: string}, portfolio uses {url: string}
                  const getPortfolioImages = () => {
                    if (u.portfolioImages && Array.isArray(u.portfolioImages) && u.portfolioImages.length > 0) {
                      return u.portfolioImages.map((img: any) => ({ src: img.src || img.url }));
                    }
                    if (u.portfolio && Array.isArray(u.portfolio) && u.portfolio.length > 0) {
                      return u.portfolio.map((item: any) => ({ src: item.url || item.src }));
                    }
                    return [];
                  };
                  return (
                    <UserCard key={u.uid} user={u} cityParam={cityParam} />
                  );
                }
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

      {/* Manicure Hybrydowy Section */}
      {Array.isArray(sortedMergedUsers) && sortedMergedUsers.length > 0 && (
        <section className="py-20 px-6 bg-white">
          <div className="container">
            <h2 className="mb-12 text-3xl lg:text-4xl font-baloo font-bold text-neutral-900">
              Manicure hybrydowy {city.name} – sprawdzone stylistki w 2026 roku
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8">
              {sortedMergedUsers.slice(0, 3).map((u: {
                uid: string;
                name: string;
                logo?: string;
                userSlugUrl?: string;
                services?: IService[];
                portfolioImages?: unknown[];
                portfolio?: Array<{ url?: string; id?: string; [key: string]: unknown }>;
                premiumActive?: boolean;
                seek?: boolean;
                location?: { address?: string };
                phoneNumber?: string;
                description?: string;
              }) => (
                <UserCard key={u.uid} user={u} cityParam={cityParam} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Najlepsze Stylistki Section */}
      {Array.isArray(sortedMergedUsers) && sortedMergedUsers.length > 3 && (
        <section className="py-20 px-6 bg-neutral-50">
          <div className="container">
            <h2 className="mb-12 text-3xl lg:text-4xl font-baloo font-bold text-neutral-900">
              Paznokcie hybrydowe {city.name}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8">
              {sortedMergedUsers.slice(3, 6).map((u: {
                uid: string;
                name: string;
                logo?: string;
                userSlugUrl?: string;
                services?: IService[];
                portfolioImages?: unknown[];
                portfolio?: Array<{ url?: string; id?: string; [key: string]: unknown }>;
                premiumActive?: boolean;
                seek?: boolean;
                location?: { address?: string };
                phoneNumber?: string;
                description?: string;
              }) => (
                <UserCard key={u.uid} user={u} cityParam={cityParam} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ceny Manicure Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container">
          <h2 className="mb-12 text-3xl lg:text-4xl font-baloo font-bold text-neutral-900">
            Ceny manicure {city.name} w 2026
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 border border-purple-200">
              <h3 className="text-2xl font-baloo font-bold text-purple-900 mb-4">
                Manicure klasyczny
              </h3>
              <div className="text-4xl font-bold text-purple-700 mb-2">
                od 70 zł
              </div>
              <p className="text-neutral-600 font-poppins text-sm">
                Podstawowy manicure z lakierem klasycznym, pielęgnacją skórek i kształtowaniem paznokci.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200">
              <h3 className="text-2xl font-baloo font-bold text-blue-900 mb-4">
                Manicure hybrydowy
              </h3>
              <div className="text-4xl font-bold text-blue-700 mb-2">
                od 80 zł
              </div>
              <p className="text-neutral-600 font-poppins text-sm">
                Trwały manicure hybrydowy z lakierem UV/LED, utrzymujący się nawet do 3 tygodni.
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-8 border border-pink-200">
              <h3 className="text-2xl font-baloo font-bold text-pink-900 mb-4">
                Przedłużanie paznokci
              </h3>
              <div className="text-4xl font-bold text-pink-700 mb-2">
                od 120 zł
              </div>
              <p className="text-neutral-600 font-poppins text-sm">
                Przedłużanie paznokci metodą żelową lub akrylową z możliwością zdobień.
              </p>
            </div>
          </div>
          <p className="mt-6 text-neutral-600 font-poppins text-sm text-center">
            * Ceny mogą się różnić w zależności od stylistki, lokalizacji i zakresu usługi. Aktualny cennik znajdziesz na profilu każdej specjalistki.
          </p>
        </div>
      </section>

      {/* Najczęstsze Pytania Section */}
      <section className="py-20 px-6 bg-neutral-50">
        <div className="container">
          <h2 className="mb-12 text-3xl lg:text-4xl font-baloo font-bold text-neutral-900">
            Najczęstsze pytania przed wizytą
          </h2>
          <FAQ className="animate-fade-in-up" items={preVisitFaq} />
        </div>
      </section>

      {/* City Overview Section - Enhanced */}
      <section className="py-20 px-6">
        <div className="container">
          <h2 className="mb-16 text-4xl lg:text-5xl font-baloo font-bold text-neutral-900 leading-tight">
            Manicure {city.name} - Przegląd cen w 2026
          </h2>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
            <div className="">
              <Image
                src={slug1}
                alt={`Najlepsza jakość manicure ${city.name} - Profesjonalne usługi paznokci`}
                width={500}
                height={500}
                className="w-[350px]"
                loading="lazy"
                fetchPriority="low"
              />
              <h3 className="text-3xl font-baloo mt-8 lg:mt-12 mb-6 font-bold text-zinc-800">
                Stylistki paznokci w Twojej lokalizacji
              </h3>
              <p className="text-neutral-600 font-poppins font-normal">
                Twoja stylistka paznokci {city.name} - wypróbuj manicure,
                który podkreśli Twój charakter.
              </p>
            </div>

            <div className="">
              <Image
                src={slug2}
                alt={`Najlepsze opinie manicure ${city.name} - Zadowolone klientki na 2026 rok`}
                width={500}
                height={500}
                className="w-[350px]"
                loading="lazy"
                fetchPriority="low"
              />

              <h3 className="text-3xl font-baloo mt-8 lg:mt-12 mb-6 font-bold text-zinc-800">
                Perfekcyjne stylizacje paznokci
              </h3>
              <p className="text-neutral-600 font-poppins font-normal">
                Setki pozytywnych opinii i tysiące zachwyconych dłoni. Sprawdź,
                dlaczego kobiety wybierają Naily.
              </p>
            </div>

            <div className="">
              <Image
                src={slug3}
                alt={`Rezerwuj manicure ${city.name} - Umów wizytę online`}
                width={500}
                height={500}
                className="w-[350px]"
                loading="lazy"
                fetchPriority="low"
              />

              <h3 className="text-3xl font-baloo mt-8 lg:mt-12 mb-6 font-bold text-zinc-800">
                Rezerwuj manicure, kiedy chcesz
              </h3>
              <p className="text-neutral-600 font-poppins font-normal">
                Zarezerwuj termin lub przyjmuj klientki wtedy, gdy to dla Ciebie
                najwygodniejsze.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Szkolenia & Kariera Section */}
      <section className="py-12 px-6 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Szkolenia Card */}
            <Link
              href={`/szkolenia-manicure/${city.id}`}
              className="group bg-white rounded-xl p-8 lg:p-10 hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300"
            >
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                    <FaGem className="text-2xl text-purple-700" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-baloo font-bold text-zinc-800 mb-3 group-hover:text-blue-600 transition-colors">
                    Szkolenia Manicure {city.name}
                  </h3>
                  <p className="text-neutral-600 text-base font-poppins leading-relaxed">
                    Znajdź najlepsze szkolenia z manicure w {city.name}. Profesjonalne kursy, certyfikaty i rozwój umiejętności.
                  </p>
                </div>
                <div className="mt-auto pt-4">
                  <span className="inline-flex items-center gap-2 text-blue-600 font-semibold font-poppins group-hover:gap-3 transition-all">
                    Instruktorki manicure {city.name}
                    <FaArrowRight className="text-sm" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Kariera Card */}
            <Link
              href={`/kariera/${city.id}`}
              className="group bg-white rounded-xl p-8 lg:p-10 hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300"
            >
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <FaStar className="text-2xl text-blue-700" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-baloo font-bold text-zinc-800 mb-3 group-hover:text-blue-600 transition-colors">
                    Pracuj w Salonie Manicure {city.name}
                  </h3>
                  <p className="text-neutral-600 text-base font-poppins leading-relaxed">
                    Znajdź najlepsze oferty pracy w {city.name}. Profesjonalne kariery i rozwój umiejętności w branży beauty.
                  </p>
                </div>
                <div className="mt-auto pt-4">
                  <span className="inline-flex items-center gap-2 text-blue-600 font-semibold font-poppins group-hover:gap-3 transition-all">
                    Zobacz oferty pracy
                    <FaArrowRight className="text-sm" />
                  </span>
                </div>
              </div>
            </Link>
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

      {/* User Slider Wrapper */}
      <UserSliderWrapper
        cityUsers={sortedMergedUsers || []}
        preloadedUser={preloadedUser}
        preloadedPortfolio={preloadedPortfolio}
        initialUserSlug={userSlug || null}
      />
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
}): Promise<Metadata> {
  const { city } = await params;
  const cityData: ICity = await getSingleCity(city);
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://naily.pl";
  const canonicalUrl = `${baseUrl}/manicure/${cityData.id}`;
  const title = `TOP 10 MANICURE ${cityData.name} 2026 - Cennik Katalog Opinie`;
  const description = `TOP 10 najlepszych stylistek i salonów manicure ${cityData.name} na 2026 rok. Pełny cennik, katalog usług i opinie. Sprawdzone miejsca z najwyższymi ocenami. Rezerwuj online.`;
  const keywords = `manicure ${cityData.name}, cennik manicure ${cityData.name}, najlepsze salony paznokci ${cityData.name}, stylistki paznokci ${cityData.name}, manicure hybrydowy ${cityData.name}, pedicure ${cityData.name}`;
  
  return {
    title: title,
    description: description,
    keywords: keywords,
    authors: [
      {
        name: "Naily",
        url: "https://naily.pl",
      },
    ],
    publisher: "naily.pl",
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: [
      {
        url: "/fav/favicon.ico",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    openGraph: {
      type: "website",
      title: title,
      description: description,
      siteName: "Naily",
      url: canonicalUrl,
      locale: "pl_PL",
      images: [
        {
          url: `${baseUrl}/pricing.png`,
          width: 1200,
          height: 630,
          alt: `TOP 10 MANICURE ${cityData.name} - Cennik Katalog`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Naily",
      title: title,
      description: description,
      images: [
        {
          url: `${baseUrl}/pricing.png`,
          alt: `TOP 10 MANICURE ${cityData.name} - Cennik Katalog`,
        },
      ],
    },
    other: {
      "theme-color": "#1e40af",
    },
  };
}

const cityFaq: FaqItem[] = [
  {
    id: "booking-city",
    question: "Jak zarezerwować wizytę w tym mieście?",
    answer:
      "Rezerwacja wizyty na manicure w naszym mieście jest bardzo prosta. Najpierw przejrzyj listę dostępnych specjalistek i salonów na tej stronie. Każdy profil zawiera szczegółowe informacje o stylistce, jej doświadczeniu, portfolio prac oraz dostępnych terminach. Możesz zarezerwować wizytę bezpośrednio przez platformę online, wybierając dogodny dla Ciebie termin z kalendarza dostępności. Po wyborze terminu otrzymasz potwierdzenie rezerwacji na podany adres email lub numer telefonu. Większość specjalistek oferuje również możliwość rezerwacji telefonicznej lub przez wiadomość prywatną. Pamiętaj, że niektóre popularne stylistki mogą mieć dłuższe terminy oczekiwania, dlatego warto rezerwować z wyprzedzeniem.",
  },
  {
    id: "prices-city",
    question: "Czy ceny różnią się między specjalistkami?",
    answer:
      "Tak, ceny usług manicure różnią się między specjalistkami i zależą od wielu czynników. Każda stylistka ustala własny cennik, który może być uzależniony od jej doświadczenia, lokalizacji salonu, używanego sprzętu i produktów, a także zakresu oferowanych usług. Podstawowy manicure klasyczny może kosztować od 40 do 80 złotych, manicure hybrydowy od 60 do 120 złotych, a przedłużanie paznokci od 100 do 200 złotych. Ceny mogą również różnić się w zależności od tego, czy wybierasz usługę w salonie czy wizyta odbywa się w domu klientki. Aktualny, szczegółowy cennik znajdziesz na profilu każdej specjalistki, gdzie często dostępne są również informacje o pakietach promocyjnych, zniżkach dla stałych klientek oraz cenach dodatkowych usług takich jak zdobienia czy przedłużanie paznokci.",
  },
  {
    id: "location-city",
    question: "Jak sprawdzić lokalizację salonu?",
    answer:
      "Lokalizacja każdego salonu i stylistki jest szczegółowo opisana na jej profilu. Znajdziesz tam pełny adres wraz z kodem pocztowym, a także interaktywną mapę Google Maps, która ułatwi Ci dotarcie na miejsce. Większość profili zawiera również informacje o dostępności komunikacji miejskiej, możliwości parkowania w pobliżu salonu oraz wskazówki dojazdu dla klientek przyjeżdżających samochodem. Niektóre stylistki oferują również usługi mobilne, przyjeżdżając do klientek do domu. Jeśli masz pytania dotyczące lokalizacji lub potrzebujesz dodatkowych wskazówek dojazdu, możesz skontaktować się bezpośrednio ze stylistką przez telefon lub wiadomość prywatną. Warto sprawdzić lokalizację przed rezerwacją, aby upewnić się, że salon jest dla Ciebie dogodnie położony.",
  },
  {
    id: "change-city",
    question: "Czy mogę zmienić termin wizyty?",
    answer:
      "Tak, w większości przypadków możesz zmienić termin wizyty, jednak zasady dotyczące zmian i odwołań różnią się w zależności od polityki danej specjalistki. Szczegółowe informacje o możliwości zmiany terminu, wymaganym czasie wyprzedzenia oraz ewentualnych opłatach za odwołanie znajdziesz w potwierdzeniu rezerwacji oraz na profilu stylistki. Zazwyczaj zmiana terminu jest możliwa bez dodatkowych opłat, jeśli poinformujesz stylistkę z odpowiednim wyprzedzeniem (zwykle minimum 24-48 godzin przed wizytą). Odwołanie wizyty w ostatniej chwili może wiązać się z koniecznością uiszczenia częściowej opłaty lub pełnej kwoty za usługę, zgodnie z polityką salonu. W przypadku nagłych sytuacji losowych, większość stylistek jest elastyczna i stara się znaleźć rozwiązanie korzystne dla obu stron. Najlepiej skontaktować się bezpośrednio ze stylistką, aby omówić możliwość zmiany terminu.",
  },
];
