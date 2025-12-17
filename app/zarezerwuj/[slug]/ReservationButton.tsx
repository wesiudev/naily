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
        className="group relative px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-primary-700 hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto mt-4 flex items-center justify-center"
      >
        <FaCalendarAlt className="text-sm mr-2" />
        Zarezerwuj wizytę
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
