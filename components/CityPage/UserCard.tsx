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
      className="group bg-white rounded-2xl border border-neutral-200 p-6 md:p-8 hover:shadow-lg transition-all duration-300 text-left cursor-pointer"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side - Avatar and basic info */}
        <div className="flex items-start gap-4 md:gap-6 flex-shrink-0">
          <div className="relative">
            <Image
              src={user.logo || "/default-user.png"}
              alt={user.name}
              width={120}
              height={120}
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-neutral-100"
            />
            {user?.premiumActive && (
              <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                <FaGem className="w-3 h-3 text-yellow-900" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 md:hidden">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="font-baloo text-xl md:text-2xl font-bold text-neutral-900 group-hover:text-blue-700">
                {user.name}
              </h3>
              {isIndividualSpecialist ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 text-purple-700 px-3 py-1 text-xs md:text-sm font-poppins font-medium">
                  <FaUserNinja className="w-3 h-3" />
                  Specjalistka
                </span>
              ) : isSalon ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs md:text-sm font-poppins font-medium">
                  <MdSpa className="w-3 h-3" />
                  Salon
                </span>
              ) : null}
              {user?.seek && (
                <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs md:text-sm font-poppins font-medium">
                  Przyjmuje nowe klientki
                </span>
              )}
            </div>
            {user.location?.address && (
              <div className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
                <FaMapMarkerAlt className="text-blue-600 flex-shrink-0" />
                <span className="truncate">{user.location.address}</span>
              </div>
            )}
            {user.phoneNumber && (
              <div className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
                <FaPhone className="text-blue-600 flex-shrink-0" />
                <span>{user.phoneNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* Center - Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h3 className="font-baloo text-xl md:text-2xl font-bold text-neutral-900 group-hover:text-blue-700 hidden md:block">
              {user.name}
            </h3>
            {isIndividualSpecialist ? (
              <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-purple-100 text-purple-700 px-3 py-1 text-xs font-poppins font-medium">
                <FaUserNinja className="w-3 h-3" />
                Specjalistka
              </span>
            ) : isSalon ? (
              <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs font-poppins font-medium">
                <MdSpa className="w-3 h-3" />
                Salon
              </span>
            ) : null}
            {user?.premiumActive && (
              <span className="hidden md:inline-flex items-center rounded-full bg-yellow-100 text-yellow-800 px-3 py-1 text-xs font-poppins font-medium">
                Premium
              </span>
            )}
            {user?.seek && (
              <span className="hidden md:inline-flex items-center rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-poppins font-medium">
                Przyjmuje nowe klientki
              </span>
            )}
          </div>
          
          {user.location?.address && (
            <div className="hidden md:flex items-center gap-2 text-sm md:text-base text-neutral-600 mb-2">
              <FaMapMarkerAlt className="text-blue-600 flex-shrink-0" />
              <span>{user.location.address}</span>
            </div>
          )}
          
          {user.phoneNumber && (
            <div className="hidden md:flex items-center gap-2 text-sm md:text-base text-neutral-600 mb-3">
              <FaPhone className="text-blue-600 flex-shrink-0" />
              <span>{user.phoneNumber}</span>
            </div>
          )}

          {user.description && (
            <p className="text-sm md:text-base text-neutral-600 mb-4 line-clamp-2 font-poppins">
              {user.description}
            </p>
          )}

          {/* Services List */}
          {user?.services && Array.isArray(user.services) && user.services.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <MdSpa className="text-blue-600" />
                <span className="text-sm font-semibold text-neutral-700 font-poppins">
                  Usługi:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.services.map((service: IService, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-poppins border border-blue-100"
                  >
                    <span>{service.real_name}</span>
                    {service.price > 0 && (
                      <span className="text-xs text-blue-600">
                        ({service.price} zł)
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 font-poppins">
            {portfolioImages.length > 0 && (
              <span className="flex items-center gap-1">
                <FaStar className="text-blue-600" />
                Zdjęcia: <strong className="text-neutral-700">{portfolioImages.length}</strong>
              </span>
            )}
            {user.profileComments && user.profileComments.length > 0 && (
              <span className="flex items-center gap-1">
                Opinie: <strong className="text-neutral-700">{user.profileComments.length}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Right side - Portfolio images preview */}
        {portfolioImages.length > 0 && (
          <div className="flex gap-2 md:gap-3 flex-shrink-0">
            {portfolioImages.slice(0, 3).map((img: { src?: string }, idx: number) => (
              <div
                key={idx}
                className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border border-neutral-200 flex-shrink-0"
              >
                <Image
                  src={img.src || "/default-user.png"}
                  alt={`${user.name} portfolio ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            ))}
            {portfolioImages.length > 3 && (
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center flex-shrink-0">
                <span className="text-xs md:text-sm font-semibold text-neutral-600">
                  +{portfolioImages.length - 3}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

