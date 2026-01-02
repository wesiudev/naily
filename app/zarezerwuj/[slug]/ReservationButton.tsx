"use client";
import { FaCalendarAlt } from "react-icons/fa";
import { User, IService } from "@/types";

interface ReservationButtonProps {
  user: User;
  preselectedService?: IService | null;
  onModalOpen?: () => void;
}

export default function ReservationButton({ user, preselectedService = null, onModalOpen }: ReservationButtonProps) {
  const handleOpen = () => {
    // If onModalOpen callback is provided, use it (parent handles modal)
    // Otherwise, this button is used standalone and needs its own modal logic
    if (onModalOpen) {
      onModalOpen();
    } else {
      // Fallback: if no callback, we'd need to handle modal here
      // But for now, we'll just trigger the callback if available
      console.warn("ReservationButton: onModalOpen callback not provided");
    }
  };

  return (
    <button
      onClick={handleOpen}
      className="group relative px-4 py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-poppins font-semibold text-sm md:text-base transition-all duration-200 hover:from-purple-700 hover:to-blue-700 active:scale-95 shadow-md hover:shadow-lg w-full flex items-center justify-center gap-2"
    >
      <FaCalendarAlt className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
      <span>Zarezerwuj wizytę</span>
    </button>
  );
}
