"use client";
import { useState } from "react";
import Image from "next/image";
import { FaInfoCircle, FaArrowRight } from "react-icons/fa";
import service1 from "@/public/home/service1.jpg";
import service2 from "@/public/home/service2.jpg";
import service3 from "@/public/home/service3.jpg";

export default function ServiceDescriptions({
  data,
}: {
  data: {
    classic: string;
    hybrid: string;
    magnetic: string;
  };
}) {
  const [activePopup, setActivePopup] = useState<string | null>(null);
  return (
    <>
      {/* Popular Services Section - Elegant */}
      <section className="section-padding px-4 sm:px-6 bg-beauty-pearl">
        <div className="container-elegant">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-beauty-charcoal mb-4 sm:mb-6 px-4">
              Popularne usługi
            </h2>
            <p className="text-base sm:text-lg text-beauty-slate max-w-3xl mx-auto font-medium leading-relaxed px-4">
              Wybierz spośród szerokiej gamy profesjonalnych usług, dopasowanych
              do Twoich potrzeb i stylu
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="elegant-card group overflow-hidden relative">
              <div className="relative overflow-hidden">
                <Image
                  src={service1}
                  alt="Manicure klasyczny"
                  className="w-full h-48 sm:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-beauty-charcoal">
                    Manicure klasyczny
                  </h3>
                  <button
                    onClick={() =>
                      setActivePopup(
                        activePopup === "classic" ? null : "classic"
                      )
                    }
                    className="text-beauty-rose-500 hover:text-beauty-rose-600"
                  >
                    <FaInfoCircle size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
                <p className="text-beauty-slate font-medium leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                  Ciesz się elegancją i prostotą klasycznego manicure, który
                  nigdy nie wychodzi z mody.
                </p>
                <button
                  onClick={() =>
                    setActivePopup(activePopup === "classic" ? null : "classic")
                  }
                  className="text-beauty-rose-500 font-semibold hover:text-beauty-rose-600 transition-colors flex items-center gap-2 group text-sm sm:text-base"
                >
                  Dowiedz się więcej
                  <FaArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
                </button>
              </div>
              {activePopup === "classic" && (
                <div className="absolute inset-0 bg-black/80 p-4 sm:p-6 flex items-center justify-center">
                  <div className="bg-white rounded-elegant p-4 sm:p-6 max-w-sm w-full mx-4">
                    <p className="text-beauty-slate whitespace-pre-line text-sm sm:text-base">
                      {data.classic}
                    </p>
                    <button
                      onClick={() => setActivePopup(null)}
                      className="mt-3 sm:mt-4 text-beauty-rose-500 hover:text-beauty-rose-600 text-sm sm:text-base"
                    >
                      Zamknij
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="elegant-card group overflow-hidden relative">
              <div className="relative overflow-hidden">
                <Image
                  src={service2}
                  alt="Manicure hybrydowy"
                  className="w-full h-48 sm:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-beauty-charcoal">
                    Manicure hybrydowy
                  </h3>
                  <button
                    onClick={() =>
                      setActivePopup(activePopup === "hybrid" ? null : "hybrid")
                    }
                    className="text-beauty-rose-500 hover:text-beauty-rose-600"
                  >
                    <FaInfoCircle size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
                <p className="text-beauty-slate font-medium leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                  Trwałość i styl, który przetrwa tygodnie. Idealny dla
                  aktywnych kobiet.
                </p>
                <button
                  onClick={() =>
                    setActivePopup(activePopup === "hybrid" ? null : "hybrid")
                  }
                  className="text-beauty-rose-500 font-semibold hover:text-beauty-rose-600 transition-colors flex items-center gap-2 group text-sm sm:text-base"
                >
                  Dowiedz się więcej
                  <FaArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
                </button>
              </div>
              {activePopup === "hybrid" && (
                <div className="absolute inset-0 bg-black/80 p-4 sm:p-6 flex items-center justify-center">
                  <div className="bg-white rounded-elegant p-4 sm:p-6 max-w-sm w-full mx-4">
                    <p className="text-beauty-slate whitespace-pre-line text-sm sm:text-base">
                      {data.hybrid}
                    </p>
                    <button
                      onClick={() => setActivePopup(null)}
                      className="mt-3 sm:mt-4 text-beauty-rose-500 hover:text-beauty-rose-600 text-sm sm:text-base"
                    >
                      Zamknij
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="elegant-card group overflow-hidden relative">
              <div className="relative overflow-hidden">
                <Image
                  src={service3}
                  alt="Manicure magnetyczny"
                  className="w-full h-48 sm:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-beauty-charcoal">
                    Manicure magnetyczny
                  </h3>
                  <button
                    onClick={() =>
                      setActivePopup(
                        activePopup === "magnetic" ? null : "magnetic"
                      )
                    }
                    className="text-beauty-rose-500 hover:text-beauty-rose-600"
                  >
                    <FaInfoCircle size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
                <p className="text-beauty-slate font-medium leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                  Innowacyjna technologia, która zachwyca. Unikalne efekty i
                  wzory.
                </p>
                <button
                  onClick={() =>
                    setActivePopup(
                      activePopup === "magnetic" ? null : "magnetic"
                    )
                  }
                  className="text-beauty-rose-500 font-semibold hover:text-beauty-rose-600 transition-colors flex items-center gap-2 group text-sm sm:text-base"
                >
                  Dowiedz się więcej
                  <FaArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
                </button>
              </div>
              {activePopup === "magnetic" && (
                <div className="absolute inset-0 bg-black/80 p-4 sm:p-6 flex items-center justify-center">
                  <div className="bg-white rounded-elegant p-4 sm:p-6 max-w-sm w-full mx-4">
                    <p className="text-beauty-slate whitespace-pre-line text-sm sm:text-base">
                      {data.magnetic}
                    </p>
                    <button
                      onClick={() => setActivePopup(null)}
                      className="mt-3 sm:mt-4 text-beauty-rose-500 hover:text-beauty-rose-600 text-sm sm:text-base"
                    >
                      Zamknij
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
