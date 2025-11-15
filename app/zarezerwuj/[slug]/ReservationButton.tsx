"use client";
import { useState } from "react";
import { FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import { User } from "@/types";
import ReservationModal from "./ReservationModal";

interface ReservationButtonProps {
  user: User;
}

export default function ReservationButton({ user }: ReservationButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="group relative px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-primary-700 hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto mt-4 flex items-center justify-center"
      >
        <FaCalendarAlt className="text-sm mr-2" />
        Zarezerwuj wizytę
      </button>

      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
      />
    </>
  );
}
