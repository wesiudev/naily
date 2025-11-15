import { FaPercentage, FaStar, FaCrown, FaRocket } from "react-icons/fa";

import { getCommissionRange, getExpertRange } from "./affiliateCalculator";

export default function AffiliateCommission() {
  const tiers = [
    {
      icon: FaPercentage,
      name: "Starter",
      commission: getCommissionRange("Starter"),
      restaurants: getExpertRange("Starter"),
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      features: [
        "Podstawowe linki partnerskie",
        "Panel statystyk",
        "Wypłaty co 2 tygodnie",
      ],
    },
    {
      icon: FaStar,
      name: "Silver",
      commission: getCommissionRange("Silver"),
      restaurants: getExpertRange("Silver"),
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      features: [
        "Wyższe prowizje",
        "Dedykowane kody promocyjne",
        "Priorytetowe wsparcie",
      ],
    },
    {
      icon: FaCrown,
      name: "Gold",
      commission: getCommissionRange("Gold"),
      restaurants: getExpertRange("Gold"),
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      features: [
        "Najwyższe prowizje",
        "Ekskluzywne promocje",
        "Account manager",
        "Bonusy miesięczne",
      ],
      popular: true,
    },
    {
      icon: FaRocket,
      name: "VIP",
      commission: getCommissionRange("VIP"),
      restaurants: getExpertRange("VIP"),
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      features: [
        "Indywidualne ustalenia",
        "Specjalne kampanie",
        "Revenue share",
        "Priorytetowe nowe funkcje",
      ],
    },
  ];

  return (
    <section className="relative py-16 lg:py-24 bg-professional-gradient overflow-hidden animate-fade-in">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-20 right-10 w-36 h-36 rounded-full opacity-5 animate-bounce-gentle"
          style={{
            background: "linear-gradient(135deg, #ffa920 0%, #ff8f00 100%)",
            animationDelay: "0s",
          }}
        ></div>
        <div
          className="absolute bottom-32 left-16 w-28 h-28 opacity-8 rotate-45 animate-bounce-gentle"
          style={{
            background: "linear-gradient(135deg, #ffca28 0%, #ffa920 100%)",
            animationDelay: "1.5s",
          }}
        ></div>
      </div>

      <div className="relative z-10 container">
        {/* Section header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-baloo text-3xl lg:text-4xl xl:text-5xl text-neutral-900 leading-tight mb-6">
            Struktura{" "}
            <span className="professional-text-gradient">prowizji</span>
          </h2>
          <p
            className={`text-lg lg:text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed `}
          >
            Im więcej sprzedajesz, tym wyższe prowizje otrzymujesz. Nasze
            poziomy partnerskie nagradzają najaktywniejszych.
          </p>
        </div>

        {/* Commission tiers */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`group relative p-6 lg:p-8 card-hover ${
                tier.popular ? "transform scale-105" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Popular badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#ffa920] text-white px-4 py-1 rounded-full text-sm font-semibold z-50">
                  Najpopularniejszy
                </div>
              )}

              {/* Glass background */}
              <div
                className={`absolute inset-0 glass rounded-2xl bg-white/60 backdrop-blur-xl border ${
                  tier.borderColor
                } shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105 ${
                  tier.popular ? "border-purple-300" : ""
                }`}
              ></div>

              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Icon container */}
                <div
                  className={`w-16 h-16 ${tier.bgColor} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}
                >
                  <tier.icon className={`${tier.color} text-2xl`} />
                </div>

                {/* Tier name */}
                <h3 className="text-xl lg:text-2xl font-bold text-neutral-900 mb-2">
                  {tier.name}
                </h3>

                {/* Commission rate */}
                <div className="mb-4">
                  <span className="text-3xl lg:text-4xl font-bold text-purple-600">
                    {tier.commission}
                  </span>
                  <p className={`text-neutral-600 text-sm mt-1 `}>
                    {tier.restaurants} Zaproszonych ekspertów
                  </p>
                </div>

                {/* Features list */}
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center gap-3 text-sm text-neutral-700"
                    >
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Tier indicator */}
                <div className={`w-full h-2 ${tier.bgColor} rounded-full`}>
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-rose-500 rounded-full transition-all duration-500 group-hover:w-full"
                    style={{ width: `${(index + 1) * 25}%` }}
                  ></div>
                </div>
              </div>

              {/* Floating decorative elements */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-purple-400 to-rose-500 rounded-full opacity-50 animate-bounce-gentle"></div>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Payment info */}
          <div className="glass bg-white/40 backdrop-blur-xl p-8 lg:p-10 rounded-3xl border border-white/50 shadow-md">
            <h3 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
              <FaPercentage className="text-purple-600" />
              Informacje o wypłatach
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-1">
                  ✓
                </div>
                <p className={`text-neutral-700 `}>
                  <span className="font-semibold">Wypłaty co 2 tygodnie</span> -
                  regularne i przewidywalne przychody
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-1">
                  ✓
                </div>
                <p className={`text-neutral-700 `}>
                  <span className="font-semibold">Bez minimalnych progów</span>{" "}
                  - każda prowizja jest wypłacana
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-1">
                  ✓
                </div>
                <p className={`text-neutral-700 `}>
                  <span className="font-semibold">
                    Transparentne rozliczenia
                  </span>{" "}
                  - śledzisz każdą transakcję
                </p>
              </div>
            </div>
          </div>

          {/* Bonus info */}
          <div className="glass bg-gradient-to-br from-purple-600/10 to-rose-500/10 backdrop-blur-xl p-8 lg:p-10 rounded-3xl border border-purple-200/40 shadow-md">
            <h3 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
              <FaRocket className="text-purple-600" />
              Dodatkowe bonusy
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-1">
                  🎁
                </div>
                <p className={`text-neutral-700 `}>
                  <span className="font-semibold">Bonus za rejestrację</span> -
                  100 zł za pierwsze 10 zamówień
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-1">
                  🏆
                </div>
                <p className={`text-neutral-700 `}>
                  <span className="font-semibold">Nagrody miesięczne</span> -
                  dodatkowe premie dla najlepszych
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-1">
                  📈
                </div>
                <p className={`text-neutral-700 `}>
                  <span className="font-semibold">Promocje sezonowe</span> -
                  zwiększone prowizje w okresach świątecznych
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
