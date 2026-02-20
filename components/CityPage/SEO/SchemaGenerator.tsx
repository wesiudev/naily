import { ICity } from "@/types";
import { User } from "@/types";
import Script from "next/script";

interface SchemaGeneratorProps {
  city: ICity;
  serviceType: "manicure" | "pedicure";
  users?: User[];
  faqItems?: Array<{ question: string; answer: string }>;
}

export function generateComprehensiveSchema({
  city,
  serviceType,
  users = [],
  faqItems = [],
}: SchemaGeneratorProps) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://naily.pl";
  const serviceName = serviceType === "manicure" ? "Manicure" : "Pedicure";
  const pageUrl = `${baseUrl}/${serviceType}/${city.id}`;

  const schemas: any[] = [
    // CollectionPage
    {
      "@type": "CollectionPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: `TOP 10 ${serviceName.toUpperCase()} ${city.name} - Cennik Katalog`,
      description: `TOP 10 najlepszych stylistek i salonów ${serviceType} ${city.name}. Pełny cennik, katalog usług i opinie.`,
      inLanguage: "pl-PL",
      isPartOf: {
        "@id": `${baseUrl}#website`,
      },
      breadcrumb: {
        "@id": `${pageUrl}#breadcrumb`,
      },
    },
    // BreadcrumbList
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Strona główna",
          item: baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: `${serviceName} ${city.name}`,
          item: pageUrl,
        },
      ],
    },
    // FAQPage
    {
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: faqItems.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
    // ItemList for salons
    {
      "@type": "ItemList",
      "@id": `${pageUrl}#itemlist`,
      name: `TOP 10 ${serviceName.toUpperCase()} ${city.name} - Cennik Katalog`,
      description: `Lista najlepszych stylistek i salonów ${serviceType} w ${city.name}`,
      numberOfItems: Math.min(users.length, 10),
      itemListElement: users.slice(0, 10).map((user, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: user.name || `Stylistka ${serviceType}`,
        item: user.userSlugUrl
          ? `${baseUrl}/zarezerwuj/${user.userSlugUrl}`
          : `${baseUrl}/zarezerwuj/${user.uid}`,
      })),
    },
  ];

  // Add LocalBusiness schemas for each salon
  users.slice(0, 10).forEach((user) => {
    if (user.location?.address && user.phoneNumber) {
      const businessSchema: any = {
        "@type": "BeautySalon",
        "@id": `${baseUrl}/zarezerwuj/${user.userSlugUrl || user.uid}#business`,
        name: user.name || `Salon ${serviceType} ${city.name}`,
        description: user.description || `Profesjonalny salon ${serviceType} w ${city.name}`,
        url: user.userSlugUrl
          ? `${baseUrl}/zarezerwuj/${user.userSlugUrl}`
          : `${baseUrl}/zarezerwuj/${user.uid}`,
        telephone: user.phoneNumber,
        address: {
          "@type": "PostalAddress",
          addressLocality: city.name,
          addressRegion: city.province || "",
          addressCountry: "PL",
          streetAddress: user.location.address,
        },
        geo: user.location.lat && user.location.lng
          ? {
              "@type": "GeoCoordinates",
              latitude: user.location.lat,
              longitude: user.location.lng,
            }
          : undefined,
        priceRange: "$$",
        image: user.logo || `${baseUrl}/naily-logo-big.png`,
        aggregateRating: 1.0
          ? {
              "@type": "AggregateRating",
              ratingValue: 5,
              reviewCount: 10,
            }
          : undefined,
      };

      // Add services offered
      if (user.services && user.services.length > 0) {
        businessSchema.makesOffer = user.services.map((service: any) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.real_name || service.name,
            description: service.description,
            provider: {
              "@id": `${baseUrl}/zarezerwuj/${user.userSlugUrl || user.uid}#business`,
            },
          },
          price: service.price || "0",
          priceCurrency: "PLN",
        }));
      }

      schemas.push(businessSchema);
    }
  });

  // Add LocalBusiness aggregate for the city
  schemas.push({
    "@type": "LocalBusiness",
    "@id": `${pageUrl}#localbusiness`,
    name: `Najlepsze salony ${serviceName} w ${city.name}`,
    description: `Katalog najlepszych salonów i stylistek ${serviceType} w ${city.name}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: city.name,
      addressRegion: city.province || "",
      addressCountry: "PL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: city.latitude || 0,
      longitude: city.longitude || 0,
    },
    areaServed: {
      "@type": "City",
      name: city.name,
    },
  });

  return {
    "@context": "https://schema.org",
    "@graph": schemas,
  };
}

export default function SchemaGenerator(props: SchemaGeneratorProps) {
  const schema = generateComprehensiveSchema(props);

  return (
    <Script
      id="comprehensive-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}




