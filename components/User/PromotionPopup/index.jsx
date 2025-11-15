"use client";
import { useDispatch, useSelector } from "react-redux";
import { setPromotionPopupOpen } from "@/redux/slices/cta";
import { useState } from "react";
import { toast } from "react-toastify";

export default function PromotionPopup() {
  const dispatch = useDispatch();
  const { promotionPopup } = useSelector((state) => state.cta);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    dispatch(setPromotionPopupOpen(false));
  };

  const handleSubscribe = async () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success(
        "Dziękujemy za zainteresowanie! Skontaktujemy się z Tobą wkrótce.",
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
      handleClose();
    }, 2000);
  };

  const handleSkip = () => {
    toast.info("Możesz w każdej chwili wrócić do tej oferty w ustawieniach.", {
      position: "top-right",
      autoClose: 3000,
    });
    handleClose();
  };

  if (!promotionPopup) return null;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-black bg-opacity-50 z-[110] flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden"
      >
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-red-500 to-purple-600 text-white p-6 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-2xl font-bold mb-2">Witamy w Naily!</h2>
          <p className="text-red-100">
            Specjalna oferta dla nowych użytkowników
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Naily Premium - 50% taniej!
            </h3>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-center mb-2">
                <span className="text-3xl font-bold text-green-600">50 zł</span>
                <span className="text-gray-500 ml-2">/ miesiąc</span>
              </div>
              <div className="text-sm text-gray-600 line-through">
                100 zł / miesiąc
              </div>
              <div className="text-xs text-green-600 font-semibold">
                Oszczędzasz 50 zł miesięcznie!
              </div>
            </div>

            <div className="space-y-3 text-left mb-6">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-sm">Nielimitowana liczba usług</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-sm">
                  Priorytetowe wyświetlanie w wynikach
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-sm">Zaawansowane statystyki</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-sm">Wsparcie techniczne 24/7</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-sm">Dedykowany menedżer konta</span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <div className="text-sm text-yellow-800">
                <strong>Oferta ograniczona czasowo!</strong> Tylko dla nowych
                użytkowników. Oferta ważna przez 7 dni od rejestracji.
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-purple-600 text-white rounded-md hover:from-red-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Przetwarzam...
                </div>
              ) : (
                "Aktywuj Premium - 50% taniej!"
              )}
            </button>

            <button
              onClick={handleSkip}
              className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Pomiń ofertę
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              Możesz w każdej chwili anulować subskrypcję w ustawieniach konta
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
