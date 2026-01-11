import { ICity } from "@/types";
import { User } from "@/types";
import Script from "next/script";
import { FaStar } from "react-icons/fa";

interface ReviewRichSnippetsProps {
  city: ICity;
  serviceType: "manicure" | "pedicure";
  users: User[];
}

/**
 * Aggressive SEO Component 4: Review Rich Snippets
 * Creates aggregate review data for better search result appearance
 */
export default function ReviewRichSnippets({
  city,
  serviceType,
  users,
}: ReviewRichSnippetsProps) {
  const serviceName = serviceType === "manicure" ? "Manicure" : "Pedicure";
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://naily.pl";
  const pageUrl = `${baseUrl}/${serviceType}/${city.id}`;

  // Calculate aggregate ratings
  const usersWithRatings = users.filter((u) => (u as any).rating && (u as any).rating > 0);
  const totalReviews = usersWithRatings.reduce(
    (sum, u) => sum + ((u as any).reviewCount || 0),
    0
  );
  const averageRating =
    usersWithRatings.length > 0
      ? usersWithRatings.reduce((sum, u) => sum + ((u as any).rating || 0), 0) /
        usersWithRatings.length
      : 0;

  if (totalReviews === 0 || averageRating === 0) {
    return null;
  }

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    itemReviewed: {
      "@type": "Service",
      name: `${serviceName} ${city.name}`,
      description: `Usługi ${serviceType} w ${city.name}`,
      provider: {
        "@type": "LocalBusiness",
        name: `Najlepsze salony ${serviceName} ${city.name}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: city.name,
          addressCountry: "PL",
        },
      },
    },
    ratingValue: averageRating.toFixed(1),
    reviewCount: totalReviews,
    bestRating: "5",
    worstRating: "1",
  };

  return (
    <>
      <Script
        id="review-rich-snippets"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <section className="py-4 px-2 sm:py-6 sm:px-4 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <FaStar className="text-yellow-400 text-2xl" />
            <span className="text-3xl sm:text-4xl font-bold text-neutral-900 font-baloo">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-neutral-600 font-poppins">
              / 5.0
            </span>
          </div>
          <p className="text-xl sm:text-2xl text-neutral-700 mb-2 font-poppins">
            Średnia ocena stylistek {serviceName} w {city.name}
          </p>
          <p className="text-neutral-600 font-poppins">
            Na podstawie <strong>{totalReviews}</strong> opinii klientek
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3 sm:gap-4">
            {usersWithRatings.slice(0, 5).map((user) => (
              <div
                key={user.uid}
                className="bg-white rounded-lg p-3 sm:p-4 shadow-sm min-w-[200px]"
                itemScope
                itemType="https://schema.org/Review"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-neutral-900 font-baloo" itemProp="author" itemScope itemType="https://schema.org/Person">
                    <span itemProp="name">{user.name}</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span className="font-semibold" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                      <meta itemProp="ratingValue" content={String((user as any).rating)} />
                      <span>{(user as any).rating}</span>
                    </span>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 font-poppins">
                  {(user as any).reviewCount || 0} opinii
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
