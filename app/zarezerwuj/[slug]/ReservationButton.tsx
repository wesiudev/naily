"use client";
import { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { User, IService } from "@/types";
import ReservationModal from "./ReservationModal";

interface ReservationButtonProps {
  user: User;
  preselectedService?: IService | null;
  onModalOpen?: () => void;
}

export default function ReservationButton({ user, preselectedService = null, onModalOpen }: ReservationButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleOpen = () => {
    setIsModalOpen(true);
    onModalOpen?.();
  };

  useEffect(() => {
    if (isModalOpen) {
      // Find the UserSlider scrollable container
      const sliderElement = document.querySelector('[data-user-slider="true"]') as HTMLElement;
      if (sliderElement) {
        // Store scroll position
        const scrollTop = sliderElement.scrollTop;
        // Prevent scrolling
        sliderElement.style.overflow = "hidden";
        // Scroll to top to ensure modal is visible
        sliderElement.scrollTop = 0;
        
        // Restore on cleanup
        return () => {
          sliderElement.style.overflow = "auto";
          sliderElement.scrollTop = scrollTop;
        };
      }
    }
  }, [isModalOpen]);

  return (
    <>
      <button
        onClick={handleOpen}
        className="group relative px-4 py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-poppins font-semibold text-sm md:text-base transition-all duration-200 hover:from-purple-700 hover:to-blue-700 active:scale-95 shadow-md hover:shadow-lg w-full flex items-center justify-center gap-2"
      >
        <FaCalendarAlt className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
        <span>Zarezerwuj wizytę</span>
      </button>

      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        preselectedService={preselectedService}
      />
    </>
  );
}
