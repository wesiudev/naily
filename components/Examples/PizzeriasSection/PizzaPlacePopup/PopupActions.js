import { FaLocationArrow, FaPhone, FaGlobe } from "react-icons/fa6";
import { createLinkFromText } from "../../../lib/createLinkFromText";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function PopupActions({ place }) {
  return (
    <div className="px-6 lg:px-8 pb-6 lg:pb-8">
      <div className="space-y-3">
        {/* Primary action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {place.formatted_phone_number && (
            <a
              href={`tel:${place.formatted_phone_number}`}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 text-base lg:text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FaPhone className="w-5 h-5" />
              Zadzwoń
            </a>
          )}
        </div>

        {/* Secondary action buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          {place.website && (
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm lg:text-base shadow-md hover:shadow-lg"
            >
              <FaGlobe className="w-4 h-4" />
              Strona WWW
            </a>
          )}

          {place.formatted_address && (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                place.formatted_address
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm lg:text-base shadow-md hover:shadow-lg"
            >
              <FaMapMarkerAlt className="w-4 h-4" />
              Pokaż na mapie
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
