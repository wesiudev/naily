"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FaMapMarkerAlt,
  FaGem,
  FaStar,
  FaPhone,
} from "react-icons/fa";
import { MdSpa } from "react-icons/md";
import { FaUserNinja } from "react-icons/fa6";
import { IService } from "@/types";

interface UserCardProps {
  user: {
    uid: string;
    name: string;
    logo?: string;
    userSlugUrl?: string;
    services?: IService[];
    portfolioImages?: unknown[];
    portfolio?: Array<{ url?: string; id?: string; [key: string]: unknown }>;
    premiumActive?: boolean;
    seek?: boolean;
    location?: { address?: string };
    phoneNumber?: string;
    description?: string;
    profileComments?: unknown[];
  };
  cityParam: string;
}

export default function UserCard({ user, cityParam }: UserCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isIndividualSpecialist = user.seek === true;
  const isSalon = user.seek === false;

  // Get portfolio images from either portfolioImages or portfolio field
  const getPortfolioImages = () => {
    if (user.portfolioImages && Array.isArray(user.portfolioImages) && user.portfolioImages.length > 0) {
      return user.portfolioImages.map((img: any) => ({ src: img.src || img.url }));
    }
    if (user.portfolio && Array.isArray(user.portfolio) && user.portfolio.length > 0) {
      return user.portfolio.map((item: any) => ({ src: item.url || item.src }));
    }
    return [];
  };
  const portfolioImages = getPortfolioImages();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const userSlug = user.userSlugUrl || user.uid;
    // Update URL without page refresh
    router.push(`${pathname}?user=${userSlug}`, { scroll: false });
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-xl sm:rounded-2xl border border-neutral-200 p-4 sm:p-5 md:p-6 lg:p-8 hover:shadow-lg transition-all duration-300 text-left cursor-pointer"
    >
      <div className="flex flex-col md:flex-row gap-4 sm:gap-5 md:gap-6">
        {/* Left side - Avatar and basic info */}
        <div className="flex items-start gap-3 sm:gap-4 md:gap-6 flex-shrink-0">
          <div className="relative">
            <Image
              src={user.logo || "/default-user.png"}
              alt={user.name}
              width={120}
              height={120}
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-neutral-100"
            />
            {user?.premiumActive && (
              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-yellow-400 rounded-full p-0.5 sm:p-1">
                <FaGem className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-900" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 md:hidden">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
              <h3 className="font-baloo text-lg sm:text-xl md:text-2xl font-bold text-neutral-900 group-hover:text-blue-700 leading-tight">
                {user.name}
              </h3>
              {isIndividualSpecialist ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 text-purple-700 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-poppins font-medium">
                  <FaUserNinja className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="hidden xs:inline">Specjalistka</span>
                  <span className="xs:hidden">Spec.</span>
                </span>
              ) : isSalon ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-700 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-poppins font-medium">
                  <MdSpa className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  Salon
                </span>
              ) : null}
              {user?.seek && (
                <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-poppins font-medium whitespace-nowrap">
                  <span className="hidden sm:inline">Przyjmuje nowe klientki</span>
                  <span className="sm:hidden">Nowe klientki</span>
                </span>
              )}
            </div>
            {user.location?.address && (
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-neutral-600 mb-1.5 sm:mb-2">
                <FaMapMarkerAlt className="text-blue-600 flex-shrink-0 w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="truncate">{user.location.address}</span>
              </div>
            )}
            {user.phoneNumber && (
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-neutral-600 mb-1.5 sm:mb-2">
                <FaPhone className="text-blue-600 flex-shrink-0 w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="break-all">{user.phoneNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* Center - Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <h3 className="font-baloo text-lg sm:text-xl md:text-2xl font-bold text-neutral-900 group-hover:text-blue-700 hidden md:block leading-tight">
              {user.name}
            </h3>
            {isIndividualSpecialist ? (
              <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-purple-100 text-purple-700 px-2.5 sm:px-3 py-0.5 sm:py-1 text-xs font-poppins font-medium">
                <FaUserNinja className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                Specjalistka
              </span>
            ) : isSalon ? (
              <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-700 px-2.5 sm:px-3 py-0.5 sm:py-1 text-xs font-poppins font-medium">
                <MdSpa className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                Salon
              </span>
            ) : null}
            {user?.premiumActive && (
              <span className="hidden md:inline-flex items-center rounded-full bg-yellow-100 text-yellow-800 px-2.5 sm:px-3 py-0.5 sm:py-1 text-xs font-poppins font-medium">
                Premium
              </span>
            )}
            {user?.seek && (
              <span className="hidden md:inline-flex items-center rounded-full bg-green-100 text-green-700 px-2.5 sm:px-3 py-0.5 sm:py-1 text-xs font-poppins font-medium">
                Przyjmuje nowe klientki
              </span>
            )}
          </div>
          
          {user.location?.address && (
            <div className="hidden md:flex items-center gap-2 text-sm md:text-base text-neutral-600 mb-2">
              <FaMapMarkerAlt className="text-blue-600 flex-shrink-0 w-3.5 h-3.5" />
              <span className="truncate">{user.location.address}</span>
            </div>
          )}
          
          {user.phoneNumber && (
            <div className="hidden md:flex items-center gap-2 text-sm md:text-base text-neutral-600 mb-2 sm:mb-3">
              <FaPhone className="text-blue-600 flex-shrink-0 w-3.5 h-3.5" />
              <span>{user.phoneNumber}</span>
            </div>
          )}

          {user.description && (
            <p className="text-xs sm:text-sm md:text-base text-neutral-600 mb-3 sm:mb-4 line-clamp-2 font-poppins leading-relaxed">
              {user.description}
            </p>
          )}

          {/* Services List */}
          {user?.services && Array.isArray(user.services) && user.services.length > 0 && (
            <div className="mb-3 sm:mb-4">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <MdSpa className="text-blue-600 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-semibold text-neutral-700 font-poppins">
                  Usługi:
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {user.services.map((service: IService, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 bg-blue-50 text-blue-700 rounded-md sm:rounded-lg text-xs sm:text-sm font-poppins border border-blue-100"
                  >
                    <span className="truncate max-w-[120px] sm:max-w-none">{service.real_name}</span>
                    {service.price > 0 && (
                      <span className="text-[10px] sm:text-xs text-blue-600 whitespace-nowrap">
                        ({service.price} zł)
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-neutral-500 font-poppins">
            {user.profileComments && user.profileComments.length > 0 && (
              <span className="flex items-center gap-1">
                Opinie: <strong className="text-neutral-700">{user.profileComments.length}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Right side - Portfolio images preview */}
      </div>
        {portfolioImages.length > 0 && (
          <div className="flex flex-row flex-wrap gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0 justify-end md:justify-start">
            {portfolioImages.slice(0, 20).map((img: { src?: string }, idx: number) => (
              <div
                key={idx}
                className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-md sm:rounded-lg overflow-hidden border border-neutral-200 flex-shrink-0"
              >
                <Image
                  src={img.src || "/default-user.png"}
                  alt={`${user.name} portfolio ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 56px, (max-width: 768px) 64px, 80px"
                  className="object-cover"
                />
              </div>
            ))}
            {portfolioImages.length > 20 && (
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-md sm:rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-neutral-600">
                  +{portfolioImages.length - 20}
                </span>
              </div>
            )}
          </div>
        )}
    </div>
  );
}

