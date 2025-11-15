"use client";
import { useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaTimes,
  FaCheck,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { User, IService } from "@/types";
import Image from "next/image";
import { FaArrowRight, FaEuroSign } from "react-icons/fa6";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export default function ReservationModal({
  isOpen,
  onClose,
  user,
}: ReservationModalProps) {
  const [selectedService, setSelectedService] = useState<IService | null>(null);
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/reservations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            specialistUid: user.uid,
            specialistName: user.name,
            serviceName: selectedService?.real_name || "Konsultacja",
            customerPhone: phone.trim(),
            preferredDate,
            preferredTime,
            notes,
            sourceSlug: user.userSlugUrl,
          }),
        }
      );

      if (!res.ok) throw new Error("Błąd rezerwacji");

      setSuccess(true);
      setPhone("");
      setPreferredDate("");
      setPreferredTime("");
      setNotes("");
      setSelectedService(null);

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    } catch (err) {
      alert("Nie udało się wysłać rezerwacji. Spróbuj ponownie.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheck className="text-2xl text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">
              Rezerwacja wysłana!
            </h3>
            <p className="text-neutral-600">
              Dziękujemy! {user.name} skontaktuje się z Tobą wkrótce pod
              wskazanym numerem.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="text-2xl font-bold text-neutral-900">
                Zarezerwuj wizytę
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
              >
                <FaTimes className="text-neutral-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Specialist Info */}
              <div className="bg-neutral-50 rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <Image
                    src={user.logo || "/default-user.png"}
                    alt={user.name}
                    width={60}
                    height={60}
                    className="w-15 h-15 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-neutral-900">
                      {user.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <FaMapMarkerAlt className="w-3 h-3" />
                      {user.location?.address || "Lokalizacja nieokreślona"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              {user.services?.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-3">
                    Wybierz usługę (opcjonalnie)
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {user.services.map((service) => (
                      <label
                        key={service.flatten_name}
                        className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="radio"
                          name="service"
                          value={service.flatten_name}
                          checked={
                            selectedService?.flatten_name ===
                            service.flatten_name
                          }
                          onChange={() => setSelectedService(service)}
                          className="text-primary-600"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-neutral-900">
                            {service.real_name}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-neutral-600">
                            {typeof service.price === "number" && (
                              <span className="flex items-center gap-1">
                                <FaEuroSign className="w-3 h-3" />
                                {service.price} zł
                              </span>
                            )}
                            {service.duration && (
                              <span className="flex items-center gap-1">
                                <FaClock className="w-3 h-3" />
                                {service.duration} min
                              </span>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Numer telefonu *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Twój numer telefonu"
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
                />
              </div>

              {/* Preferred Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    Preferowana data
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    Preferowana godzina
                  </label>
                  <input
                    type="time"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Dodatkowe informacje
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Dodatkowe informacje, pytania lub uwagi..."
                  rows={3}
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !phone.trim()}
                className="w-full group relative px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-primary-700 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <FaCalendarAlt className="text-sm mr-2" />
                {submitting ? "Wysyłanie..." : "Wyślij prośbę o rezerwację"}
                <FaArrowRight className="text-sm ml-2 transition-transform group-hover:translate-x-1" />
              </button>

              <p className="text-xs text-neutral-500 text-center">
                To jest darmowa prośba o rezerwację. Stylistka skontaktuje się z Tobą wkrótce.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
