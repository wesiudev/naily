import type {} from "next";

type BlogAuthor = {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
};

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: BlogAuthor;
  tags?: string[];
  categories?: string[];
  createdAt: Date;
  updatedAt?: Date;
  published: boolean;
  publishedAt?: Date;
  coverImageUrl?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  statistics?: {
    views: number;
    likes: number;
    shares: number;
    readingTimeMinutes?: number;
  };
  featured?: boolean;
  isPinned?: boolean;
};

const defaultAuthor: BlogAuthor = {
  id: "mentor",
  name: "Mentor Manicure",
  avatarUrl: "/default-user.png",
  bio: "Ekspert i e-mentor w dziedzinie manicure i pielęgnacji dłoni.",
};

const p = (parts: string[]) =>
  parts
    .map((t) => `<p>${t}</p>`) // minimal, readable HTML
    .join("\n");

const now = new Date();

export const staticBlogPosts: BlogPost[] = [
  {
    id: "podstawy-manicure-baza-ementora",
    slug: "podstawy-manicure-baza-ementora",
    title: "Podstawy manicure: baza e‑mentora",
    excerpt:
      "Kluczowe filary profesjonalnego manicure – narzędzia, przygotowanie płytki i bezpieczeństwo.",
    author: defaultAuthor,
    tags: ["manicure", "porady", "podstawy"],
    createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: now,
    published: true,
    coverImageUrl:
      "https://images.unsplash.com/photo-1519012811492-5e3ca4fcc22b?q=80&w=1200&auto=format&fit=crop",
    statistics: { views: 820, likes: 36, shares: 12, readingTimeMinutes: 5 },
    content: p([
      "Zanim zaczniesz stylizację, naucz się właściwie przygotowywać płytkę paznokcia – to 70% sukcesu.",
      "Omówimy podstawowe narzędzia, zasady higieny oraz najczęstsze błędy początkujących.",
    ]),
  },
  {
    id: "hybryda-krok-po-kroku",
    slug: "hybryda-krok-po-kroku",
    title: "Manicure hybrydowy krok po kroku",
    excerpt:
      "Prosty przewodnik dla początkujących – od matowienia do perfekcyjnego topu.",
    author: defaultAuthor,
    tags: ["hybryda", "techniki"],
    createdAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000),
    updatedAt: now,
    published: true,
    coverImageUrl:
      "https://images.unsplash.com/photo-1522336572468-8d6a820b0b38?q=80&w=1200&auto=format&fit=crop",
    statistics: { views: 640, likes: 29, shares: 9, readingTimeMinutes: 6 },
    content: p([
      "Hybryda to trwałość i blask. Poznaj przygotowanie płytki, aplikację bazy, koloru i topu.",
      "Wskazówki e‑mentora pomogą uniknąć zapowietrzeń i zalanych skórek.",
    ]),
  },
  {
    id: "zdejmowanie-hybrydy-bez-uszkodzen",
    slug: "zdejmowanie-hybrydy-bez-uszkodzen",
    title: "Zdejmowanie hybrydy bez uszkodzeń",
    excerpt:
      "Bezpieczne metody usuwania stylizacji – pilnik, frezarka i wrapy z acetonem.",
    author: defaultAuthor,
    tags: ["hybryda", "bezpieczenstwo"],
    createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
    updatedAt: now,
    published: true,
    coverImageUrl:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop",
    statistics: { views: 710, likes: 31, shares: 11, readingTimeMinutes: 5 },
    content: p([
      "Usuwanie hybrydy wymaga cierpliwości. Zadbaj o delikatność, by nie przerzedzić płytki.",
      "Porównujemy techniki i podajemy sytuacje, kiedy której użyć.",
    ]),
  },
  {
    id: "paznokcie-zelowe-dla-poczatkujacych",
    slug: "paznokcie-zelowe-dla-poczatkujacych",
    title: "Paznokcie żelowe dla początkujących",
    excerpt:
      "Architektura paznokcia, apex i prawidłowe budowanie – wprowadzenie dla startu.",
    author: defaultAuthor,
    tags: ["zel", "techniki", "architektura"],
    createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: now,
    published: true,
    coverImageUrl:
      "https://images.unsplash.com/photo-1519414442781-87dc1b5de2bc?q=80&w=1200&auto=format&fit=crop",
    statistics: { views: 560, likes: 24, shares: 7, readingTimeMinutes: 7 },
    content: p([
      "Żel pozwala korygować kształt i długość. Kluczem jest stabilna krzywa C i apex.",
      "Poznaj najczęstsze błędy: zbyt cienka wolna krawędź i brak szkieletu.",
    ]),
  },
  {
    id: "nail-art-minimalistyczny",
    slug: "nail-art-minimalistyczny",
    title: "Minimalistyczny nail art: proste wzory, wielki efekt",
    excerpt:
      "Kropki, cienkie linie i pastelowe akcenty – szybkie zdobienia dla każdego.",
    author: defaultAuthor,
    tags: ["nail-art", "trendy"],
    createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
    updatedAt: now,
    published: true,
    coverImageUrl:
      "https://images.unsplash.com/photo-1518987048-4f322d0d4a39?q=80&w=1200&auto=format&fit=crop",
    statistics: { views: 480, likes: 22, shares: 6, readingTimeMinutes: 4 },
    content: p([
      "Nie każdy wzór musi być skomplikowany. Minimalizm to elegancja i szybkość wykonania.",
      "Pokażemy 5 motywów, które sprawdzą się w salonie i w domu.",
    ]),
  },
  {
    id: "bezpieczenstwo-i-higiena-w-manicure",
    slug: "bezpieczenstwo-i-higiena-w-manicure",
    title: "Bezpieczeństwo i higiena w manicure",
    excerpt:
      "Dezynfekcja, sterylizacja i praca ze skórkami – standardy, których warto się trzymać.",
    author: defaultAuthor,
    tags: ["higiena", "porady"],
    createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: now,
    published: true,
    coverImageUrl:
      "https://images.unsplash.com/photo-1542718618-52b6e34ddac1?q=80&w=1200&auto=format&fit=crop",
    statistics: { views: 730, likes: 38, shares: 15, readingTimeMinutes: 6 },
    content: p([
      "Higiena to zaufanie. Wyjaśniamy różnice między dezynfekcją a sterylizacją.",
      "Podajemy checklistę procedur dla domowego i profesjonalnego stanowiska.",
    ]),
  },
  {
    id: "remont-plytki-ibx-i-olejki",
    slug: "remont-plytki-ibx-i-olejki",
    title: "Remont płytki: IBX, olejki i regeneracja",
    excerpt:
      "Jak wzmocnić zniszczone paznokcie po stylizacji? Skuteczne protokoły e‑mentora.",
    author: defaultAuthor,
    tags: ["zdrowie", "regeneracja"],
    createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: now,
    published: true,
    coverImageUrl:
      "https://images.unsplash.com/photo-1543363136-7c99da9d13f4?q=80&w=1200&auto=format&fit=crop",
    statistics: { views: 390, likes: 19, shares: 5, readingTimeMinutes: 5 },
    content: p([
      "Po intensywnych stylizacjach paznokcie potrzebują odpoczynku i wsparcia.",
      "Podajemy harmonogram zabiegów i domowej pielęgnacji, który przyspieszy odbudowę.",
    ]),
  },
  {
    id: "ksztalty-paznokci-poradnik",
    slug: "ksztalty-paznokci-poradnik",
    title: "Kształty paznokci: pełny poradnik",
    excerpt:
      "Migdał, owal, kwadrat, ballerina – jak dobrać kształt do dłoni i stylu życia.",
    author: defaultAuthor,
    tags: ["ksztalty", "stylizacja"],
    createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: now,
    published: true,
    coverImageUrl:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
    statistics: { views: 610, likes: 27, shares: 8, readingTimeMinutes: 6 },
    content: p([
      "Dobry kształt poprawia wytrzymałość i estetykę. Omawiamy zasady piłowania i proporcje.",
      "Zobacz przykłady błędów, które psują linię boczną i krzywą C.",
    ]),
  },
  {
    id: "sprzet-e-mentora-frezarka-i-lampy",
    slug: "sprzet-e-mentora-frezarka-i-lampy",
    title: "Sprzęt e‑mentora: frezarka, bity i lampy",
    excerpt:
      "Co kupić na start? Przegląd parametrów, bezpieczeństwo pracy i polecane akcesoria.",
    author: defaultAuthor,
    tags: ["sprzet", "porady"],
    createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: now,
    published: true,
    coverImageUrl:
      "https://images.unsplash.com/photo-1514986888952-8cd320577b68?q=80&w=1200&auto=format&fit=crop",
    statistics: { views: 450, likes: 21, shares: 6, readingTimeMinutes: 5 },
    content: p([
      "Frezarka skraca czas pracy, ale wymaga techniki. Wyjaśniamy rodzaje bitów i obroty.",
      "Dobór lampy UV/LED wpływa na utwardzanie – sprawdź moc i spektrum.",
    ]),
  },
  {
    id: "trendy-kolory-sezonu",
    slug: "trendy-kolory-sezonu",
    title: "Trendy i kolory sezonu w manicure",
    excerpt:
      "Od pasteli po głęboki burgund – paleta, która zdominuje najbliższe miesiące.",
    author: defaultAuthor,
    tags: ["trendy", "kolory"],
    createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: now,
    published: true,
    coverImageUrl:
      "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1200&auto=format&fit=crop",
    statistics: { views: 520, likes: 25, shares: 10, readingTimeMinutes: 4 },
    content: p([
      "Kolory to komunikat. Podpowiadamy, jak łączyć odcienie z typem urody i okazją.",
      "Znajdziesz propozycje zdobień, które podkreślą wybrane barwy.",
    ]),
  },
];

export type { BlogPost };
