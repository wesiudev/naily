"use client";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { FaStar, FaTimes } from "react-icons/fa";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { motion } from "framer-motion";

interface Testimonial {
  name: string;
  role: string;
  city: string;
  text: string;
  rating: number;
  image: string;
}

const testimonialsSeed: Testimonial[] = [
  {
    name: "Nail Room Mani&Pedi",
    role: "Salon Urody",
    city: "Kraków",
    text: "W jeden weekend zdobyłyśmy 12 nowych klientek. Mogę polecić naily.",
    rating: 5,
    image: "/opinions/opinion2.png",
  },
  {
    name: "Anna K.",
    role: "Manicurzystka",
    city: "Warszawa",
    text: "Dzięki tej platformie mam stały napływ rezerwacji. Prosty panel i świetna widoczność.",
    rating: 5,
    image: "/opinions/opinion.png",
  },
  {
    name: "Kasia Z.",
    role: "Stylistka paznokci",
    city: "Gdańsk",
    text: "Łatwe zarządzanie terminami. Polecam każdej profesjonalistce.",
    rating: 5,
    image: "/opinions/opinion18.png",
  },
  {
    name: "Monika W.",
    role: "Manicurzystka",
    city: "Poznań",
    text: "Klientki znajdują mnie szybciej i mam mniej wiadomości do odpisywania.",
    rating: 5,
    image: "/opinions/opinion4.png",
  },
  {
    name: "Julia P.",
    role: "Stylistka paznokci",
    city: "Wrocław",
    text: "W pierwszy tydzień doszło 9 nowych klientek z samego wyszukiwania.",
    rating: 5,
    image: "/opinions/opinion5.png",
  },
  {
    name: "Ola S.",
    role: "Manicurzystka",
    city: "Łódź",
    text: "Rano włączyłam profil, wieczorem miałam pełny piątek. Zero dm-ów, same rezerwacje.",
    rating: 5,
    image: "/opinions/opinion6.png",
  },
  {
    name: "Ewelina R.",
    role: "Właścicielka studia",
    city: "Katowice",
    text: "Zapełniłam martwe godziny między 12–15. Kalendarz przestał świecić pustkami.",
    rating: 5,
    image: "/opinions/opinion7.png",
  },
  {
    name: "Karolina M.",
    role: "Manicurzystka",
    city: "Szczecin",
    text: "Podniosłam ceny o 15% i dalej przychodzą nowe klientki. Jest popyt.",
    rating: 5,
    image: "/opinions/opinion8.png",
  },
  {
    name: "Agnieszka B.",
    role: "Salon Urody",
    city: "Lublin",
    text: "Telefon przestał dzwonić o terminy, wszystko wpada przez naily i mam porządek.",
    rating: 5,
    image: "/opinions/opinion9.png",
  },
  {
    name: "Marta D.",
    role: "Stylistka paznokci",
    city: "Białystok",
    text: "Koleżanka dołączyła tydzień przede mną i zgarnęła mój ruch. Nie czekałam dłużej.",
    rating: 5,
    image: "/opinions/opinion10.png",
  },
  {
    name: "Paulina T.",
    role: "Manicurzystka",
    city: "Rzeszów",
    text: "Z 2 wolnych dni zeszłam do 0. Terminy rezerwują się same, ja tylko pracuję.",
    rating: 5,
    image: "/opinions/opinion11.png",
  },
  {
    name: "Natalia L.",
    role: "Stylistka paznokci",
    city: "Gdynia",
    text: "Top 3 w mojej dzielnicy po 2 tygodniach. Klientki piszą, że widzą mnie wszędzie.",
    rating: 5,
    image: "/opinions/opinion12.png",
  },
  {
    name: "Izabela C.",
    role: "Manicurzystka",
    city: "Toruń",
    text: "Zrezygnowałam z odpowiadania na wiadomości na IG. Mam system i spokój.",
    rating: 5,
    image: "/opinions/opinion13.png",
  },
  {
    name: "Sara J.",
    role: "Stylistka paznokci",
    city: "Olsztyn",
    text: "Pierwszy weekend: 6 nowych klientek z okolicy, których wcześniej nie docierałam.",
    rating: 5,
    image: "/opinions/opinion14.png",
  },
  {
    name: "Klaudia F.",
    role: "Manicurzystka",
    city: "Bydgoszcz",
    text: "Wyszukiwarka pokazuje mnie w pobliżu biurowców. Popołudnia mam wyprzedane.",
    rating: 5,
    image: "/opinions/opinion15.png",
  },
  {
    name: "Weronika H.",
    role: "Właścicielka salonu",
    city: "Kielce",
    text: "Zespół ma zsynchronizowany kalendarz, zero nakładek. Oszczędzamy godziny tygodniowo.",
    rating: 5,
    image: "/opinions/opinion16.png",
  },
  {
    name: "Magda W.",
    role: "Stylistka paznokci",
    city: "Warszawa",
    text: "Klientki rezerwują jeszcze tego samego dnia. Bałam się, że ominie mnie sezon.",
    rating: 5,
    image: "/opinions/opinion17.png",
  },
];

// images are defined per testimonial; no separate images array needed

export default function TestimonialsCarousel() {
  const items = useMemo(() => testimonialsSeed, []);
  const [index, setIndex] = useState(0);
  const [opinionsVisible, setOpinionsVisible] = useState(false);
  const [cardWidth, setCardWidth] = useState(320);
  
  // Calculate card width based on screen size (card width + gap)
  React.useEffect(() => {
    const updateCardWidth = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        // lg: 420px card + 24px gap (gap-6)
        setCardWidth(444);
      } else if (width >= 640) {
        // sm: 340px card + 24px gap (gap-6)
        setCardWidth(364);
      } else {
        // mobile: 280px card + 16px gap (gap-4)
        setCardWidth(296);
      }
    };
    
    updateCardWidth();
    window.addEventListener('resize', updateCardWidth);
    return () => window.removeEventListener('resize', updateCardWidth);
  }, []);
  
  function goLeft() {
    setIndex((prev) => Math.max(prev - 1, 0));
  }

  function goRight() {
    setIndex((prev) => Math.min(prev + 1, items.length - 1));
  }

  return (
    <>
      {opinionsVisible && (
        <div
          onClick={() => setOpinionsVisible(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4 sm:px-6 py-8"
        >
          <button
            onClick={() => setOpinionsVisible(false)}
            className="focus:outline-none fixed top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full text-zinc-800 flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-50"
            aria-label="Zamknij"
          >
            <FaTimes className="text-lg sm:text-xl" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] overflow-y-auto bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 max-w-3xl mx-auto shadow-2xl"
          >
            <div className="sticky top-0 bg-white pb-4 mb-6 border-b border-neutral-200 z-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-baloo text-zinc-800 mb-2">
                Wszystkie opinie
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 font-poppins">
                {items.length} opinii od naszych specjalistek
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:gap-6">
              {items.map((t, idx) => (
                <article
                  key={idx}
                  className="w-full flex-shrink-0 p-6 sm:p-8 rounded-2xl border-2 border-neutral-200/80 bg-white hover:border-blue-200 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center gap-1.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-base sm:text-lg transition-colors ${
                          i < t.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-neutral-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-neutral-700 text-sm sm:text-base leading-relaxed mb-6 font-poppins">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                    <div className="relative">
                      <Image
                        src={t.image}
                        alt={t.name}
                        width={48}
                        height={48}
                        className="rounded-full aspect-square object-cover ring-2 ring-neutral-100"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-black font-semibold text-sm sm:text-base">{t.name}</p>
                      <p className="text-xs sm:text-sm text-neutral-500">
                        {t.role} • {t.city}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="relative w-full">
        {/* Container with proper padding to show cards fully */}
        <div className="overflow-hidden">
          <div className="px-4 sm:px-6 lg:px-8">
            <motion.div
              className="flex gap-4 sm:gap-6"
              animate={{ x: `-${index * cardWidth}px` }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              style={{ willChange: 'transform' }}
            >
              {items.map((t, idx) => (
                <article
                  key={idx}
                  className="group flex-shrink-0 w-[280px] sm:w-[340px] lg:w-[420px] p-6 sm:p-8 lg:p-10 rounded-2xl border-2 border-neutral-200/80 bg-white shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1"
                >
              {/* Rating */}
              <div className="flex items-center gap-1.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-base sm:text-lg transition-colors ${
                      i < t.rating 
                        ? "text-yellow-500 fill-yellow-500" 
                        : "text-neutral-200"
                    }`}
                  />
                ))}
              </div>
              
              {/* Testimonial Text */}
              <p className="text-neutral-700 text-sm sm:text-base leading-relaxed mb-6 font-poppins min-h-[80px]">
                "{t.text}"
              </p>
              
              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                <div className="relative">
                  <Image
                    src={t.image}
                    alt={t.name}
                    width={48}
                    height={48}
                    className="rounded-full aspect-square object-cover ring-2 ring-neutral-100 group-hover:ring-blue-200 transition-all"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-black font-semibold text-sm sm:text-base truncate">{t.name}</p>
                  <p className="text-xs sm:text-sm text-neutral-500 truncate">
                    {t.role} • {t.city}
                  </p>
                </div>
              </div>
            </article>
          ))}
          </motion.div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row mt-12 sm:mt-16 w-full justify-between items-center gap-4 sm:gap-0">
          <button
            onClick={() => setOpinionsVisible(true)}
            className="group inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-all duration-200 text-base sm:text-lg lg:text-xl font-semibold font-poppins hover:gap-3"
          >
            <span>Zobacz wszystkie opinie</span>
            <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="flex flex-row items-center gap-3 sm:gap-4">
            <motion.button
              className="duration-200 group w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 rounded-full focus:outline-none border-2 border-blue-200 hover:border-transparent shadow-sm hover:shadow-lg transition-all"
              whileTap={{ scale: 0.95 }}
              onClick={goLeft}
              disabled={index === 0}
            >
              <FaArrowLeft className={`text-xl sm:text-2xl transition-colors ${
                index === 0 
                  ? "text-neutral-300" 
                  : "text-blue-600 group-hover:text-white"
              }`} />
            </motion.button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 rounded-full">
              <span className="text-xs sm:text-sm font-semibold text-neutral-600">
                {index + 1}
              </span>
              <span className="text-xs text-neutral-400">/</span>
              <span className="text-xs sm:text-sm text-neutral-500">
                {items.length}
              </span>
            </div>
            <motion.button
              className="duration-200 group w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 rounded-full focus:outline-none border-2 border-blue-200 hover:border-transparent shadow-sm hover:shadow-lg transition-all"
              whileTap={{ scale: 0.95 }}
              onClick={goRight}
              disabled={index === items.length - 1}
            >
              <FaArrowRight className={`text-xl sm:text-2xl transition-colors ${
                index === items.length - 1 
                  ? "text-neutral-300" 
                  : "text-blue-600 group-hover:text-white"
              }`} />
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
}
