"use client";
import React from "react";

type Feature = { label: string; included?: boolean };

type PricingPlanCardProps = {
  title: string;
  priceLabel: string;
  ctaLabel: string;
  onCta: () => void;
  features: Feature[];
  highlight?: boolean;
  disabled?: boolean;
};

export default function PricingPlanCard({
  title,
  priceLabel,
  ctaLabel,
  onCta,
  features,
  highlight,
  disabled,
}: PricingPlanCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        highlight
          ? "border-primary-300 bg-primary-50"
          : "border-neutral-200 bg-white"
      }`}
    >
      <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
      <p className="text-3xl font-extrabold text-neutral-900 mt-2">
        {priceLabel}
      </p>
      <ul className="mt-4 space-y-2 text-sm text-neutral-700">
        {features.map((f, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                f.included === false ? "bg-neutral-300" : "bg-primary-500"
              }`}
            />
            <span
              className={`${f.included === false ? "text-neutral-400" : ""}`}
            >
              {f.label}
            </span>
          </li>
        ))}
      </ul>
      <button
        onClick={onCta}
        disabled={disabled}
        className={`mt-5 w-full rounded-lg py-2 font-semibold ${
          disabled
            ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
            : "bg-primary-600 text-white hover:bg-primary-700"
        }`}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
