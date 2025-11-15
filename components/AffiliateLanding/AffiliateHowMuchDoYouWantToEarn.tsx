"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  calculateRequirements,
  formatCurrency,
  getMotivationalMessage,
  getTierColor,
  getTierBgColor,
  type TierName,
} from "./affiliateCalculator";

export default function AffiliateHowMuchDoYouWantToEarn() {
  const [monthlyGoal, setMonthlyGoal] = useState(2000);
  const [animatedEarnings, setAnimatedEarnings] = useState(0);
  const [animatedCommission, setAnimatedCommission] = useState(0);
  const [animatedExperts, setAnimatedExperts] = useState(0);
  const [currentTier, setCurrentTier] = useState<TierName>("Starter");

  // Memoize the requirements calculation to prevent unnecessary re-renders
  const requirements = useMemo(
    () => calculateRequirements(monthlyGoal),
    [monthlyGoal]
  );

  // Animate numbers when goal changes
  useEffect(() => {
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const stepDelay = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setAnimatedEarnings(Math.floor(monthlyGoal * easeOutQuart));
      setAnimatedCommission(
        Math.floor(requirements.effectiveCommission * 100 * easeOutQuart)
      );
      setAnimatedExperts(
        Math.floor(requirements.requiredExperts * easeOutQuart)
      );
      setCurrentTier(requirements.tier);

      currentStep++;

      if (currentStep > steps) {
        clearInterval(timer);
        setAnimatedEarnings(monthlyGoal);
        setAnimatedCommission(
          Math.floor(requirements.effectiveCommission * 100)
        );
        setAnimatedExperts(requirements.requiredExperts);
      }
    }, stepDelay);

    return () => clearInterval(timer);
  }, [
    monthlyGoal,
    requirements.effectiveCommission,
    requirements.requiredExperts,
    requirements.tier,
  ]);

  return (
    <div className="relative py-16 lg:py-24 bg-gradient-to-br from-white to-orange-50 overflow-hidden">
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

      <div className="relative z-10 mx-auto w-[90%] lg:w-4/5 xl:w-3/4 2xl:w-2/3">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-6">
            Ile chcesz zarabiać miesięcznie?
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Ustaw swój cel finansowy, a pokażemy Ci, ilu ekspertów potrzebujesz
            zaprosić
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Interactive Calculator */}
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-orange-100">
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-700 mb-4">
                  Twój miesięczny cel finansowy:
                </label>

                {/* Custom Range Slider */}
                <div className="relative mb-6">
                  <input
                    type="range"
                    min="2000"
                    max="320000"
                    step="1000"
                    value={monthlyGoal}
                    onChange={(e) => setMonthlyGoal(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-orange-200 to-yellow-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #ffa920 0%, #ffa920 ${
                        ((monthlyGoal - 2000) / 318000) * 100
                      }%, #f3f4f6 ${
                        ((monthlyGoal - 2000) / 318000) * 100
                      }%, #f3f4f6 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>2 000 PLN</span>
                    <span>320 000 PLN</span>
                  </div>
                </div>

                {/* Animated Goal Display */}
                <div className="text-center py-6">
                  <div className="inline-flex items-center space-x-2 text-4xl lg:text-5xl font-bold golden bg-gradient-to-r rounded-lg from-orange-500 to-yellow-500 bg-clip-text text-transparent p-2">
                    <span className="tabular-nums !text-white">
                      {formatCurrency(animatedEarnings)}
                    </span>
                  </div>
                  <p className="text-lg text-gray-600 mt-2 font-medium">
                    {getMotivationalMessage(monthlyGoal)}
                  </p>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {[2000, 5000, 10000, 15000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setMonthlyGoal(preset)}
                    className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                      monthlyGoal === preset
                        ? "golden text-white transform scale-105 shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700"
                    }`}
                  >
                    {formatCurrency(preset)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Calculations Display */}
          <div className="space-y-6">
            {/* Current Tier Card */}
            <div
              className={`bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border-l-4 border-orange-400 transform transition-all duration-500 hover:scale-105 ${getTierBgColor(
                currentTier
              )}`}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🏆</span>
                Twój poziom partnerski
              </h3>
              <div className="text-center">
                <div
                  className={`text-3xl lg:text-4xl font-bold ${getTierColor(
                    currentTier
                  )}`}
                >
                  {currentTier}
                </div>
                <div className="text-2xl font-bold text-orange-600 mt-2">
                  {animatedCommission}%
                </div>
                <p className="text-sm text-gray-600 font-medium mt-1">
                  Twoja prowizja
                </p>
              </div>
            </div>

            {/* Required Experts Card */}
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border-l-4 border-blue-400 transform transition-all duration-500 hover:scale-105">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">👩‍🎨</span>
                Eksperci do zaproszenia
              </h3>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-blue-600 tabular-nums">
                  {animatedExperts}
                </div>
                <p className="text-sm text-gray-600 font-medium mt-1">
                  Ekspertów potrzebujesz
                </p>
                <div className="mt-3 bg-blue-50 p-3 rounded-xl">
                  <p className="text-sm text-blue-700">
                    ~{Math.ceil(animatedExperts / 30)} ekspertów miesięcznie
                    przez{" "}
                    {Math.ceil(
                      animatedExperts / Math.ceil(animatedExperts / 30)
                    )}{" "}
                    miesięcy
                  </p>
                </div>
              </div>
            </div>

            {/* Yearly Projection Card */}
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border-l-4 border-purple-400 transform transition-all duration-500 hover:scale-105">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🚀</span>
                Projekcja roczna
              </h3>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-purple-600 tabular-nums">
                  {formatCurrency(requirements.yearlyEarnings)}
                </div>
                <p className="text-purple-700 font-medium mt-2">
                  Potencjalny zarobek rocznie
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-8 rounded-3xl text-white shadow-2xl">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Zacznij już dziś! 🏁
            </h3>
            <p className=" font-cocosharp font-light !text-white text-lg mb-6 opacity-90">
              Dołącz do naszego programu partnerskiego i zacznij zarabiać już
              dziś!
            </p>

            <Link
              href="/register?affiliate=true"
              className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Rozpocznij teraz
            </Link>
          </div>
        </div>
      </div>

      {/* Custom slider styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffa920, #ff8f00);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(255, 169, 32, 0.4);
          transition: all 0.3s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 20px rgba(255, 169, 32, 0.6);
        }

        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffa920, #ff8f00);
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(255, 169, 32, 0.4);
        }
      `}</style>
    </div>
  );
}
