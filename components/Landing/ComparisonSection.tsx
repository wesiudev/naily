"use client";

import Image from "next/image";
import { FaCheck, FaTimes } from "react-icons/fa";

declare global {
  interface Window {
    openLoginRegisterPopup?: (
      _tab?: "login" | "register",
      _accountType?: "salon" | "individual"
    ) => void;
  }
}

export default function ComparisonSection() {
  const go = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/kreator-profilu";
    }
  };
  return (
    <section className="py-20 flex items-center justify-center bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold text-zinc-800 font-baloo mb-6 leading-tight">
            System rezerwacji dla specjalistek
          </h2>
          <p className="font-poppins text-neutral-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Zyskaj dostęp do zaawansowanych funkcji, klientek manicure i
            pedicure w Naily
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* Other Platforms Column */}
          <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden animate-slide-in hover:shadow-xl transition-shadow duration-300">
            <div className="bg-neutral-100 px-6 py-4 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-neutral-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">?</span>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900">
                  Popularne aplikacje rezerwacyjne
                </h3>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <FeatureItem
                  icon={<FaCheck className="text-green-500" />}
                  text="Podstawowe funkcje rezerwacji"
                />
                <FeatureItem
                  icon={<FaCheck className="text-green-500" />}
                  text="Kalendarz terminów"
                />
                <FeatureItem
                  icon={<FaCheck className="text-green-500" />}
                  text="Baza klientów"
                />
                <FeatureItem
                  icon={<FaCheck className="text-green-500" />}
                  text="Standardowe powiadomienia"
                />
                <FeatureItem
                  icon={<FaTimes className="text-orange-500" />}
                  text="Prowizje od rezerwacji"
                />
                <FeatureItem
                  icon={<FaTimes className="text-orange-500" />}
                  text="Ograniczone opcje personalizacji"
                />
                <FeatureItem
                  icon={<FaTimes className="text-orange-500" />}
                  text="Podstawowe narzędzia marketingowe"
                />
                <FeatureItem
                  icon={<FaTimes className="text-orange-500" />}
                  text="Brak specjalizacji branżowej"
                />
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-900 mb-2">
                    Standardowe rozwiązania
                  </div>
                  <div className="text-sm text-neutral-600">
                    z ograniczeniami rozwoju
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Naily Column */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-300 relative">
            {/* Popular Badge */}

            <div className="flex flex-row items-center justify-between rounded-t-2xl bg-gradient-to-r from-blue-100 to-blue-200 px-6 py-4 border-b border-purple-200">
              <div className="flex items-center gap-3">
                <Image
                  src="/naily-logo2.png"
                  alt="Naily Logo"
                  width={100}
                  height={100}
                  className="w-auto h-16"
                />
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <FeatureItem
                  icon={<FaCheck className="text-green-500" />}
                  text="0% prowizji od rezerwacji"
                  highlight
                />
                <FeatureItem
                  icon={<FaCheck className="text-green-500" />}
                  text="Narzędzia marketingowe"
                  highlight
                />
                <FeatureItem
                  icon={<FaCheck className="text-green-500" />}
                  text="Płatności online"
                  highlight
                />
                <FeatureItem
                  icon={<FaCheck className="text-green-500" />}
                  text="Dedykowana obsługa"
                  highlight
                />
                <FeatureItem
                  icon={<FaCheck className="text-green-500" />}
                  text="Zaawansowane ustawienia"
                  highlight
                />
                <FeatureItem
                  icon={<FaCheck className="text-green-500" />}
                  text="Rozwój biznesu"
                  highlight
                />
                <FeatureItem
                  icon={<FaCheck className="text-green-500" />}
                  text="Prowadzenie szkoleń"
                  highlight
                />
              </div>

              <div className="mt-6">
                <button
                  onClick={go}
                  className="w-full bg-blue-600 hover:blue-700 rounded-full text-white font-semibold text-lg px-6 py-3 transition-all duration-200 hover:bg-blue-700"
                >
                  Wypróbuj za darmo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FeatureItemProps {
  icon: React.ReactNode;
  text: string;
  highlight?: boolean;
}

function FeatureItem({ icon, text, highlight = false }: FeatureItemProps) {
  return (
    <div
      className={`flex items-start gap-3 ${
        highlight
          ? "bg-blue-50 -mx-2 px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors duration-200"
          : ""
      }`}
    >
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <span
        className={`text-sm leading-relaxed ${
          highlight
            ? "font-poppins text-neutral-800"
            : "font-inter text-neutral-700"
        }`}
      >
        {text}
      </span>
    </div>
  );
}
