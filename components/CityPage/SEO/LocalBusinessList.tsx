import { ICity } from "@/types";
import { User } from "@/types";
import Link from "next/link";
import { FaMapMarkerAlt, FaPhone, FaStar } from "react-icons/fa";

interface LocalBusinessListProps {
  city: ICity;
  serviceType: "manicure" | "pedicure";
  users: User[];
}

/**
 * Aggressive SEO Component 2: Local Business List with Rich Snippets
 * Creates structured local business listings for better local SEO
 */
export default function LocalBusinessList({
  city,
  serviceType,
  users,
}: LocalBusinessListProps) {
  const serviceName = serviceType === "manicure" ? "Manicure" : "Pedicure";
  const topUsers = users.slice(0, 10);

  return (
    <section className="py-4 px-2 sm:py-6 sm:px-4 bg-neutral-50" itemScope itemType="https://schema.org/ItemList">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-baloo font-bold text-neutral-900 mb-4">
          <span itemProp="name">Najlepsze salony {serviceName} w {city.name}</span>
        </h2>
        <p className="text-neutral-600 mb-6 font-poppins" itemProp="description">
          Sprawdzone miejsca z najwyższymi ocenami klientek. Każdy salon przeszedł weryfikację jakości.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {topUsers.map((user, index) => (
            <article
              key={user.uid}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
              itemScope
              itemType="https://schema.org/BeautySalon"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-baloo font-bold text-neutral-900" itemProp="name">
                  {user.name || `Salon ${serviceName}`}
                </h3>
                {(user as any).rating && (
                  <div className="flex items-center gap-1" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                    <FaStar className="text-yellow-400" />
                    <span className="font-semibold" itemProp="ratingValue">{(user as any).rating}</span>
                    <meta itemProp="reviewCount" content={String((user as any).reviewCount || 0)} />
                  </div>
                )}
              </div>

              {user.description && (
                <p className="text-neutral-600 text-sm mb-4 font-poppins line-clamp-2" itemProp="description">
                  {user.description}
                </p>
              )}

              <div className="space-y-2">
                {user.location?.address && (
                  <div className="flex items-start gap-2 text-sm text-neutral-700" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                    <FaMapMarkerAlt className="text-blue-600 mt-1 flex-shrink-0" />
                    <span itemProp="streetAddress">{user.location.address}</span>
                    <span className="hidden" itemProp="addressLocality">{city.name}</span>
                    <span className="hidden" itemProp="addressCountry">PL</span>
                  </div>
                )}

                {user.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm text-neutral-700">
                    <FaPhone className="text-blue-600 flex-shrink-0" />
                    <a
                      href={`tel:${user.phoneNumber}`}
                      className="hover:text-blue-600 transition-colors"
                      itemProp="telephone"
                    >
                      {user.phoneNumber}
                    </a>
                  </div>
                )}

                {user.userSlugUrl && (
                  <Link
                    href={`/u/${user.userSlugUrl}`}
                    className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                    itemProp="url"
                  >
                    Zobacz profil →
                  </Link>
                )}
              </div>

              {user.services && user.services.length > 0 && (
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <p className="text-xs text-neutral-500 mb-2 font-poppins">Oferowane usługi:</p>
                  <div className="flex flex-wrap gap-2">
                    {user.services.slice(0, 3).map((service: any, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                        itemProp="makesOffer"
                        itemScope
                        itemType="https://schema.org/Offer"
                      >
                        <span itemProp="itemOffered" itemScope itemType="https://schema.org/Service">
                          <span itemProp="name">{service.real_name || service.name}</span>
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <meta itemProp="position" content={String(index + 1)} />
            </article>
          ))}
        </div>

        <meta itemProp="numberOfItems" content={String(topUsers.length)} />
      </div>
    </section>
  );
}
