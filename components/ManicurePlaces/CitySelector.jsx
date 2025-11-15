"use client";
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";

const popularCities = [
  "Warszawa",
  "Kraków", 
  "Wrocław",
  "Poznań",
  "Gdańsk",
  "Szczecin",
  "Bydgoszcz",
  "Lublin",
  "Katowice",
  "Białystok",
  "Gdynia",
  "Częstochowa",
  "Radom",
  "Sosnowiec",
  "Toruń",
  "Kielce",
  "Gliwice",
  "Zabrze",
  "Bytom",
  "Bielsko-Biała"
];

export default function CitySelector({ onCityChange, currentCity }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCities, setFilteredCities] = useState(popularCities);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCities(popularCities);
    } else {
      const filtered = popularCities.filter(city =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [searchQuery]);

  const handleCitySelect = (city) => {
    onCityChange(city);
    setSearchQuery("");
    setShowDropdown(false);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setShowDropdown(true);
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleInputBlur = () => {
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => setShowDropdown(false), 200);
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <FaMapMarkerAlt className="text-red-500" />
        <div className="relative flex-1">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Wybierz miasto..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredCities.length > 0 ? (
                <div>
                  {filteredCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className="w-full px-4 py-2 text-left hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-2 text-gray-500">
                  Nie znaleziono miasta
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Current City Display */}
        <div className="bg-red-100 text-red-800 px-3 py-2 rounded-md text-sm font-medium">
          {currentCity}
        </div>
      </div>
    </div>
  );
} 