/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { useState } from "react";
import {
  FaCalendarCheck,
  FaPhone,
  FaUser,
  FaUserFriends,
  FaArrowRight,
  FaCalendar,
  FaClock,
  FaStar,
  FaCheck,
  FaUsers,
  FaGift,
} from "react-icons/fa";

export default function HowItWorks() {
  const [currentHover, setCurrentHover] = useState<any>(1);
  return (
    <section className="section-padding px-4 sm:px-6 bg-neutral-50">
      <div className="container-professional">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-900 mb-3 sm:mb-4 px-4">
            Jak działają rezerwacje sesji manicure?
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto font-medium leading-relaxed px-4">
            Prosty proces rezerwacji w kilku krokach, który zapewni Ci
            perfekcyjny manicure
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Content Display */}
          <div className="relative">
            <div className="professional-card p-4 sm:p-6 lg:p-8 min-h-[300px] sm:min-h-[400px] flex items-center">
              {howItWorks.map((item: any, i: number) => (
                <div
                  className={`${
                    currentHover === i
                      ? "opacity-100 translate-y-0 duration-500 ease-out"
                      : "opacity-0 translate-y-4 absolute inset-0"
                  } transition-all duration-300`}
                  key={i}
                >
                  <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-600 rounded-full flex items-center justify-center shadow-md">
                        <item.icon className="text-white text-sm sm:text-lg" />
                      </div>
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-neutral-900">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm md:text-base text-neutral-600 mb-4 sm:mb-6 leading-relaxed font-medium">
                      {item.description}
                    </p>

                    {/* Styled Mockup instead of Image */}
                    <div className="relative overflow-hidden rounded-lg bg-neutral-50 border border-neutral-200 p-3 sm:p-4">
                      {item.mockup}
                    </div>

                    <Link
                      href={item.url}
                      className="inline-flex items-center gap-2 sm:gap-3 mt-4 sm:mt-6 text-primary-600 font-semibold hover:text-primary-700 transition-colors group text-xs sm:text-sm"
                    >
                      Dowiedz się więcej
                      <FaArrowRight className="text-xs sm:text-sm transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step Navigation */}
          <div className="space-y-2 sm:space-y-3">
            {howItWorks.map((item: any, i: number) => (
              <button
                key={i}
                onMouseEnter={() => setCurrentHover(i)}
                className={`${
                  currentHover === i
                    ? "bg-primary-600 text-white scale-105 shadow-md"
                    : "bg-white text-neutral-900 hover:bg-neutral-50 border border-neutral-200"
                } w-full p-3 sm:p-4 rounded-md transition-all duration-300 flex items-center gap-2 sm:gap-3 group`}
              >
                <div
                  className={`${
                    currentHover === i ? "bg-white/20" : "bg-primary-100"
                  } w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0`}
                >
                  <span
                    className={`font-bold text-xs sm:text-sm ${
                      currentHover === i
                        ? "text-neutral-900"
                        : "text-primary-600"
                    }`}
                  >
                    {i + 1}
                  </span>
                </div>

                <div className="flex-1 text-left min-w-0">
                  <h4 className="font-semibold text-xs sm:text-sm md:text-base mb-1 truncate">
                    {item.title}
                  </h4>
                  <p
                    className={`text-xs ${
                      currentHover === i ? "text-white/90" : "text-neutral-600"
                    } line-clamp-2 font-medium leading-relaxed`}
                  >
                    {item.description}
                  </p>
                </div>

                <div
                  className={`${
                    currentHover === i
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-2"
                  } transition-all duration-300 flex-shrink-0`}
                >
                  <FaArrowRight className="text-xs sm:text-sm" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const howItWorks = [
  {
    title: "Wybierz termin",
    description:
      "Korzystając z narzędzia dostępnego na stronie, wybierz dzień i godzinę, w którym chcesz zarezerwaować sesję manicure.",
    url: "/rezerwacje",
    icon: FaCalendarCheck,
    mockup: (
      <div className="space-y-2 sm:space-y-3">
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h4 className="font-semibold text-neutral-900 text-xs sm:text-sm">
              Wybierz termin
            </h4>
            <FaCalendar className="text-primary-600 text-xs sm:text-sm" />
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2 sm:mb-3">
            {Array.from({ length: 31 }, (_, i) => (
              <div
                key={i}
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center text-xs ${
                  i === 15
                    ? "bg-primary-600 text-white"
                    : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <div className="flex gap-1 sm:gap-2">
            <div className="flex-1 bg-neutral-100 rounded p-2 text-center text-xs">
              <FaClock className="mx-auto mb-1 text-neutral-600" />
              <span className="text-neutral-600">10:00</span>
            </div>
            <div className="flex-1 bg-primary-100 rounded p-2 text-center text-xs">
              <FaClock className="mx-auto mb-1 text-primary-600" />
              <span className="text-primary-600 font-medium">11:30</span>
            </div>
            <div className="flex-1 bg-neutral-100 rounded p-2 text-center text-xs">
              <FaClock className="mx-auto mb-1 text-neutral-600" />
              <span className="text-neutral-600">13:00</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Wpisz numer telefonu",
    description:
      "Po wybraniu terminu, podaj swój numer telefonu, który będzie połączony z Twoim kontem.",
    url: "/rezerwacje",
    icon: FaPhone,
    mockup: (
      <div className="space-y-2 sm:space-y-3">
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-neutral-200">
          <h4 className="font-semibold text-neutral-900 mb-2 sm:mb-3 text-xs sm:text-sm">
            Dane kontaktowe
          </h4>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 p-2 sm:p-3 bg-neutral-100 rounded-md">
              <FaPhone className="text-primary-600 text-xs sm:text-sm" />
              <input
                type="tel"
                placeholder="+48 123 456 789"
                className="flex-1 bg-transparent border-none outline-none text-neutral-600 text-xs"
                readOnly
              />
            </div>
            <div className="flex items-center gap-2 p-2 sm:p-3 bg-neutral-100 rounded-md">
              <FaUser className="text-primary-600 text-xs sm:text-sm" />
              <input
                type="text"
                placeholder="Imię i nazwisko"
                className="flex-1 bg-transparent border-none outline-none text-neutral-600 text-xs"
                readOnly
              />
            </div>
            <button className="w-full professional-button py-2 font-semibold text-xs">
              Kontynuuj
            </button>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Utwórz konto",
    description:
      "Zarejestruj się, wypełniając formularz prawdziwymi danymi, aby w przyszłości zarządzać swoimi rezerwacjami.",
    url: "/register",
    icon: FaUser,
    mockup: (
      <div className="space-y-2 sm:space-y-3">
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-neutral-200">
          <h4 className="font-semibold text-neutral-900 mb-2 sm:mb-3 text-xs sm:text-sm">
            Utwórz konto
          </h4>
          <div className="space-y-2 sm:space-y-3">
            <div className="p-2 sm:p-3 bg-neutral-100 rounded-md">
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full bg-transparent border-none outline-none text-neutral-600 text-xs"
                readOnly
              />
            </div>
            <div className="p-2 sm:p-3 bg-neutral-100 rounded-md">
              <input
                type="password"
                placeholder="Hasło"
                className="w-full bg-transparent border-none outline-none text-neutral-600 text-xs"
                readOnly
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-600">
              <FaCheck className="text-success-500" />
              <span>Akceptuję regulamin</span>
            </div>
            <button className="w-full professional-button py-2 font-semibold text-xs">
              Zarejestruj się
            </button>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Zarządzaj rezerwacjami",
    description:
      "Po zalogowaniu się na swoje konto, odwołuj i zmieniaj terminy jednym kliknięciem!",
    url: "/register",
    icon: FaCalendarCheck,
    mockup: (
      <div className="space-y-2 sm:space-y-3">
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-neutral-200">
          <h4 className="font-semibold text-neutral-900 mb-2 sm:mb-3 text-xs sm:text-sm">
            Moje rezerwacje
          </h4>
          <div className="space-y-2 sm:space-y-3">
            <div className="p-2 sm:p-3 bg-success-50 border border-success-200 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-success-800 text-xs">
                    Manicure hybrydowy
                  </div>
                  <div className="text-xs text-success-600">
                    15 grudnia, 11:30
                  </div>
                </div>
                <FaCheck className="text-success-500 text-xs sm:text-sm" />
              </div>
            </div>
            <div className="p-2 sm:p-3 bg-primary-50 border border-primary-200 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-primary-800 text-xs">
                    Pedicure klasyczny
                  </div>
                  <div className="text-xs text-primary-600">
                    20 grudnia, 14:00
                  </div>
                </div>
                <FaCalendar className="text-primary-500 text-xs sm:text-sm" />
              </div>
            </div>
            <div className="flex gap-1 sm:gap-2">
              <button className="flex-1 bg-red-500 text-white py-2 rounded-md text-xs font-medium">
                Odwołaj
              </button>
              <button className="flex-1 bg-primary-500 text-white py-2 rounded-md text-xs font-medium">
                Zmień termin
              </button>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Zapraszaj znajomych",
    description:
      "Zapraszaj swoich znajomych i zdobywaj kody promocyjne na następne sesje.",
    url: "/register",
    icon: FaUserFriends,
    mockup: (
      <div className="space-y-2 sm:space-y-3">
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-neutral-200">
          <h4 className="font-semibold text-neutral-900 mb-2 sm:mb-3 text-xs sm:text-sm">
            Zaproś znajomych
          </h4>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-primary-50 rounded-md">
              <FaUsers className="text-primary-600 text-xs sm:text-sm" />
              <div className="flex-1">
                <div className="font-medium text-neutral-900 text-xs">
                  Poleć aplikację
                </div>
                <div className="text-xs text-neutral-600">
                  Otrzymaj 20% zniżki
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 sm:gap-2">
              <div className="p-2 sm:p-3 bg-neutral-100 rounded-md text-center">
                <FaGift className="mx-auto mb-1 text-primary-600 text-xs sm:text-sm" />
                <div className="text-xs font-medium text-neutral-900">
                  Kod promocyjny
                </div>
                <div className="text-xs text-neutral-600">PRZYJACIEL20</div>
              </div>
              <div className="p-2 sm:p-3 bg-neutral-100 rounded-md text-center">
                <FaStar className="mx-auto mb-1 text-warning-500 text-xs sm:text-sm" />
                <div className="text-xs font-medium text-neutral-900">
                  Punkty lojalnościowe
                </div>
                <div className="text-xs text-neutral-600">150 pkt</div>
              </div>
            </div>
            <button className="w-full professional-button py-2 font-semibold text-xs">
              Wyślij zaproszenie
            </button>
          </div>
        </div>
      </div>
    ),
  },
];
