"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaTimes, FaShoppingBag, FaTag } from "react-icons/fa";
import type { Product } from "./ShopSection";
import Link from "next/link";

// Product Popup Modal Component
function ProductPopup({
  product,
  isOpen,
  onClose,
}: {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const hasDiscount =
    product.compareAtPrice &&
    Number(product.compareAtPrice) > Number(product.price || 0);

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
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-title"
        className={`relative bg-white lg:rounded-3xl w-full h-full lg:max-w-2xl lg:h-[90vh] shadow-2xl transform transition-all duration-300 flex flex-col ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        {/* Header with Image */}
        <div className="relative h-64 lg:h-80 flex-shrink-0">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.imageAlt || product.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
              <FaShoppingBag className="text-neutral-400 text-6xl" />
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-medium hover:bg-white transition-colors"
          >
            <FaTimes className="text-gray-600" />
          </button>

          {/* Discount badge */}
          {hasDiscount && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              <FaTag className="inline mr-1" />
              Promocja
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8">
            {/* Vendor */}
            {product.vendor && (
              <div className="text-sm text-neutral-500 mb-2">
                {product.vendor}
              </div>
            )}

            {/* Title */}
            <h2
              id="product-title"
              className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-4"
            >
              {product.title}
            </h2>

            {/* Product Type */}
            {product.productType && (
              <div className="inline-flex items-center gap-1 bg-primary-50 px-3 py-1 rounded-full text-primary-700 text-sm font-medium mb-4">
                <FaTag className="w-3 h-3" />
                {product.productType}
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                {hasDiscount && (
                  <span className="text-xl text-neutral-400 line-through">
                    {product.compareAtPrice} zł
                  </span>
                )}
                <span className="text-3xl font-bold text-primary-600">
                  {product.price ?? "—"} zł
                </span>
              </div>
              {hasDiscount && (
                <div className="text-sm text-green-600 font-medium mt-1">
                  Oszczędzasz{" "}
                  {(
                    Number(product.compareAtPrice) - Number(product.price || 0)
                  ).toFixed(2)}{" "}
                  zł
                </div>
              )}
            </div>

            {/* Product Description */}
            <div className="space-y-4 mb-6">
              <div className="bg-neutral-50 rounded-2xl p-4">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Opis produktu
                </h3>
                {product.description ? (
                  <div
                    className="text-neutral-600 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html:
                        product.description
                          .replace(/<[^>]*>/g, "")
                          .substring(0, 500) +
                        (product.description.length > 500 ? "..." : ""),
                    }}
                  />
                ) : (
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    Wysokiej jakości produkt do pielęgnacji paznokci. Idealny
                    dla profesjonalistów i użytku domowego. Zapewnia długotrwałe
                    efekty i profesjonalne wykończenie stylizacji.
                  </p>
                )}
              </div>
            </div>

            {/* Product Tags for SEO */}
            {product.tags && (
              <div className="space-y-4 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                  <h3 className="font-semibold text-neutral-900 mb-3">
                    Cechy produktu
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags
                      .split(",")
                      .slice(0, 6)
                      .map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Expert Recommendation Badge */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 px-4 py-2 rounded-2xl">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-medium text-sm">
                  Polecane przez ekspertki
                </span>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4 mb-8">
              <div className="bg-neutral-50 rounded-2xl p-4">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  Dlaczego ekspertki polecają ten produkt?
                </h3>
                <ul className="text-neutral-600 text-sm leading-relaxed space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>
                      Wysokiej jakości składniki zapewniające trwałość
                      stylizacji
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Idealny dla profesjonalistów i użytku domowego</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>
                      Sprawdzona marka zaufana przez stylistki paznokci
                    </span>
                  </li>
                  {product.productType && (
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1">•</span>
                      <span>Kategoria: {product.productType}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions - Fixed at bottom */}
        <div className="flex-shrink-0 p-6 lg:p-8 pt-0 space-y-3 bg-white">
          <div className="text-center py-4 px-6 bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl border border-primary-100">
            <div className="text-lg font-bold text-primary-700 mb-1">
              Sugerowana cena: {product.price ?? "—"} zł
            </div>
            <div className="text-sm text-primary-600">
              Sprawdź dostępność w lokalnych salonach
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 py-3 px-6 rounded-2xl font-medium transition-colors"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openProductPopup = (product: Product) => {
    setSelectedProduct(product);
    setIsPopupOpen(true);
  };

  const closeProductPopup = () => {
    setIsPopupOpen(false);
    setSelectedProduct(null);
  };

  // Carousel removed; we render a responsive grid instead

  if (products.length === 0) {
    return (
      <div className="text-center text-neutral-500 py-8">
        Brak produktów do wyświetlenia.
      </div>
    );
  }

  return (
    <>
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <article key={product.id} className="group">
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://jheetu-7a.myshopify.com/collections/all?sort_by=best-selling&grid=default&page=2"
                onClick={() => openProductPopup(product)}
              >
                <div className="professional-card p-0 cursor-pointer group h-[360px] flex flex-col">
                  {/* Image */}
                  <div className="relative overflow-hidden rounded-t-2xl h-[160px] sm:h-[180px] lg:h-[200px]">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.imageAlt || product.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1200px) 25vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                        <FaShoppingBag className="text-neutral-400 text-3xl" />
                      </div>
                    )}

                    {/* Overlay gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Discount badge */}
                    {product.compareAtPrice &&
                      Number(product.compareAtPrice) >
                        Number(product.price || 0) && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          <FaTag className="inline mr-1" />
                          Promocja
                        </div>
                      )}
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4 lg:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Vendor */}
                      {product.vendor && (
                        <div className="text-xs sm:text-sm text-neutral-500 mb-1">
                          {product.vendor}
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-sm sm:text-base font-semibold text-neutral-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
                        {product.title}
                      </h3>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      {product.compareAtPrice &&
                        Number(product.compareAtPrice) >
                          Number(product.price || 0) && (
                          <span className="text-xs text-neutral-400 line-through">
                            {product.compareAtPrice} zł
                          </span>
                        )}
                      <span className="text-base sm:text-lg border-2 border-black px-2 py-1 rounded-lg bg-black text-white">
                        {product.price ?? "—"} zł
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Product Popup */}
      <ProductPopup
        product={selectedProduct}
        isOpen={isPopupOpen}
        onClose={closeProductPopup}
      />
    </>
  );
}
