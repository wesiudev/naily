"use client";
import React from "react";

type PricingModalProps = {
  onClose: () => void;
  children: React.ReactNode;
};

export default function PricingModal({ onClose, children }: PricingModalProps) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[92] flex items-center justify-center w-screen h-screen bg-black/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pricing-modal-title"
    >
      <div className="max-h-[80vh] w-full max-w-[420px] p-4">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-sm shadow-zinc-800 overflow-hidden"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
