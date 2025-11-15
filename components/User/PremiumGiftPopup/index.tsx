"use client";
import { useDispatch } from "react-redux";
import { FaGift, FaTimes, FaCheckCircle } from "react-icons/fa";

interface PremiumGiftPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PremiumGiftPopup({
  isOpen,
  onClose,
}: PremiumGiftPopupProps) {
  const dispatch = useDispatch();

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 z-[300] flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
      >
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            aria-label="Zamknij"
          >
            <FaTimes className="w-5 h-5" />
          </button>
          <div className="text-5xl mb-3">🎁</div>
          <h2 className="text-2xl font-bold mb-2">Gratulacje!</h2>
          <p className="text-blue-100 text-sm">
            Otrzymałeś prezent od Naily
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
                <FaGift className="text-4xl text-blue-600" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              30 dni Premium za darmo!
            </h3>

            <p className="text-gray-600 mb-6">
              Aktywowaliśmy dla Ciebie 30-dniową subskrypcję Premium. 
              Ciesz się pełnym dostępem do wszystkich funkcji!
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-6">
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    Pełny dostęp do kalendarza
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    Galeria portfolio
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    Zarządzanie usługami
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-yellow-800 text-center">
                <strong>Ważne:</strong> Subskrypcja Premium wygaśnie automatycznie 
                po 30 dniach. Nie będziesz obciążany żadnymi opłatami.
              </p>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 font-semibold transition-all duration-200 shadow-md"
          >
            Rozpocznij korzystanie z Premium
          </button>
        </div>
      </div>
    </div>
  );
}

