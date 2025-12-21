import { Metadata, Viewport } from "next";
import SearchBar from "@/components/SearchBar";
import Hero from "@/components/Landing/Hero";
import ComparisonSection from "@/components/Landing/ComparisonSection";
import TestimonialsCarousel from "@/components/Testimonials/Carousel";
import FinalCta from "@/components/Landing/FinalCta";
import FAQ, { type FaqItem } from "@/components/FAQ/FAQ";
import RecentPostsWrapper from "@/components/Blog/RecentPostsWrapper";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div id="reserve">
        <SearchBar />
      </div>
      {/* <ImageCollage /> */}
      <WhatMakesUsUniqueSection />
      <Hero />
      <ComparisonSection />

      <RecentPostsWrapper limit={6} columns={3} />

      <FinalCta />
      <div className="py-20">
        <FAQ className="animate-fade-in-up" items={landingFaq} />
      </div>
    </div>
  );
}

function WhatMakesUsUniqueSection() {
  return (
    <section className="container mx-auto py-20">
      <h2 className="font-baloo text-4xl xl:text-5xl mb-6 text-zinc-800 font-bold">
        Tysiące specjalistek z całej Polski
      </h2>
      {/* Social Proof Section */}
      <TestimonialsCarousel />
    </section>
  );
}

const landingFaq: FaqItem[] = [
  {
    id: "what-is-naily",
    question: "Czym jest Naily?",
    answer:
      "Naily łączy klientki ze sprawdzonymi stylistkami manicure i pedicure. W jednym miejscu znajdziesz profile, cenniki i wolne terminy.",
  },
  {
    id: "how-to-book",
    question: "Jak zarezerwować wizytę?",
    answer:
      "Wyszukaj miasto, wybierz specjalistkę, a następnie wybierz termin. Otrzymasz powiadomienie z potwierdzeniem rezerwacji.",
  },
  {
    id: "is-free",
    question: "Czy korzystanie jest darmowe?",
    answer:
      "Tak, dla klientek korzystanie z Naily jest bezpłatne. Specjalistki mogą wykupić plan, aby zwiększyć widoczność.",
  },
  {
    id: "cancellation",
    question: "Czy mogę odwołać lub zmienić termin?",
    answer:
      "Tak, zmiany są możliwe zgodnie z polityką wybranej specjalistki. Informacje znajdziesz na profilu i w potwierdzeniu rezerwacji.",
  },
];

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2563eb",
};

export const metadata: Metadata = {
  publisher: "naily.pl",
  manifest: "/manifest.json",
  icons: [{ url: "/fav/favicon.ico", sizes: "192x192", type: "image/png" }],
  title: "Naily: Strona dla stylistek Manicure i Pedicure",
  description:
    "Stylistki manicure i pedicure, szkolenia w branży, oferty pracy, cenniki, rezerwacje",
  openGraph: {
    type: "website",
    url: "https://naily.pl",
    title: "Naily: Strona dla stylistek Manicure i Pedicure",
    description:
      "Stylistki manicure i pedicure, szkolenia w branży, oferty pracy, cenniki, rezerwacje",
    siteName: "naily.pl",
    images: [
      {
        url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1200&h=630&fit=crop&crop=center&auto=format",
        width: 1200,
        height: 630,
        alt: "Profesjonalny manicure",
      },
      {
        url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=630&fit=crop&crop=center&auto=format",
        width: 1200,
        height: 630,
        alt: "Manicure w salonie",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Naily: Strona dla stylistek Manicure i Pedicure",
    description:
      "Stylistki manicure i pedicure, szkolenia w branży, oferty pracy, cenniki, rezerwacje",
    images: [
      {
        url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1200&h=630&fit=crop&crop=center&auto=format",
        alt: "Profesjonalny manicure",
      },
    ],
  },
};
