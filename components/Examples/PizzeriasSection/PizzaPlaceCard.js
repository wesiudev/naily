import Image from "next/image";
import { FaLocationArrow, FaStar } from "react-icons/fa6";
import { MdLocationPin } from "react-icons/md";

export default function PizzaPlaceCard({ place, onCardClick }) {
  return (
    <div className={`${!place.photos[0] ? "hidden" : ""} px-3`}>
      <button
        onClick={() => onCardClick(place)}
        className="block group w-full text-left cursor-pointer"
      >
        <div className="mb-3 bg-white rounded-2xl lg:rounded-3xl overflow-hidden shadow-large hover:shadow-golden-lg border border-white/20 transition-all duration-300">
          {/* Image container */}
          <div className="relative overflow-hidden">
            <Image
              src={photoUrl}
              alt={`${place.name} - pizzeria`}
              width={400}
              height={300}
              className="w-full h-48 lg:h-56 object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Image overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Rating badge (if available) */}
            {place.rating && (
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-medium">
                <FaStar className="text-yellow-500 text-sm" />
                <span className="font-heading text-sm font-semibold text-gray-800">
                  {place.rating} ({place.user_ratings_total})
                </span>
              </div>
            )}
          </div>

          {/* Content container */}
          <div className="p-6 lg:p-8">
            <div className="space-y-4">
              {/* Restaurant name */}
              <h3 className="font-heading text-lg font-bold text-gray-800 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2">
                {place.name}
              </h3>

              {/* Location */}
              <div className="flex items-center gap-3 text-gray-600">
                <MdLocationPin className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span className="uppercase font-cocosharp font-light text-base lg:text-lg">
                  {place.city}
                </span>
              </div>

              {/* Additional info if available */}
              {place.description && (
                <p className="font-body text-gray-600 text-sm lg:text-base line-clamp-2">
                  {place.description}
                </p>
              )}

              {/* CTA indicator */}
              <div className="flex items-center justify-between pt-2">
                <span className="font-body text-primary-600 font-medium group-hover:text-primary-700 transition-colors duration-300">
                  Zobacz szczegóły
                </span>
                <FaLocationArrow className="w-4 h-4 text-primary-500 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
