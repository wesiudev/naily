"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
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
    image: "/opinions/opinion3.png",
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
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-6"
        >
          <button
            onClick={() => setOpinionsVisible(false)}
            className="focus:outline-none fixed top-16 right-6 bg-white/20 rounded-full text-white flex items-center justify-center"
          >
            <FaTimes className="text-2xl" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[70vh] overflow-y-auto bg-white rounded-xl p-8 max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold font-baloo mb-3">Opinie</h2>
            <div className="flex flex-col gap-3">
              {items.map((t, idx) => (
                <article
                  key={idx}
                  className="w-full flex-shrink-0 p-6 sm:p-8 rounded-2xl border-2 border-neutral-200 bg-white"
                >
                  <div className="flex items-center gap-1.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-lg ${
                          i < t.rating
                            ? "text-yellow-600/90"
                            : "text-neutral-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-neutral-700 leading-relaxed mb-5">
                    {t.text}
                  </p>
                  <div className="flex items-center gap-3">
                    <Image
                      src={t.image}
                      alt={t.name}
                      width={40}
                      height={40}
                      className="rounded-full aspect-square object-cover"
                    />
                    <div>
                      <p className="text-black">{t.name}</p>
                      <p className="text-xs text-neutral-500">
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
        {/* Wrapper */}
        <motion.div
          className="flex gap-4"
          animate={{ x: `-${index * 320}px` }} // przesuwanie o szerokość karty
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        >
          {items.map((t, idx) => (
            <article
              key={idx}
              className="w-max max-w-full lg:max-w-[420px] flex-shrink-0 p-6 sm:p-8 rounded-2xl border-2 border-neutral-200 bg-white"
            >
              <div className="flex items-center gap-1.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-lg ${
                      i < t.rating ? "text-yellow-600/90" : "text-neutral-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-neutral-700 leading-relaxed mb-5">{t.text}</p>
              <div className="flex items-center gap-3">
                <Image
                  src={t.image}
                  alt={t.name}
                  width={40}
                  height={40}
                  className="rounded-full aspect-square object-cover"
                />
                <div>
                  <p className="text-black">{t.name}</p>
                  <p className="text-xs text-neutral-500">
                    {t.role} • {t.city}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </motion.div>

        {/* Controls */}
        <div className="flex mt-16 w-full justify-between items-center">
          <button
            onClick={() => setOpinionsVisible(true)}
            className="text-blue-600 hover:text-blue-700 transition-colors duration-200 text-2xl font-bold font-poppins"
          >
            Zobacz więcej
          </button>
          <div className="flex flex-row items-center gap-3">
            <motion.button
              className="duration-100 group w-16 h-16 flex items-center justify-center hover:bg-blue-600 rounded-full focus:outline-none"
              whileTap={{ x: -5 }}
              onClick={goLeft}
            >
              <FaArrowLeft className="text-4xl text-blue-600 group-hover:text-white" />
            </motion.button>
            <motion.button
              className="duration-100 group w-16 h-16 flex items-center justify-center hover:bg-blue-600 rounded-full focus:outline-none"
              whileTap={{ x: 5 }}
              onClick={goRight}
            >
              <FaArrowRight className="text-4xl text-blue-600 group-hover:text-white" />
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
}
