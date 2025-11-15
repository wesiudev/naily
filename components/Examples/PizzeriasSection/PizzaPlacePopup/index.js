"use client";
import { useState, useEffect, useRef } from "react";
import PopupHeader from "./PopupHeader";
import PopupContent from "./PopupContent";
import PopupActions from "./PopupActions";

export default function PizzaPlacePopup({ place, isOpen, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";

      // Focus management
      setTimeout(() => {
        if (popupRef.current) {
          const focusableElements = popupRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          }
        }
      }, 100);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = "unset";
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;

      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "Tab") {
        const focusableElements =
          popupRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) || [];

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[15000] flex items-center justify-center lg:p-4 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup Content */}
      <div
        ref={popupRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        className={`overflow-y-scroll relative bg-white lg:rounded-3xl w-full h-full lg:max-w-2xl lg:h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-300 ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        {/* Header with image */}
        <PopupHeader
          place={place}
          onClose={onClose}
          mainPhotoUrl={place.photos[0]}
        />

        {/* Content */}

        <PopupContent place={place} />

        {/* Actions */}
        <PopupActions place={place} />
      </div>
    </div>
  );
}
