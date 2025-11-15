"use client";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { FaArrowRight, FaStar, FaGem, FaHeart } from "react-icons/fa";

export default function CtaRegisterButton() {
  const { user } = useSelector((state: RootState) => state.user);

  const go = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/kreator-profilu";
    }
  };

  return (
    <button
      className={`professional-button group px-4 py-2 text-sm font-semibold ${
        user?.uid === "" ? "block" : "hidden"
      }`}
      onClick={go}
    >
      <span className="relative flex items-center gap-2">
        <FaStar className="text-sm" />
        Utwórz profil
        <FaArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
      </span>
    </button>
  );
}

// Professional CTA Section component
export function ShinyCTASection() {
  const go = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/kreator-profilu";
    }
  };

  return (
    <div className="relative overflow-hidden bg-primary-600">
      {/* Content */}
      <div className="relative z-10 px-6 py-12 text-center">
        <div className="container-professional">
          {/* Professional icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <FaGem className="text-2xl text-white" />
            </div>
          </div>

          {/* Main heading */}
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-6 leading-tight">
            Zacznij już dziś swoją
            <span className="block text-white/90">profesjonalną podróż</span>
          </h2>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-white/95 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
            Utwórz profil Salonu Kosmetycznego lub Pojedynczego Specjalisty,
            skonfiguruj listę oferowanych usług i wyświetlaj je w swoim mieście!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              className="professional-button group px-6 py-3 text-sm font-semibold"
              onClick={go}
            >
              <span className="relative flex items-center gap-2">
                <FaHeart className="text-sm" />
                Utwórz profil
                <FaArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
              </span>
            </button>

            <button className="px-6 py-3 text-white border border-white/70 rounded-md font-semibold text-sm transition-all duration-200 hover:bg-white/20 hover:border-white">
              <span className="flex items-center gap-2">
                Dowiedz się więcej
                <FaArrowRight className="text-sm" />
              </span>
            </button>
          </div>

          {/* Professional stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaStar className="text-lg text-white" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">100%</h3>
              <p className="text-white/80 font-medium text-xs">
                Bezpieczeństwo
              </p>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaHeart className="text-lg text-white" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">24/7</h3>
              <p className="text-white/80 font-medium text-xs">Wsparcie</p>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaGem className="text-lg text-white" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Premium</h3>
              <p className="text-white/80 font-medium text-xs">Jakość</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
