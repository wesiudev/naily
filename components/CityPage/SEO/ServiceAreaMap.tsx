import { ICity } from "@/types";
import Script from "next/script";

interface ServiceAreaMapProps {
  city: ICity;
  serviceType: "manicure" | "pedicure";
  nearbyCities?: ICity[];
}

/**
 * Aggressive SEO Component 3: Service Area Map with Geo-targeting
 * Helps with local SEO by clearly defining service areas
 */
export default function ServiceAreaMap({
  city,
  serviceType,
  nearbyCities = [],
}: ServiceAreaMapProps) {
  const serviceName = serviceType === "manicure" ? "Manicure" : "Pedicure";
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://naily.pl";

  // Generate service area schema
  const serviceAreaSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: `${serviceName} Services`,
    areaServed: [
      {
        "@type": "City",
        name: city.name,
        addressRegion: city.province || "",
        addressCountry: "PL",
      },
      ...nearbyCities.slice(0, 5).map((nearbyCity) => ({
        "@type": "City",
        name: nearbyCity.name,
        addressRegion: nearbyCity.province || "",
        addressCountry: "PL",
      })),
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${baseUrl}/${serviceType}/${city.id}`,
      serviceType: "Online",
    },
  };

  return (
    <>
      <Script
        id="service-area-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceAreaSchema) }}
      />
      <section className="py-4 px-2 sm:py-6 sm:px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl sm:text-4xl font-baloo font-bold text-neutral-900 mb-4">
            Obszar Obsługi - {serviceName} {city.name}
          </h2>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6">
            <p className="text-lg text-neutral-700 mb-4 font-poppins">
              Nasze stylistki {serviceName} obsługują {city.name} oraz okoliczne miejscowości. 
              Znajdź najlepszą stylistkę w swojej okolicy.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <h3 className="font-bold text-neutral-900 mb-3 font-baloo text-xl">
                  Główne miasto:
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-neutral-700 font-poppins">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    {city.name}
                    {city.province && `, ${city.province}`}
                  </li>
                </ul>
              </div>

              {nearbyCities.length > 0 && (
                <div>
                  <h3 className="font-bold text-neutral-900 mb-3 font-baloo text-xl">
                    Okoliczne miejscowości:
                  </h3>
                  <ul className="space-y-2">
                    {nearbyCities.slice(0, 8).map((nearbyCity) => (
                      <li
                        key={nearbyCity.id}
                        className="flex items-center gap-2 text-neutral-700 font-poppins"
                      >
                        <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                        {nearbyCity.name}
                        {nearbyCity.province && `, ${nearbyCity.province}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {city.latitude && city.longitude && (
              <div className="mt-4 p-3 sm:p-4 bg-white rounded-lg border border-neutral-200">
                <p className="text-sm text-neutral-600 mb-2 font-poppins">
                  Lokalizacja na mapie:
                </p>
                <div className="aspect-video bg-neutral-100 rounded-lg flex items-center justify-center">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${city.latitude},${city.longitude}&zoom=12`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
