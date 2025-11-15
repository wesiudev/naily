import Image from "next/image";
import {
  FaPhone,
  FaGlobe,
  FaClock,
  FaStar,
  FaMoneyBillWave,
} from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import ImageGallery from "./ImageGallery";
import { useState } from "react";

function getPriceLevel(level) {
  if (!level) return "Brak informacji";
  const levels = [
    { label: "Bardzo tanio" },
    { label: "Tanio" },
    { label: "Umiarkowanie" },
    { label: "Wyższe ceny" },
    { label: "Bardzo drogo" },
  ];
  const idx = Math.max(0, Math.min(level - 1, levels.length - 1));

  return `${levels[idx].label}`;
}

function formatOpeningHours(opening_hours) {
  if (!opening_hours) return "Brak informacji";

  // Polish day names
  const polishDays = {
    Monday: "Poniedziałek",
    Tuesday: "Wtorek",
    Wednesday: "Środa",
    Thursday: "Czwartek",
    Friday: "Piątek",
    Saturday: "Sobota",
    Sunday: "Niedziela",
  };

  if (opening_hours.weekday_text) {
    return (
      <ul className="text-sm text-gray-600 space-y-1">
        {opening_hours.weekday_text.map((line, idx) => {
          // Translate English day names to Polish
          let polishLine = line;
          Object.entries(polishDays).forEach(([english, polish]) => {
            polishLine = polishLine.replace(english, polish);
          });
          return <li key={idx}>{polishLine}</li>;
        })}
      </ul>
    );
  }

  return opening_hours.open_now ? "Otwarte teraz" : "Zamknięte";
}

export default function PopupContent({ place }) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Prefer details if present (from API), fallback to top-level
  const details = place.details || {};
  const name = details.name || place.name;
  const address = details.formatted_address || place.formatted_address;
  const phone = details.formatted_phone_number || place.formatted_phone_number;
  const website = details.website || place.website;
  const opening_hours = details.opening_hours || place.opening_hours;
  const photos = details.photos || place.photos;
  const rating = details.rating || place.rating;
  const user_ratings_total =
    details.user_ratings_total || place.user_ratings_total;
  const price_level = details.price_level || place.price_level;
  const geometry = details.geometry || place.geometry;
  const reviews = details.reviews || place.reviews || [];
  const recentOpinions =
    place.recentOpinions || place.recent_opinions || place.recent_opinion || [];

  // Quixy style: clean, card-like, clear sections, subtle dividers, icons, modern
  return (
    <div className="h-max bg-white rounded-2xl shadow-md p-4">
      {/* Name and rating */}
      <div className="flex flex-col lg:flex-row md:justify-between gap-4 pb-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            {name}
          </h2>
        </div>
        <div className="flex items-center lg:flex-col gap-3">
          <div className="flex flex-row items-center text-nowrap">
            {typeof rating !== "undefined" && (
              <span className="flex items-center gap-1 bg-primary-50 px-3 py-1 rounded-full font-semibold text-primary-700 text-lg">
                <FaStar className="text-yellow-400" />
                {rating}
              </span>
            )}
            {user_ratings_total && (
              <span className="text-gray-500 text-sm">
                ({user_ratings_total} ocen)
              </span>
            )}
          </div>
          {price_level && (
            <span className="flex items-center gap-1 text-green-700 text-base ml-2">
              <FaMoneyBillWave className="w-4 h-4" />
              {getPriceLevel(price_level)}
            </span>
          )}
        </div>
      </div>

      {/* Photo gallery */}
      {photos && photos.length > 0 && (
        <div className="mt-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {photos.map((photo, idx) => {
              return (
                <div
                  key={idx}
                  className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-200 shadow-md hover:shadow-lg"
                  onClick={() => {
                    setSelectedImageIndex(idx);
                    setGalleryOpen(true);
                  }}
                  title="Kliknij aby powiększyć"
                >
                  <Image
                    src={photo.src}
                    alt={`${name} zdjęcie ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                    <div className="opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      <ImageGallery
        images={photos || []}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        initialIndex={selectedImageIndex}
      />

      {/* Contact & info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <FaMapMarkerAlt className="w-5 h-5 text-primary-500 mt-1" />
            <div>
              <span className="block font-medium text-gray-700">Adres</span>
              <span className="text-gray-600 text-sm">
                {address || "Brak informacji"}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FaPhone className="w-5 h-5 text-primary-500 mt-1" />
            <div>
              <span className="block font-medium text-gray-700">Telefon</span>
              <span className="text-gray-600 text-sm">
                {phone || "Brak informacji"}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FaGlobe className="w-5 h-5 text-primary-500 mt-1" />
            <div>
              <span className="block font-medium text-gray-700">
                Strona WWW
              </span>
              {website ? (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 underline text-sm"
                >
                  {website}
                </a>
              ) : (
                <span className="text-gray-600 text-sm">Brak informacji</span>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <FaClock className="w-5 h-5 text-primary-500 mt-1" />
            <div>
              <span className="block font-medium text-gray-700">
                Godziny otwarcia
              </span>
              <div>{formatOpeningHours(opening_hours)}</div>
            </div>
          </div>
          {geometry && geometry.location && (
            <div className="flex items-start gap-3">
              <MdLocationPin className="w-5 h-5 text-primary-500 mt-1" />
              <div>
                <span className="block font-medium text-gray-700">
                  Lokalizacja (mapa)
                </span>
                <a
                  href={`https://maps.google.com/?q=${geometry.location.lat},${geometry.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 underline text-sm"
                >
                  Zobacz na mapie
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent opinions */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-zinc-800 mb-3">
          Ostatnie opinie
        </h3>
        {Array.isArray(recentOpinions) && recentOpinions.length > 0 ? (
          <div className="space-y-4">
            {recentOpinions.slice(0, 5).map((op, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-xl p-4 border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-semibold text-sm">
                      {op.author_name
                        ? op.author_name.charAt(0).toUpperCase()
                        : "U"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-gray-700 text-sm">
                      {op.author_name || "Anonimowy"}
                    </span>
                    {op.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="flex items-center gap-1 text-yellow-500 text-xs">
                          {[...Array(5)].map((_, index) => (
                            <FaStar
                              key={index}
                              className={`w-3 h-3 ${
                                index < op.rating
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </span>
                        <span className="text-gray-400 text-xs ml-2">
                          {op.relative_time_description || "Przed chwilą"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed font-gotham">
                  {op.text}
                </p>
              </div>
            ))}
            {recentOpinions.length > 5 && (
              <div className="text-center pt-2">
                <span className="text-gray-500 text-sm">
                  +{recentOpinions.length - 5} więcej opinii
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-sm">
              <FaStar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Brak opinii na razie.</p>
              <p className="text-xs mt-1">
                Bądź pierwszym, który oceni to miejsce!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
