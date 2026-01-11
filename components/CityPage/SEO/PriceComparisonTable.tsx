import { ICity } from "@/types";
import { User } from "@/types";
import { FaCheck } from "react-icons/fa";

interface PriceComparisonTableProps {
  city: ICity;
  serviceType: "manicure" | "pedicure";
  users: User[];
}

/**
 * Aggressive SEO Component 5: Price Comparison Table with Structured Data
 * Helps with price-related searches and featured snippets
 */
export default function PriceComparisonTable({
  city,
  serviceType,
  users,
}: PriceComparisonTableProps) {
  const serviceName = serviceType === "manicure" ? "Manicure" : "Pedicure";

  // Extract pricing data from users
  const pricingData: Array<{
    serviceName: string;
    minPrice: number;
    maxPrice: number;
    averagePrice: number;
  }> = [];

  users.forEach((user) => {
    if (user.services && Array.isArray(user.services)) {
      user.services.forEach((service: any) => {
        const price = parseInt(service.price) || 0;
        if (price > 0) {
          const existing = pricingData.find(
            (p) => p.serviceName === (service.real_name || service.name)
          );
          if (existing) {
            existing.minPrice = Math.min(existing.minPrice, price);
            existing.maxPrice = Math.max(existing.maxPrice, price);
            existing.averagePrice = (existing.averagePrice + price) / 2;
          } else {
            pricingData.push({
              serviceName: service.real_name || service.name,
              minPrice: price,
              maxPrice: price,
              averagePrice: price,
            });
          }
        }
      });
    }
  });

  // Common services with default pricing if no data
  const commonServices = [
    { name: "Manicure klasyczny", defaultMin: 60, defaultMax: 120 },
    { name: "Manicure hybrydowy", defaultMin: 90, defaultMax: 150 },
    { name: "Przedłużanie paznokci", defaultMin: 100, defaultMax: 200 },
    { name: "French manicure", defaultMin: 120, defaultMax: 180 },
    { name: "Manicure japoński", defaultMin: 150, defaultMax: 250 },
  ];

  const displayServices = pricingData.length > 0 
    ? pricingData.slice(0, 10)
    : commonServices.map(s => ({
        serviceName: s.name,
        minPrice: s.defaultMin,
        maxPrice: s.defaultMax,
        averagePrice: (s.defaultMin + s.defaultMax) / 2,
      }));

  return (
    <section className="py-4 px-2 sm:py-6 sm:px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl sm:text-4xl font-baloo font-bold text-neutral-900 mb-3">
          Porównanie Cen {serviceName} {city.name} 2026
        </h2>
        <p className="text-neutral-600 mb-6 font-poppins">
          Sprawdź aktualne ceny usług {serviceType} w {city.name}. Ceny mogą się różnić w zależności 
          od stylistki, lokalizacji i zakresu usługi.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-xl shadow-lg" itemScope itemType="https://schema.org/Table">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <th className="px-3 py-3 sm:px-6 sm:py-4 text-left font-baloo font-bold text-sm sm:text-base">Usługa</th>
                <th className="px-3 py-3 sm:px-6 sm:py-4 text-center font-baloo font-bold text-sm sm:text-base">Cena minimalna</th>
                <th className="px-3 py-3 sm:px-6 sm:py-4 text-center font-baloo font-bold text-sm sm:text-base">Cena maksymalna</th>
                <th className="px-3 py-3 sm:px-6 sm:py-4 text-center font-baloo font-bold text-sm sm:text-base">Średnia cena</th>
              </tr>
            </thead>
            <tbody>
              {displayServices.map((service, index) => (
                <tr
                  key={index}
                  className="border-b border-neutral-200 hover:bg-blue-50 transition-colors"
                  itemScope
                  itemType="https://schema.org/Offer"
                >
                  <td className="px-3 py-3 sm:px-6 sm:py-4 font-poppins font-semibold text-neutral-900 text-sm sm:text-base" itemProp="itemOffered" itemScope itemType="https://schema.org/Service">
                    <span itemProp="name">{service.serviceName}</span>
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-center font-poppins text-neutral-700 text-sm sm:text-base">
                    <span itemProp="price">{service.minPrice}</span>{" "}
                    <span itemProp="priceCurrency">PLN</span>
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-center font-poppins text-neutral-700 text-sm sm:text-base">
                    {service.maxPrice} PLN
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-center font-poppins font-semibold text-blue-600 text-sm sm:text-base">
                    {Math.round(service.averagePrice)} PLN
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 sm:p-6 bg-blue-50 rounded-xl">
          <h3 className="text-xl sm:text-2xl font-baloo font-bold text-neutral-900 mb-3">
            Co wpływa na cenę {serviceName}?
          </h3>
          <ul className="space-y-2 text-neutral-700 font-poppins text-sm sm:text-base">
            <li className="flex items-start gap-2">
              <FaCheck className="text-green-600 mt-1 flex-shrink-0" />
              <span>Doświadczenie i kwalifikacje stylistki</span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheck className="text-green-600 mt-1 flex-shrink-0" />
              <span>Lokalizacja salonu (centrum miasta vs. peryferie)</span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheck className="text-green-600 mt-1 flex-shrink-0" />
              <span>Jakość użytych produktów i narzędzi</span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheck className="text-green-600 mt-1 flex-shrink-0" />
              <span>Zakres usługi (podstawowa vs. premium)</span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheck className="text-green-600 mt-1 flex-shrink-0" />
              <span>Czas trwania zabiegu</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
