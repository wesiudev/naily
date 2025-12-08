"use client";
import { FaCalendar } from "react-icons/fa6";
import { FaCrown } from "react-icons/fa";

interface PremiumExpiredPopupProps {
  isOpen: boolean;
  onClose: () => void;
  isFreemiumExpired: boolean;
  onUpgrade: () => void;
}

export default function PremiumExpiredPopup({
  isOpen,
  onClose,
  isFreemiumExpired,
  onUpgrade,
}: PremiumExpiredPopupProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed w-screen inset-0 z-[300] flex items-center justify-center p-8 bg-black/80 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="premium-expired-title"
    >
      <div className="relative bg-white rounded-xl shadow-xl w-[85%] lg:w-max flex flex-col p-6 lg:p-12 lg:min-w-[768px] max-h-[85vh] overflow-y-auto">
        <div className="absolute top-4 right-4 lg:top-16 lg:right-16">
          <FaCalendar className="text-5xl text-zinc-800/20 rotate-45 lg:text-7xl" />
        </div>
        <h2 className="text-4xl lg:text-6xl font-bold text-zinc-800 mb-3 font-baloo">
          {isFreemiumExpired ? "Okres próbny już się skończył..." : "Twoje Premium wygasło..."}
        </h2>
        <p className="text-sm lg:text-base text-zinc-800 mb-6 lg:mb-12 font-poppins">
          {isFreemiumExpired
            ? "Aby kontynuować korzystanie z funkcji Premium, wykup subskrypcję."
            : "Aby ponownie korzystać z funkcji Premium, odnow subskrypcję."}
        </p>
        <div className="flex flex-col gap-4 lg:gap-6">
          <button
            onClick={onUpgrade}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-bold text-base lg:text-lg flex items-center justify-center gap-3"
          >
            <FaCrown className="text-xl" />
            <span>{isFreemiumExpired ? "Wykup Premium" : "Odnow Premium"}</span>
          </button>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 text-zinc-600 hover:text-zinc-800 rounded-xl hover:bg-zinc-50 transition-all font-medium text-sm lg:text-base"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}

