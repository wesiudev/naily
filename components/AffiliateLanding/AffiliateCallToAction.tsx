import Link from "next/link";
import {
  FaRocket,
  FaHandshake,
  FaArrowRight,
  FaUsers,
  FaMoneyBillWave,
  FaChartLine,
} from "react-icons/fa";

export default function AffiliateCallToAction() {
  const stats = [
    { icon: FaUsers, number: "1000+", label: "Aktywnych partnerów" },
    { icon: FaMoneyBillWave, number: "500k+", label: "Wypłaconych złotych" },
    { icon: FaChartLine, number: "95%", label: "Zadowolonych partnerów" },
  ];

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden bg-gradient-to-br from-primary-600 to-accent-600">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-16 right-16 w-40 h-40 rounded-full opacity-10 animate-bounce-gentle"
          style={{
            background: "linear-gradient(135deg, #ffa920 0%, #ff8f00 100%)",
            animationDelay: "0s",
          }}
        ></div>
        <div
          className="absolute bottom-20 left-20 w-32 h-32 opacity-15 rotate-45 animate-bounce-gentle"
          style={{
            background: "linear-gradient(135deg, #ffca28 0%, #ffa920 100%)",
            animationDelay: "1s",
          }}
        ></div>
        <div
          className="absolute top-1/3 left-1/3 w-24 h-24 rounded-full opacity-8 animate-bounce-gentle"
          style={{
            background: "linear-gradient(135deg, #ff8f00 0%, #ec7308 100%)",
            animationDelay: "2s",
          }}
        ></div>
        <div
          className="absolute bottom-1/3 right-1/3 w-20 h-20 opacity-12 rotate-12 animate-bounce-gentle"
          style={{
            background: "linear-gradient(135deg, #ffa920 0%, #ffca28 100%)",
            animationDelay: "0.5s",
          }}
        ></div>
      </div>

      <div className="relative z-10 container">
        {/* Main CTA */}
        <div className="text-center mb-12 lg:mb-16">
          {/* Glass container */}
          <div className="glass bg-white/10 backdrop-blur-xl p-8 lg:p-12 xl:p-16 rounded-3xl border border-white/20 shadow-md">
            {/* Rocket icon animation */}
            <div className="flex items-center justify-center mb-8">
              <FaRocket className="text-[#ffa920] text-4xl lg:text-5xl xl:text-6xl animate-bounce-gentle" />
            </div>

            {/* Main heading */}
            <h2 className="font-baloo text-3xl lg:text-4xl xl:text-5xl text-white leading-tight mb-6">
              Gotowi na <span className="text-[#ffa920]">sukces</span>?
            </h2>

            <p
              className={`text-lg lg:text-xl xl:text-2xl !text-white max-w-4xl mx-auto leading-relaxed mb-8`}
            >
              Dołącz do tysięcy zadowolonych partnerów, którzy już zarabiają z
              nami.
              <span className="text-white font-semibold">
                {" "}
                Twoja przygoda z zarabianiem online
              </span>{" "}
              zaczyna się dziś!
            </p>

            {/* Benefits list */}
            <div className="grid sm:grid-cols-3 gap-6 lg:gap-8 mb-10 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#ffa920]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#ffa920] text-xl font-bold">✓</span>
                </div>
                <p className="!text-white text-sm lg:text-base">
                  Rejestracja w 2 minuty
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#ffa920]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#ffa920] text-xl font-bold">✓</span>
                </div>
                <p className="!text-white text-sm lg:text-base">
                  Pierwsze prowizje po tygodniu
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#ffa920]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#ffa920] text-xl font-bold">✓</span>
                </div>
                <p className="!text-white text-sm lg:text-base">
                  Wsparcie 24/7
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6 mb-8">
              <Link
                href="/register?affiliate=true"
                className="group relative inline-flex items-center gap-3 px-10 lg:px-14 py-5 lg:py-6 bg-white text-primary-600 hover:bg-neutral-100 font-heading font-bold text-lg lg:text-xl xl:text-2xl rounded-full transition-all duration-300 ease-out transform hover:scale-105 shadow-md"
              >
                <FaHandshake className="text-xl lg:text-2xl transition-transform duration-300 group-hover:rotate-12" />
                <span className="relative z-10">Dołącz do programu</span>
                <FaArrowRight className="text-xl lg:text-2xl transition-transform duration-300 group-hover:translate-x-1" />

                {/* Button effects */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full pointer-events-none"></div>
              </Link>

              <Link
                href="#jak-to-dziala"
                className="group inline-flex items-center gap-3 px-8 lg:px-10 py-4 lg:py-5 bg-white/20 hover:bg-white/30 !text-white font-heading font-semibold text-lg lg:text-xl rounded-full transition-all duration-300 ease-out transform hover:scale-105 backdrop-blur-sm border border-white/30 hover:border-white/50"
              >
                <span>Zobacz jak to działa</span>
                <FaChartLine className="text-lg lg:text-xl transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Trust indicators */}
            <p className="text-sm !text-white mb-8">
              ✓ Bez opłat rejestracyjnych ✓ Bez ukrytych kosztów ✓ Wypłaty
              gwarantowane
            </p>
          </div>
        </div>

        {/* Success stats */}
        <div className="grid sm:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative text-center"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Glass background */}
              <div className="absolute inset-0 glass rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 transition-all duration-300 group-hover:scale-105"></div>

              {/* Content */}
              <div className="relative z-10 p-6 lg:p-8">
                <stat.icon className="text-white text-3xl lg:text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </h3>
                <p className={`!text-white text-sm lg:text-base `}>
                  {stat.label}
                </p>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Final encouragement */}
        <div className="text-center">
          <p
            className={`text-xl lg:text-2xl !text-white max-w-3xl mx-auto leading-relaxed `}
          >
            <span className="font-semibold">Nie czekaj!</span> Każdy dzień
            zwlekania to utracone możliwości zarobku. Dołącz do nas już dziś i
            zacznij budować swój pasywny dochód.
          </p>
        </div>
      </div>
    </section>
  );
}
