"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaStar,
  FaPhone,
  FaGlobe,
  FaClock,
  FaFilter,
} from "react-icons/fa";
import CitySelector from "./CitySelector";
import { useGoogleMapsAPI } from "@/utils/googleMapsLoader";

const mapContainerStyle = {
  width: "100%",
  maxWidth: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 52.2296756,
  lng: 21.0122287,
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

export default function ManicurePlaces({ initialCityName = "Warszawa" }) {
  const { isReady, error } = useGoogleMapsAPI({ libraries: ["places"] });
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapRef, setMapRef] = useState(null);
  const [service, setService] = useState("manicure");
  const [cityName, setCityName] = useState(initialCityName);
  const [showFilters, setShowFilters] = useState(false);

  // Search terms for different manicure services (memoized to keep stable reference)
  const searchTerms = useMemo(
    () => ({
      manicure: [
        "manicure",
        "manicurzystka",
        "salon manicure",
        "manicure studio",
      ],
      pedicure: [
        "pedicure",
        "pedicurzystka",
        "salon pedicure",
        "pedicure studio",
      ],
      nailArt: [
        "nail art",
        "sztuka paznokci",
        "design paznokci",
        "nail design",
      ],
      gel: ["gel nails", "paznokcie żelowe", "manicure żelowy", "gel manicure"],
    }),
    []
  );

  // Get coordinates for a city
  const getCityCoordinates = useCallback(async (city) => {
    if (!window.google) return defaultCenter;

    const geocoder = new window.google.maps.Geocoder();
    return new Promise((resolve) => {
      geocoder.geocode({ address: city }, (results, status) => {
        if (status === "OK" && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng(),
          });
        } else {
          resolve(defaultCenter);
        }
      });
    });
  }, []);

  // Search for places using Google Places API
  const searchPlaces = useCallback(
    async (city, searchTerm) => {
      if (!window.google) return [];

      const service = new window.google.maps.places.PlacesService(mapRef);
      const request = {
        query: `${searchTerm} ${city}`,
        type: "beauty_salon",
        fields: [
          "name",
          "geometry",
          "formatted_address",
          "rating",
          "user_ratings_total",
          "photos",
          "place_id",
        ],
      };

      return new Promise((resolve) => {
        service.textSearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            resolve(results || []);
          } else {
            resolve([]);
          }
        });
      });
    },
    [mapRef]
  );

  // Get place details for isOpen/phone/website
  const getPlaceDetails = useCallback(
    (placeId) => {
      if (!window.google || !mapRef) return Promise.resolve(null);
      const service = new window.google.maps.places.PlacesService(mapRef);
      return new Promise((resolve) => {
        service.getDetails(
          {
            placeId,
            fields: [
              "name",
              "geometry",
              "formatted_address",
              "rating",
              "user_ratings_total",
              "photos",
              "formatted_phone_number",
              "website",
              "opening_hours",
              "place_id",
            ],
          },
          (result, status) => {
            if (
              status === window.google.maps.places.PlacesServiceStatus.OK &&
              result
            ) {
              resolve(result);
            } else {
              resolve(null);
            }
          }
        );
      });
    },
    [mapRef]
  );

  // Load places for a city
  const loadPlaces = useCallback(async () => {
    if (!isReady || !mapRef) return;

    setLoading(true);
    try {
      // Get city coordinates
      const cityCoords = await getCityCoordinates(cityName);
      setMapCenter(cityCoords);

      // Search for different types of manicure services
      const searchTerm = searchTerms[service]?.[0] || "manicure";
      const foundPlaces = await searchPlaces(cityName, searchTerm);

      // Remove duplicates and format places
      const uniquePlaces = foundPlaces.filter(
        (place, index, self) =>
          index === self.findIndex((p) => p.place_id === place.place_id)
      );

      setPlaces(uniquePlaces);
    } catch (error) {
      console.error("Error loading places:", error);
    } finally {
      setLoading(false);
    }
  }, [
    isReady,
    mapRef,
    cityName,
    service,
    getCityCoordinates,
    searchPlaces,
    searchTerms,
  ]);

  // Load places when component mounts or dependencies change
  useEffect(() => {
    if (isReady && mapRef) {
      loadPlaces();
    }
  }, [isReady, mapRef, cityName, service, loadPlaces]);

  // Handle map load
  const onMapLoad = useCallback((map) => {
    setMapRef(map);
  }, []);

  // Handle place selection (fetch details to use opening_hours.isOpen())
  const handlePlaceClick = useCallback(
    async (place) => {
      const details = await getPlaceDetails(place.place_id);
      setSelectedPlace(details || place);
    },
    [getPlaceDetails]
  );

  // Handle service type change
  const handleServiceChange = useCallback((newService) => {
    setService(newService);
    setSelectedPlace(null);
  }, []);

  // Handle city change
  const handleCityChange = useCallback((newCity) => {
    setCityName(newCity);
    setSelectedPlace(null);
  }, []);

  // Get place photo URL
  const getPlacePhoto = (place) => {
    if (place.photos && place.photos.length > 0) {
      return place.photos[0].getUrl({ maxWidth: 300, maxHeight: 200 });
    }
    return null;
  };

  // Format rating stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-yellow-400 opacity-50" />);
    }
    return stars;
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">
          Błąd ładowania mapy. Sprawdź połączenie z internetem.
        </p>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Ładowanie mapy...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Salony Manicure w {cityName}
        </h2>
        <p className="text-gray-600">
          Znajdź najlepsze salony manicure w Twojej okolicy
        </p>
      </div>

      {/* City Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wybierz miasto
          </label>
          <CitySelector
            onCityChange={handleCityChange}
            currentCity={cityName}
          />
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Service Type Selector */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rodzaj usługi
            </label>
            <select
              value={service}
              onChange={(e) => handleServiceChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="manicure">Manicure</option>
              <option value="pedicure">Pedicure</option>
              <option value="nailArt">Nail Art</option>
              <option value="gel">Paznokcie Żelowe</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wyszukaj
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj salonów..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-end">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2"
            >
              <FaFilter className="text-gray-500" />
              <span className="text-gray-700">Filtry</span>
            </button>
          </div>

          {/* Refresh Button */}
          <div className="flex items-end">
            <button
              onClick={loadPlaces}
              disabled={loading}
              className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? "Ładowanie..." : "Odśwież"}
            </button>
          </div>
        </div>

        {/* Additional Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimalna ocena
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="">Wszystkie</option>
                  <option value="4">4+ gwiazdki</option>
                  <option value="4.5">4.5+ gwiazdki</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="">Wszystkie</option>
                  <option value="open">Otwarte teraz</option>
                  <option value="closed">Zamknięte</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sortuj według
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="relevance">Trafność</option>
                  <option value="rating">Ocena</option>
                  <option value="distance">Odległość</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map and Places List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-red-500" />
              Mapa salonów
            </h3>
          </div>
          <div className="relative w-full max-w-full overflow-hidden">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={13}
              options={mapOptions}
              onLoad={onMapLoad}
            >
              {places.map((place) => (
                <Marker
                  key={place.place_id}
                  position={{
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                  }}
                  onClick={() => handlePlaceClick(place)}
                  icon={{
                    url:
                      "data:image/svg+xml;charset=UTF-8," +
                      encodeURIComponent(`
                      <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">
                        <circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"#cf4646\" stroke=\"white\" stroke-width=\"2\"/>
                        <path d=\"M8 12L11 15L16 9\" stroke=\"white\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>
                      </svg>
                    `),
                    scaledSize: new window.google.maps.Size(24, 24),
                  }}
                />
              ))}

              {selectedPlace && (
                <InfoWindow
                  position={{
                    lat: selectedPlace.geometry.location.lat(),
                    lng: selectedPlace.geometry.location.lng(),
                  }}
                  onCloseClick={() => setSelectedPlace(null)}
                >
                  <div className="p-2">
                    <h4 className="font-semibold text-sm">
                      {selectedPlace.name}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {selectedPlace.formatted_address}
                    </p>
                    {selectedPlace.rating && (
                      <div className="flex items-center mt-1">
                        <div className="flex text-yellow-400 text-xs">
                          {renderStars(selectedPlace.rating)}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">
                          ({selectedPlace.user_ratings_total})
                        </span>
                      </div>
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>
        </div>

        {/* Places List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">
              Znalezione salony ({places.length})
            </h3>
          </div>
          <div className="max-h-96 overflow-y-auto overflow-x-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Wyszukiwanie salonów...</p>
              </div>
            ) : places.length === 0 ? (
              <div className="p-8 text-center">
                <FaMapMarkerAlt className="text-4xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Nie znaleziono salonów w tej lokalizacji
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {places
                  .filter(
                    (place) =>
                      searchQuery === "" ||
                      place.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      place.formatted_address
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                  )
                  .map((place) => (
                    <div
                      key={place.place_id}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedPlace?.place_id === place.place_id
                          ? "bg-red-50 border-l-4 border-red-500"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handlePlaceClick(place)}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Place Photo */}
                        <div className="flex-shrink-0">
                          {getPlacePhoto(place) ? (
                            <img
                              src={getPlacePhoto(place)}
                              alt={place.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <FaMapMarkerAlt className="text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Place Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {place.name}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {place.formatted_address}
                          </p>

                          {/* Rating */}
                          {place.rating && (
                            <div className="flex items-center mt-2">
                              <div className="flex text-yellow-400 text-xs">
                                {renderStars(place.rating)}
                              </div>
                              <span className="text-xs text-gray-500 ml-2">
                                {place.rating} ({place.user_ratings_total}{" "}
                                opinii)
                              </span>
                            </div>
                          )}

                          {/* Contact Info (details like phone/website appear after selecting a place) */}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Place Details */}
      {selectedPlace && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start space-x-4">
            {/* Place Photo */}
            <div className="flex-shrink-0">
              {getPlacePhoto(selectedPlace) ? (
                <img
                  src={getPlacePhoto(selectedPlace)}
                  alt={selectedPlace.name}
                  className="w-32 h-24 rounded-lg object-cover"
                />
              ) : (
                <div className="w-32 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                  <FaMapMarkerAlt className="text-gray-400 text-2xl" />
                </div>
              )}
            </div>

            {/* Place Details */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {selectedPlace.name}
              </h3>
              <p className="text-gray-600 mb-3">
                {selectedPlace.formatted_address}
              </p>

              {/* Rating */}
              {selectedPlace.rating && (
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {renderStars(selectedPlace.rating)}
                  </div>
                  <span className="text-gray-600 ml-2">
                    {selectedPlace.rating} ({selectedPlace.user_ratings_total}{" "}
                    opinii)
                  </span>
                </div>
              )}

              {/* Contact and Hours (use opening_hours.isOpen() from details) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedPlace.formatted_phone_number && (
                  <div className="flex items-center">
                    <FaPhone className="text-red-500 mr-2" />
                    <span className="text-gray-700">
                      {selectedPlace.formatted_phone_number}
                    </span>
                  </div>
                )}

                {selectedPlace.website && (
                  <div className="flex items-center">
                    <FaGlobe className="text-red-500 mr-2" />
                    <a
                      href={selectedPlace.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-700 underline"
                    >
                      Odwiedź stronę
                    </a>
                  </div>
                )}

                {selectedPlace.opening_hours &&
                  typeof selectedPlace.opening_hours.isOpen === "function" && (
                    <div className="flex items-center">
                      <FaClock className="text-red-500 mr-2" />
                      <span className="text-gray-700">
                        {selectedPlace.opening_hours.isOpen()
                          ? "Otwarte teraz"
                          : "Zamknięte"}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
