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
    <section className="relative bg-gradient-to-b from-white via-slate-50/50 to-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-200/50 mb-4 sm:mb-6">
            <svg 
              className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
          </div>
          <h2 className="font-baloo text-3xl sm:text-4xl md:text-5xl xl:text-6xl mb-4 text-zinc-800 font-bold leading-tight">
            Tysiące stylistek manicure i pedicure
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-zinc-600 font-poppins leading-relaxed">
            Dołącz do społeczności stylistek, instruktorek i salonów, które już korzystają z Naily
          </p>
        </div>
        {/* Social Proof Section */}
        <TestimonialsCarousel />
      </div>
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
