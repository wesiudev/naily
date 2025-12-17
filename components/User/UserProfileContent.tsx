"use client";
import Image from "next/image";
import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
  FaClock,
  FaTag,
  FaImages,
  FaStar,
  FaCalendarAlt,
  FaUser,
  FaBuilding,
  FaGem,
} from "react-icons/fa";
import { MdSpa } from "react-icons/md";
import { FaUserNinja } from "react-icons/fa6";
import { User, IService } from "@/types";
import ReservationButton from "@/app/zarezerwuj/[slug]/ReservationButton";
import ReservationModal from "@/app/zarezerwuj/[slug]/ReservationModal";
import OpinionsSection from "@/components/User/OpinionsSection";

interface UserProfileContentProps {
  user: User;
  portfolio: Array<{ id: string; url?: string; title?: string }>;
  variant?: "popup" | "fullpage";
  showContact?: boolean;
}

// Export hero section as separate component
export function UserProfileHero({ 
  user,
  portfolio = [],
  variant = "popup",
  onReservationOpen,
}: { 
  user: User;
  portfolio?: Array<{ id: string; url?: string; title?: string }>;
  variant?: "popup" | "fullpage";
  onReservationOpen?: () => void;
}) {
  const isFullPage = variant === "fullpage";
  const isIndividualSpecialist = user.seek === true;
  const isSalon = user.seek === false;
  
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden transition-all duration-300 hover:shadow-xl ${
        isFullPage ? "mb-8" : "mb-6"
      }`}
    >
      {/* Featured Image Banner - Show first portfolio image or gradient */}
      {portfolio.length > 0 && isFullPage && (
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-purple-50 via-blue-50 to-purple-50 overflow-hidden">
          <Image
            src={portfolio[0].url || ""}
            alt={`${user.name} featured`}
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}
      
      <div className={`p-6 md:p-8 ${isFullPage && portfolio.length > 0 ? "pt-8 md:pt-12" : ""}`}>
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Avatar */}
          <div className={`relative shrink-0 ${isFullPage && portfolio.length > 0 ? "-mt-16 md:-mt-20" : ""}`}>
            <div className="relative">
              <Image
                src={user.logo || "/default-user.png"}
                alt={user.name}
                width={160}
                height={160}
                className={`${
                  isFullPage
                    ? "w-32 h-32 md:w-40 md:h-40"
                    : "w-28 h-28 md:w-32 md:h-32"
                } rounded-full object-cover border-4 border-white shadow-xl`}
              />
              {(user?.subscription?.status === "active" ||
                user?.premiumActive ||
                user?.active) && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-2 shadow-lg">
                  <FaCheckCircle className="w-5 h-5" />
                </div>
              )}
              {user?.premiumActive && (
                <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1.5 shadow-lg">
                  <FaGem className="w-4 h-4 text-yellow-900" />
                </div>
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 mt-4 md:mt-0">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className={`font-baloo font-bold text-neutral-900 break-words w-full sm:w-auto ${
                isFullPage
                  ? "text-2xl md:text-3xl"
                  : "text-xl md:text-2xl"
              }`}>
                {user.name}
              </h1>
              {user.emailVerified && (
                <FaCheckCircle
                  className="text-blue-600 w-6 h-6 flex-shrink-0"
                  title="Zweryfikowany email"
                />
              )}
            </div>
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {isIndividualSpecialist ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 text-purple-700 px-4 py-1.5 text-sm font-poppins font-medium">
                  <FaUserNinja className="w-4 h-4" />
                  Specjalistka
                </span>
              ) : isSalon ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 text-blue-700 px-4 py-1.5 text-sm font-poppins font-medium">
                  <MdSpa className="w-4 h-4" />
                  Salon
                </span>
              ) : null}
              
              {user?.premiumActive && (
                <span className="inline-flex items-center rounded-full bg-yellow-100 text-yellow-800 px-4 py-1.5 text-sm font-poppins font-medium">
                  Premium
                </span>
              )}
              
              {user?.seek && (
                <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 px-4 py-1.5 text-sm font-poppins font-medium">
                  Przyjmuje nowe klientki
                </span>
              )}
            </div>
            
            {/* Location */}
            {user.location?.address && (
              <div className="flex items-start gap-2 text-sm md:text-base text-neutral-600 mb-4 font-poppins">
                <FaMapMarkerAlt className="text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="break-words">{user.location.address}</span>
              </div>
            )}
            
            {/* Stats */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-xl border border-blue-100">
                <FaStar className="text-blue-600 w-4 h-4 flex-shrink-0" />
                <span className="text-blue-700 font-semibold text-sm font-poppins whitespace-nowrap">
                  {user.services?.length || 0} usług
                </span>
              </div>
              {portfolio.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-xl border border-purple-100">
                  <FaImages className="text-purple-600 w-4 h-4 flex-shrink-0" />
                  <span className="text-purple-700 font-semibold text-sm font-poppins whitespace-nowrap">
                    {portfolio.length} zdjęć
                  </span>
                </div>
              )}
              {user.profileComments && user.profileComments.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-xl border border-green-100">
                  <FaStar className="text-green-600 w-4 h-4 flex-shrink-0" />
                  <span className="text-green-700 font-semibold text-sm font-poppins whitespace-nowrap">
                    {user.profileComments.length} opinii
                  </span>
                </div>
              )}
            </div>
            
            {/* Reservation Button */}
            <div className="mt-6">
              <ReservationButton user={user} onModalOpen={onReservationOpen} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export main content section (description, services, portfolio, opinions)
export function UserProfileMainContent({
  user,
  portfolio,
  variant = "popup",
  onServiceClick,
}: {
  user: User;
  portfolio: Array<{ id: string; url?: string; title?: string }>;
  variant?: "popup" | "fullpage";
  onServiceClick?: (service: IService) => void;
}) {
  const isFullPage = variant === "fullpage";
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
  return (
    <>
      {/* Description */}
      {user.description && (
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 md:p-8 mb-6 animate-fade-in">
          <h2 className="font-baloo text-xl md:text-2xl font-bold text-zinc-800 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FaUser className="text-blue-600 w-5 h-5" />
            </div>
            O mnie
          </h2>
          <p className="text-neutral-700 whitespace-pre-line leading-relaxed break-words font-poppins text-sm md:text-base">
            {user.description}
          </p>
        </div>
      )}

      {/* Portfolio Gallery - Prominent Section */}
      {portfolio.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 md:p-8 mb-6 animate-fade-in animation-delay-200">
          <h2 className="font-baloo text-xl md:text-2xl font-bold text-zinc-800 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FaImages className="text-purple-600 w-5 h-5" />
            </div>
            Portfolio ({portfolio.length})
          </h2>
          <div
            className={`grid gap-4 ${
              isFullPage
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-2 md:grid-cols-3"
            }`}
          >
            {portfolio.map((image, index) => (
              <div
                key={index}
                className="relative group cursor-pointer aspect-square overflow-hidden rounded-xl border-2 border-neutral-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image.url || ""}
                  alt={image.title || `Portfolio ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {image.title && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <p className="text-white text-sm font-medium font-poppins text-center w-full line-clamp-2">
                      {image.title}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Image Modal */}
          {selectedImage !== null && (
            <div
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-w-4xl max-h-[90vh] w-full">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300"
                >
                  ✕
                </button>
                <Image
                  src={portfolio[selectedImage].url || ""}
                  alt={portfolio[selectedImage].title || `Portfolio ${selectedImage + 1}`}
                  width={1200}
                  height={1200}
                  className="w-full h-auto rounded-lg"
                />
                {portfolio[selectedImage].title && (
                  <p className="text-white text-center mt-4 font-poppins text-lg">
                    {portfolio[selectedImage].title}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Services */}
      {!!user.services?.length && (
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 md:p-8 mb-6 animate-fade-in animation-delay-400">
          <h2 className="font-baloo text-xl md:text-2xl font-bold text-zinc-800 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FaStar className="text-green-600 w-5 h-5" />
            </div>
            Oferowane usługi ({user.services.length})
          </h2>
          <div className="grid gap-4">
            {user.services.map((service) => (
              <div
                key={service.flatten_name}
                onClick={() => onServiceClick?.(service)}
                className={`border-2 border-neutral-200 rounded-xl p-4 md:p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-300 bg-white group ${
                  onServiceClick ? "cursor-pointer" : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-baloo text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors break-words">
                      {service.real_name}
                    </h3>
                    {service.description && (
                      <p className="text-sm text-neutral-600 mt-2 break-words font-poppins leading-relaxed line-clamp-2">
                        {service.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-2 flex-shrink-0">
                    {typeof service.price === "number" && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-xl border border-blue-100">
                        <FaTag className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-blue-700 font-bold text-base font-poppins whitespace-nowrap">
                          {service.price} zł
                        </span>
                      </div>
                    )}
                    {service.duration && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 rounded-xl border border-neutral-100">
                        <FaClock className="w-4 h-4 text-neutral-600 flex-shrink-0" />
                        <span className="text-neutral-700 font-semibold text-sm font-poppins whitespace-nowrap">
                          {service.duration} min
                        </span>
                      </div>
                    )}
                    {onServiceClick && (
                      <>
                        <div className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold text-xs font-poppins opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          <FaCalendarAlt className="w-3 h-3" />
                          <span>Zarezerwuj</span>
                        </div>
                        <div className="sm:hidden flex items-center gap-2 text-blue-600 font-semibold text-xs font-poppins">
                          <FaCalendarAlt className="w-3 h-3" />
                          <span className="whitespace-nowrap">Kliknij, aby zarezerwować</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opinions */}
      {user.uid && (
        <div className="mb-6 animate-fade-in animation-delay-600">
          <OpinionsSection profileUid={user.uid as string} />
        </div>
      )}
    </>
  );
}

// Export contact section as separate component for sidebar use
export function UserProfileContact({ user }: { user: User }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 animate-fade-in animation-delay-600">
      <h3 className="font-baloo text-lg md:text-xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <FaCalendarAlt className="text-blue-600 w-5 h-5" />
        </div>
        Kontakt i rezerwacja
      </h3>

      <div className="space-y-4">
        {user.phoneNumber && (
          <a
            href={`tel:${user.phoneNumber}`}
            className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-all duration-200 group"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <FaPhone className="w-5 h-5 text-white" />
            </div>
            <span className="text-neutral-800 hover:text-blue-700 transition-colors font-semibold font-poppins text-base break-all min-w-0">
              {user.phoneNumber}
            </span>
          </a>
        )}

        {user.email && (
          <a
            href={`mailto:${user.email}`}
            className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100 hover:bg-purple-100 hover:border-purple-200 transition-all duration-200 group"
          >
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <FaEnvelope className="w-5 h-5 text-white" />
            </div>
            <span className="text-neutral-800 hover:text-purple-700 transition-colors font-semibold font-poppins text-base break-all min-w-0">
              {user.email}
            </span>
          </a>
        )}
      </div>
    </div>
  );
}

// Default export - combines all sections for popup use
export default function UserProfileContent({
  user,
  portfolio,
  variant = "popup",
  showContact = true,
  onServiceClick,
}: UserProfileContentProps & { onServiceClick?: (service: IService) => void }) {
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<IService | null>(null);
  
  const handleServiceClick = (service: IService) => {
    setSelectedService(service);
    setIsReservationModalOpen(true);
    // Prevent scrolling on UserSlider when modal opens
    const sliderElement = document.querySelector('[data-user-slider="true"]') as HTMLElement;
    if (sliderElement) {
      sliderElement.style.overflow = "hidden";
      sliderElement.scrollTop = 0;
    }
  };
  
  const handleModalClose = () => {
    setIsReservationModalOpen(false);
    setSelectedService(null);
    // Restore scrolling
    const sliderElement = document.querySelector('[data-user-slider="true"]') as HTMLElement;
    if (sliderElement) {
      sliderElement.style.overflow = "auto";
    }
  };
  
  return (
    <>
      <UserProfileHero 
        user={user} 
        portfolio={portfolio} 
        variant={variant}
        onReservationOpen={() => {
          setIsReservationModalOpen(true);
          const sliderElement = document.querySelector('[data-user-slider="true"]') as HTMLElement;
          if (sliderElement) {
            sliderElement.style.overflow = "hidden";
            sliderElement.scrollTop = 0;
          }
        }}
      />
      <UserProfileMainContent 
        user={user} 
        portfolio={portfolio} 
        variant={variant} 
        onServiceClick={onServiceClick || handleServiceClick}
      />
      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={handleModalClose}
        user={user}
        preselectedService={selectedService}
      />
      {showContact && variant === "popup" && (
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 md:p-8 mb-6">
          <h3 className="font-baloo text-lg md:text-xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FaCalendarAlt className="text-blue-600 w-5 h-5" />
            </div>
            Kontakt i rezerwacja
          </h3>

          <div className="space-y-4">
            {user.phoneNumber && (
              <a
                href={`tel:${user.phoneNumber}`}
                className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <FaPhone className="w-5 h-5 text-white" />
                </div>
                <span className="text-neutral-800 hover:text-blue-700 transition-colors font-semibold font-poppins text-base break-all min-w-0">
                  {user.phoneNumber}
                </span>
              </a>
            )}

            {user.email && (
              <a
                href={`mailto:${user.email}`}
                className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100 hover:bg-purple-100 hover:border-purple-200 transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <FaEnvelope className="w-5 h-5 text-white" />
                </div>
                <span className="text-neutral-800 hover:text-purple-700 transition-colors font-semibold font-poppins text-base break-all min-w-0">
                  {user.email}
                </span>
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
