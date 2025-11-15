"use client";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaUsers,
  FaStar,
  FaCalendarAlt,
  FaPhone,
  FaGlobe,
  FaHeart,
} from "react-icons/fa";

export function WebsiteShowcase() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-pink-600 via-purple-600 to-pink-700 rounded-lg p-8 text-white">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Znajdź najlepsze salony manicure w swojej okolicy
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Naily to platforma łącząca klientów z profesjonalnymi stylistkami
            paznokci
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <FaSearch className="text-4xl mx-auto mb-4 text-orange-300" />
              <h3 className="text-lg font-semibold mb-2">
                Szybkie wyszukiwanie
              </h3>
              <p className="text-sm opacity-80">
                Znajdź salon w swojej okolicy w kilka sekund
              </p>
            </div>
            <div className="text-center">
              <FaStar className="text-4xl mx-auto mb-4 text-orange-300" />
              <h3 className="text-lg font-semibold mb-2">Sprawdzone opinie</h3>
              <p className="text-sm opacity-80">
                Wybór oparty na prawdziwych recenzjach
              </p>
            </div>
            <div className="text-center">
              <FaCalendarAlt className="text-4xl mx-auto mb-4 text-orange-300" />
              <h3 className="text-lg font-semibold mb-2">Online booking</h3>
              <p className="text-sm opacity-80">
                Rezerwuj wizyty przez internet
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
              <FaMapMarkerAlt className="text-pink-600 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Lokalizacja</h3>
          </div>
          <p className="text-gray-600">
            Znajdź salony manicure w swojej okolicy. Filtruj według odległości,
            ocen i dostępności.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaUsers className="text-purple-600 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Społeczność</h3>
          </div>
          <p className="text-gray-600">
            Dołącz do społeczności stylistek paznokci. Twórz profil i prezentuj
            swoje prace.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaStar className="text-green-600 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Oceny</h3>
          </div>
          <p className="text-gray-600">
            Sprawdź opinie klientów i wybierz najlepszego specjalistę dla
            siebie.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaPhone className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Kontakt</h3>
          </div>
          <p className="text-gray-600">
            Bezpośredni kontakt z salonami. Telefon, email i wiadomości online.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FaGlobe className="text-orange-600 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Portfolio</h3>
          </div>
          <p className="text-gray-600">
            Przeglądaj galerie prac stylistek i znajdź inspirację dla swoich
            paznokci.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <FaHeart className="text-red-600 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Ulubione</h3>
          </div>
          <p className="text-gray-600">
            Zapisz ulubione salony i otrzymuj powiadomienia o nowych ofertach.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Naily w liczbach
          </h3>
          <p className="text-gray-600">
            Społeczność, która rośnie każdego dnia
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-600 mb-2">500+</div>
            <div className="text-sm text-gray-600">
              Zarejestrowanych salonów
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">10k+</div>
            <div className="text-sm text-gray-600">Zadowolonych klientów</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
            <div className="text-sm text-gray-600">Miast w Polsce</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">4.8</div>
            <div className="text-sm text-gray-600">Średnia ocena</div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Co mówią o nas klienci
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              "Świetna platforma! Znalazłam wspaniałą stylistkę w mojej okolicy.
              Profesjonalna obsługa i piękne efekty."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-pink-600 font-semibold">AK</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Anna Kowalska</div>
                <div className="text-sm text-gray-500">Warszawa</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              "Jako stylistka paznokci, Naily pomogła mi dotrzeć do nowych
              klientów. Polecam wszystkim!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold">MK</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Maria Nowak</div>
                <div className="text-sm text-gray-500">Stylistka paznokci</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              "Szybkie wyszukiwanie, czytelne opinie i łatwa rezerwacja. Idealna
              platforma dla miłośników pięknych paznokci."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold">KW</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  Katarzyna Wiśniewska
                </div>
                <div className="text-sm text-gray-500">Kraków</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg p-8 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">Dołącz do Naily</h3>
        <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
          Niezależnie od tego, czy szukasz stylistki paznokci, czy chcesz
          oferować swoje usługi - Naily to miejsce dla Ciebie.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-white text-pink-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
            Znajdź salon
          </button>
          <button className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-pink-600 transition-colors font-semibold">
            Zarejestruj salon
          </button>
        </div>
      </div>
    </div>
  );
}
