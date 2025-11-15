"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { User } from "@/types";
import defaultUser from "../../../public/default-user.png";

function shuffleArray<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function fetchAllUsers(): Promise<User[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/users/public`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const users = (await res.json()) as User[];
    return users;
  } catch {
    return [];
  }
}

export default function PlacesCarousel() {
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const users = await fetchAllUsers();
        // Limit to 15 users and randomize (filtering already done in API)
        const limited = users.slice(0, 15);
        const randomized = shuffleArray(limited);
        if (isMounted) setItems(randomized);
      } catch (_e) {
        if (isMounted) setError("Nie udało się pobrać listy specjalistów.");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" });

  if (loading) {
    return (
      <section className="pt-10 px-4 sm:px-6 pb-16">
        <div className="container-professional">
          <div className="text-center mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-900">
              Znajdź Specjalistkę
            </h2>
            <p className="text-sm text-neutral-600">Ładowanie…</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white shadow-sm border border-neutral-200 p-4 animate-pulse h-64"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pt-10 px-4 sm:px-6 pb-16">
        <div className="container-professional text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-900 mb-2">
            Znajdź Specjalistę
          </h2>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  if (!items.length) return null;

  return (
    <section className="pt-10 px-4 sm:px-6 pb-16">
      <div className="container-professional">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-900">
            Znajdź Specjalistę
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto">
            Odkryj najlepszych specjalistów beauty w Twoim mieście
          </p>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {items.map((user) => (
                <div
                  key={user.uid}
                  className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-1 sm:px-2"
                >
                  <UserCard user={user} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function UserCard({ user }: { user: User }) {
  return (
    <article className="group w-full">
      <div className="mb-3 bg-white shadow-large hover:shadow-golden-lg border border-white/20 transition-all duration-300">
        <div className="relative overflow-hidden">
          <div className="aspect-[4/3] w-full">
            <Image
              src={user.logo || defaultUser}
              alt={user.name}
              width={800}
              height={600}
              className="w-full h-full rounded-2xl object-cover"
            />
          </div>
          {user.services && user.services.length > 0 && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-medium">
              <span className="font-heading text-sm font-semibold text-gray-800">
                {user.services.length} usług
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-base sm:text-lg font-semibold text-neutral-900 line-clamp-1">
            {user.name}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-neutral-600 text-sm">
            <FaMapMarkerAlt className="text-primary-600" />
            <span className="line-clamp-1">
              {user.location?.address || "Brak adresu"}
            </span>
          </div>
          {user.phoneNumber && (
            <div className="mt-1 flex items-center gap-2 text-neutral-600 text-sm">
              <FaPhone className="text-primary-600" />
              <span className="line-clamp-1">{user.phoneNumber}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
