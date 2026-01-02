"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaPlus, FaMinus } from "react-icons/fa6";

export type PricingItem = {
  id: string;
  name: string;
  minPrice: number;
  maxPrice: number;
  description: string;
};

type PricingTableProps = {
  items: PricingItem[];
  className?: string;
};

export default function PricingTable({ items, className }: PricingTableProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId((cur) => (cur === id ? null : id));

  const formatPrice = (min: number, max: number) => {
    if (min === max) {
      return `${min} zł`;
    }
    return `${min} - ${max} zł`;
  };

  return (
    <div className={`w-full ${className || ""}`}>
      <div className="overflow-hidden rounded-lg border border-neutral-200/80 bg-white">
        <div className="divide-y divide-neutral-200/60">
          {items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`pricing-panel-${item.id}`}
                  onClick={() => toggle(item.id)}
                  className="group w-full flex items-center justify-between gap-4 px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 transition-all duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-baloo font-semibold text-base sm:text-lg text-neutral-900 mb-1 group-hover:text-blue-700 transition-colors">
                      {item.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                      {formatPrice(item.minPrice, item.maxPrice)}
                    </span>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      {isOpen ? (
                        <FaMinus className="h-3.5 w-3.5 text-blue-600 transition-colors" />
                      ) : (
                        <FaPlus className="h-3.5 w-3.5 text-blue-600 transition-colors" />
                      )}
                    </div>
                  </div>
                </button>

                <AnimatePresence initial={false} mode="wait">
                  {isOpen && (
                    <motion.div
                      id={`pricing-panel-${item.id}`}
                      key={`panel-${item.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-0">
                        <div className="border-t border-neutral-200/60 pt-4 bg-gradient-to-r from-blue-50/30 via-purple-50/20 to-transparent rounded-b-lg">
                          <p className="text-sm sm:text-base text-neutral-600 font-poppins leading-relaxed pl-3 border-l-2 border-blue-300">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-6 text-neutral-600 font-poppins text-sm text-center">
        * Ceny mogą się różnić w zależności od stylistki, lokalizacji i zakresu usługi. Aktualny cennik znajdziesz na profilu każdej specjalistki.
      </p>
    </div>
  );
}

