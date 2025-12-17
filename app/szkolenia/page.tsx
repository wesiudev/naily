import { Metadata, Viewport } from "next";
import Link from "next/link";
import { getCities } from "@/utils/getCities";
import { ICity } from "@/types";
import Logic from "@/components/SearchBar/Logic";

export const dynamic = "force-dynamic";

export default async function SzkoleniaPage() {
  // Get cities excluding villages
  const allCities = await getCities();
  const cities = allCities.filter((city: ICity) => city.type === "city");

  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 px-6 bg-purple-50">
        <div className="container">
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-baloo font-bold text-black mb-4">
              Szkolenia z Manicure
            </h1>
            <p className="text-gray-500 max-w-2xl font-poppins font-normal text-lg mb-6">
              Znajdź profesjonalne szkolenia z manicure w Twoim mieście. Rozwijaj swoje umiejętności i zdobądź certyfikaty.
            </p>
            <div className="mt-6">
              <Logic slugCity="" variant="inline" baseRoute="szkolenia-manicure" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {cities.slice(0, 30).map((city: ICity) => (
              <Link
                key={city.id}
                href={`/szkolenia-manicure/${city.id}`}
                className="group bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200"
              >
                <h3 className="text-xl font-baloo font-bold text-zinc-800 mb-2 group-hover:text-blue-600 transition-colors">
                  Szkolenia {city.name}
                </h3>
                <p className="text-neutral-600 text-sm font-poppins">
                  Sprawdź dostępne szkolenia w {city.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
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

export const metadata: Metadata = {
  title: "Szkolenia z Manicure - Profesjonalne Kursy i Warsztaty",
  description: "Znajdź najlepsze szkolenia z manicure w Polsce. Profesjonalne kursy, certyfikaty i rozwój umiejętności.",
  openGraph: {
    title: "Szkolenia z Manicure - Profesjonalne Kursy i Warsztaty",
    description: "Znajdź najlepsze szkolenia z manicure w Polsce. Profesjonalne kursy, certyfikaty i rozwój umiejętności.",
    type: "website",
  },
};

