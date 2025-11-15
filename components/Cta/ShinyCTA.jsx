"use client";
import { FaArrowRight, FaStar, FaUsers, FaMapMarkerAlt } from "react-icons/fa";

export default function ShinyCTA() {
  return (
    <div className="relative overflow-hidden">
      {/* Background with gradient and shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-600 to-pink-600">
        {/* Shine effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-8 py-12 sm:py-16 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Sparkle icon */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative">
              <FaStar className="text-3xl sm:text-4xl text-white animate-pulse" />
              <div className="absolute inset-0 bg-white/20 rounded-full blur-sm animate-ping"></div>
            </div>
          </div>

          {/* Main heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-4">
            Zacznij już dziś
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed font-medium px-4">
            Utwórz profil Salonu Kosmetycznego lub Pojedynczego Specjalisty,
            skonfiguruj listę oferowanych usług i wyświetlaj je w swoim mieście!
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-white">
              <FaUsers className="text-lg sm:text-2xl" />
              <span className="text-sm sm:text-lg font-semibold">
                Społeczność
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-white">
              <FaMapMarkerAlt className="text-lg sm:text-2xl" />
              <span className="text-sm sm:text-lg font-semibold">
                Lokalizacja
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-white">
              <FaStar className="text-lg sm:text-2xl" />
              <span className="text-sm sm:text-lg font-semibold">Oceny</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <button className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-white text-pink-600 rounded-full font-bold text-sm sm:text-base md:text-lg transition-all duration-300 hover:scale-105 hover:bg-gray-50 overflow-hidden shadow-lg w-full sm:w-auto">
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

              <span className="relative flex items-center gap-2 sm:gap-2 justify-center">
                Utwórz profil
                <FaArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
              </span>
            </button>

            <button className="px-6 sm:px-8 py-3 sm:py-4 text-white border-2 border-white/70 rounded-full font-bold text-sm sm:text-base md:text-lg transition-all duration-300 hover:bg-white/20 hover:border-white shadow-lg w-full sm:w-auto">
              <span className="flex items-center gap-2 sm:gap-2 justify-center">
                Dowiedz się więcej
                <FaArrowRight className="text-sm" />
              </span>
            </button>
          </div>

          {/* Floating elements for extra shine */}
          <div className="absolute top-10 left-10 w-2 h-2 bg-white/30 rounded-full animate-bounce"></div>
          <div className="absolute top-20 right-20 w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute bottom-10 right-1/3 w-1 h-1 bg-white/50 rounded-full animate-pulse delay-500"></div>
        </div>
      </div>
    </div>
  );
}

// Alternative version with more subtle shine
export function SubtleShinyCTA() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-purple-600 to-pink-600">
      {/* Subtle shine overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-white/3"></div>

      <div className="relative z-10 px-4 sm:px-8 py-12 sm:py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-4">
            Zacznij już dziś
          </h2>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed font-medium px-4">
            Utwórz profil Salonu Kosmetycznego lub Pojedynczego Specjalisty,
            skonfiguruj listę oferowanych usług i wyświetlaj je w swoim mieście!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <button className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-white text-pink-600 rounded-full font-bold text-sm sm:text-base md:text-lg transition-all duration-300 hover:scale-105 overflow-hidden shadow-lg w-full sm:w-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative flex items-center gap-2 sm:gap-2 justify-center">
                Utwórz profil
                <FaArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
              </span>
            </button>

            <button className="px-6 sm:px-8 py-3 sm:py-4 text-white border-2 border-white/70 rounded-full font-bold text-sm sm:text-base md:text-lg transition-all duration-300 hover:bg-white/20 shadow-lg w-full sm:w-auto">
              <span className="flex items-center gap-2 sm:gap-2 justify-center">
                Dowiedz się więcej
                <FaArrowRight className="text-sm" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Minimal version for integration
export function MinimalShinyCTA() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-600 to-pink-600">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <div className="relative z-10 px-4 sm:px-6 py-8 sm:py-12 text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 px-4">
          Zacznij już dziś
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-white/95 mb-6 sm:mb-8 max-w-2xl mx-auto font-medium px-4">
          Utwórz profil Salonu Kosmetycznego lub Pojedynczego Specjalisty,
          skonfiguruj listę oferowanych usług i wyświetlaj je w swoim mieście!
        </p>

        <button className="group relative px-4 sm:px-6 py-2 sm:py-3 bg-white text-pink-600 rounded-full font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105 overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <span className="relative flex items-center gap-2 justify-center">
            Utwórz profil
            <FaArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
          </span>
        </button>
      </div>
    </div>
  );
}
