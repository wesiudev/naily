"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FaStar,
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaBookmark,
  FaPhone,
  FaEnvelope,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { MdLocationOn, MdSchedule, MdPerson } from "react-icons/md";
import { toast } from "react-toastify";

// Start with empty favorites; real data should be fetched from backend later
const getUserFavorites = () => [];

export default function FavoritesManager() {
  const { user } = useSelector((state) => state.user);
  const [favorites, setFavorites] = useState(getUserFavorites());
  const [showContactInfo, setShowContactInfo] = useState({});

  const removeFavorite = (specialistId) => {
    setFavorites(
      favorites.filter((specialist) => specialist.id !== specialistId)
    );
    toast.success("Usunięto z ulubionych");
  };

  const handleBookNow = (specialist) => {
    toast.info(`Przekierowywanie do rezerwacji u ${specialist.name}`);
    // In a real app, this would navigate to the booking page
  };

  const toggleContactInfo = (specialistId) => {
    setShowContactInfo((prev) => ({
      ...prev,
      [specialistId]: !prev[specialistId],
    }));
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400 opacity-50" />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  const renderFavoriteCard = (specialist) => (
    <div
      key={specialist.id}
      className="bg-white border border-beauty-rose-200 rounded-elegant p-6 hover:shadow-elegant transition-all"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Profile Section */}
        <div className="flex-shrink-0">
          <div className="relative">
            <img
              src={specialist.profilePicture}
              alt={specialist.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-beauty-rose-200"
            />
            <button
              onClick={() => removeFavorite(specialist.id)}
              className="absolute -top-2 -right-2 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
              title="Usuń z ulubionych"
            >
              <FaHeart className="text-red-500 text-sm" />
            </button>
          </div>
        </div>

        {/* Main Info Section */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="text-xl font-bold text-beauty-charcoal mb-2">
                {specialist.name}
              </h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  {renderStars(specialist.rating)}
                </div>
                <span className="text-sm text-beauty-slate">
                  {specialist.rating} ({specialist.reviewCount} opinii)
                </span>
                <span className="text-sm text-beauty-slate">
                  • {specialist.experience} doświadczenia
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-beauty-slate">Cena</p>
              <p className="font-semibold text-beauty-charcoal text-lg">
                {specialist.priceRange}
              </p>
            </div>
          </div>

          {/* Location and Availability */}
          <div className="flex flex-wrap gap-4 text-sm text-beauty-slate mb-4">
            <div className="flex items-center gap-1">
              <MdLocationOn className="text-beauty-rose-500" />
              <span>{specialist.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <MdSchedule className="text-beauty-rose-500" />
              <span>{specialist.availability}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaUser className="text-beauty-rose-500" />
              <span>Ostatnia wizyta: {specialist.lastVisit}</span>
            </div>
          </div>

          {/* Services */}
          <div className="mb-4">
            <p className="text-sm font-medium text-beauty-charcoal mb-2">
              Usługi:
            </p>
            <div className="flex flex-wrap gap-2">
              {specialist.services.map((service, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-beauty-rose-100 text-beauty-rose-800 text-sm rounded-full"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-beauty-slate mb-4">
            {specialist.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleBookNow(specialist)}
              className="flex-1 bg-beauty-rose-500 text-white py-3 px-6 rounded-elegant hover:bg-beauty-rose-600 transition-colors flex items-center justify-center gap-2"
            >
              <FaBookmark className="text-sm" />
              <span>Zarezerwuj wizytę</span>
            </button>
            <button
              onClick={() => toggleContactInfo(specialist.id)}
              className="flex-1 border border-beauty-rose-200 text-beauty-rose-500 py-3 px-6 rounded-elegant hover:bg-beauty-rose-50 transition-colors flex items-center justify-center gap-2"
            >
              <FaPhone className="text-sm" />
              <span>Kontakt</span>
            </button>
            <button className="flex-1 border border-beauty-rose-200 text-beauty-rose-500 py-3 px-6 rounded-elegant hover:bg-beauty-rose-50 transition-colors flex items-center justify-center gap-2">
              <FaExternalLinkAlt className="text-sm" />
              <span>Zobacz profil</span>
            </button>
          </div>

          {/* Contact Information */}
          {showContactInfo[specialist.id] && (
            <div className="mt-4 p-4 bg-beauty-rose-50 rounded-elegant">
              <h4 className="font-medium text-beauty-charcoal mb-3">
                Informacje kontaktowe:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <FaPhone className="text-beauty-rose-500" />
                  <span className="text-sm">{specialist.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-beauty-rose-500" />
                  <span className="text-sm">{specialist.email}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-beauty-charcoal">
            Ulubione specjalistki
          </h2>
          <p className="text-beauty-slate">
            Szybki dostęp do Twoich ulubionych specjalistek
          </p>
        </div>
        <button
          onClick={() => (window.location.href = "/r/specialists")}
          className="flex items-center gap-2 bg-beauty-rose-500 text-white px-4 py-2 rounded-elegant hover:bg-beauty-rose-600 transition-colors"
        >
          <FaExternalLinkAlt />
          <span>Znajdź więcej</span>
        </button>
      </div>

      {/* Favorites List */}
      <div className="space-y-4">
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <FaHeart className="text-4xl text-beauty-slate mx-auto mb-4" />
            <p className="text-beauty-slate mb-2">
              Nie masz jeszcze ulubionych specjalistek
            </p>
            <p className="text-sm text-beauty-slate mb-4">
              Dodaj specjalistek do ulubionych, aby mieć do nich szybki dostęp
            </p>
            <button
              onClick={() => (window.location.href = "/r/specialists")}
              className="bg-beauty-rose-500 text-white px-6 py-2 rounded-elegant hover:bg-beauty-rose-600 transition-colors"
            >
              Przeglądaj specjalistki
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-beauty-slate">
                Masz {favorites.length} ulubionych specjalistek
              </p>
            </div>
            {favorites.map(renderFavoriteCard)}
          </>
        )}
      </div>

      {/* Quick Actions */}
      {favorites.length > 0 && (
        <div className="bg-beauty-rose-50 rounded-elegant p-6">
          <h3 className="text-lg font-bold text-beauty-charcoal mb-4">
            Szybkie akcje
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 bg-white rounded-elegant hover:shadow-elegant transition-all">
              <FaBookmark className="text-beauty-rose-500" />
              <div className="text-left">
                <p className="font-medium text-beauty-charcoal">
                  Nowa rezerwacja
                </p>
                <p className="text-sm text-beauty-slate">Zarezerwuj wizytę</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 bg-white rounded-elegant hover:shadow-elegant transition-all">
              <FaPhone className="text-beauty-rose-500" />
              <div className="text-left">
                <p className="font-medium text-beauty-charcoal">Kontakt</p>
                <p className="text-sm text-beauty-slate">Skontaktuj się</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 bg-white rounded-elegant hover:shadow-elegant transition-all">
              <FaExternalLinkAlt className="text-beauty-rose-500" />
              <div className="text-left">
                <p className="font-medium text-beauty-charcoal">Więcej</p>
                <p className="text-sm text-beauty-slate">
                  Przeglądaj wszystkich
                </p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
