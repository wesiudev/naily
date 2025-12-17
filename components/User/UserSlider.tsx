"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaTimes,
  FaChevronLeft,
} from "react-icons/fa";
import { User } from "@/types";
import UserProfileContent from "@/components/User/UserProfileContent";

interface UserSliderProps {
  user: User | null;
  portfolio: Array<{ id: string; url?: string; title?: string }>;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserSlider({
  user,
  portfolio,
  isOpen,
  onClose,
}: UserSliderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
      // Remove query parameter from URL
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.delete("user");
      const newUrl = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;
      router.replace(newUrl, { scroll: false });
    }, 300);
  };

  if (!user || !isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black z-[200] transition-opacity duration-300 ${
          isOpen && !isClosing ? "opacity-50" : "opacity-0"
        } ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        onClick={handleClose}
      />

      {/* Slider */}
      <div
        data-user-slider="true"
        className={`fixed top-0 right-0 h-full bg-white z-[201] shadow-2xl transition-transform duration-300 ease-out overflow-y-auto ${
          isOpen && !isClosing
            ? "translate-x-0"
            : "translate-x-full"
        } ${
          // Mobile: fullscreen, Desktop: 3/4 width
          "w-full md:w-3/4 lg:w-1/2"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 z-10 flex items-center justify-between p-4 md:p-6 shadow-sm">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 text-neutral-700 hover:text-neutral-900 transition-colors font-medium"
          >
            <FaChevronLeft className="w-5 h-5 md:hidden" />
            <span className="md:hidden">Wstecz</span>
            <FaTimes className="w-5 h-5 hidden md:block" />
          </button>
          <h2 className="text-lg md:text-xl font-semibold text-neutral-900 flex-1 text-center">
            {user.name}
          </h2>
          <div className="w-16 md:w-12" /> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 lg:p-8">
          <UserProfileContent user={user} portfolio={portfolio} variant="popup" />
        </div>
      </div>
    </>
  );
}

