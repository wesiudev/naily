"use client";
import { FaClock, FaTimes, FaCheck } from "react-icons/fa";
import { useState, useEffect } from "react";

const daysOfWeek = [
  { key: "monday", label: "Poniedziałek", short: "Pn" },
  { key: "tuesday", label: "Wtorek", short: "Wt" },
  { key: "wednesday", label: "Środa", short: "Śr" },
  { key: "thursday", label: "Czwartek", short: "Cz" },
  { key: "friday", label: "Piątek", short: "Pt" },
  { key: "saturday", label: "Sobota", short: "Sb" },
  { key: "sunday", label: "Niedziela", short: "Nd" },
];

export default function OpeningHoursPopup({
  isOpen,
  onClose,
  openingHours,
  onSave,
}) {
  const [openingHoursData, setOpeningHoursData] = useState({});

  useEffect(() => {
    if (openingHours) {
      setOpeningHoursData(openingHours);
    } else {
      const defaultHours = {
        monday: { enabled: false, start: "09:00", end: "17:00" },
        tuesday: { enabled: false, start: "09:00", end: "17:00" },
        wednesday: { enabled: false, start: "09:00", end: "17:00" },
        thursday: { enabled: false, start: "09:00", end: "17:00" },
        friday: { enabled: false, start: "09:00", end: "17:00" },
        saturday: { enabled: false, start: "09:00", end: "17:00" },
        sunday: { enabled: false, start: "09:00", end: "17:00" },
      };
      setOpeningHoursData(defaultHours);
    }
  }, [openingHours, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(openingHoursData);
  };

  const handleCancel = () => {
    if (openingHours) {
      setOpeningHoursData(openingHours);
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-[zoomIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaClock className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900 font-poppins">
              Godziny otwarcia
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-neutral-100"
            aria-label="Zamknij"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 pb-4 border-b border-neutral-200">
            <button
              onClick={() => {
                const newData = { ...openingHoursData };
                const weekdayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday"];
                const template = newData["monday"] || { enabled: true, start: "09:00", end: "17:00" };
                weekdayKeys.forEach((key) => {
                  newData[key] = { ...template, enabled: true };
                });
                setOpeningHoursData(newData);
              }}
              className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
            >
              Zastosuj do dni roboczych
            </button>
            <button
              onClick={() => {
                const newData = { ...openingHoursData };
                const weekendKeys = ["saturday", "sunday"];
                const template = newData["saturday"] || { enabled: true, start: "09:00", end: "17:00" };
                weekendKeys.forEach((key) => {
                  newData[key] = { ...template, enabled: true };
                });
                setOpeningHoursData(newData);
              }}
              className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
            >
              Zastosuj do weekendu
            </button>
            <button
              onClick={() => {
                const newData = { ...openingHoursData };
                const allKeys = daysOfWeek.map((d) => d.key);
                const template = newData["monday"] || { enabled: true, start: "09:00", end: "17:00" };
                allKeys.forEach((key) => {
                  newData[key] = { ...template, enabled: true };
                });
                setOpeningHoursData(newData);
              }}
              className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
            >
              Zastosuj do całego tygodnia
            </button>
          </div>

          {/* Days Configuration */}
          <div className="space-y-3">
            {daysOfWeek.map((day) => {
              const dayData = openingHoursData[day.key] || { enabled: false, start: "09:00", end: "17:00" };
              return (
                <div
                  key={day.key}
                  className={`p-4 rounded-lg border transition-all ${
                    dayData.enabled
                      ? "border-blue-300 bg-blue-50/30"
                      : "border-neutral-200 bg-neutral-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dayData.enabled}
                        onChange={(e) => {
                          setOpeningHoursData((prev) => ({
                            ...prev,
                            [day.key]: {
                              ...prev[day.key],
                              enabled: e.target.checked,
                            },
                          }));
                        }}
                        className="w-5 h-5 rounded border-neutral-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className="text-sm font-semibold text-neutral-800 font-poppins">
                        {day.label}
                      </span>
                    </label>
                  </div>

                  {dayData.enabled && (
                    <div className="flex items-center gap-3 transition-all duration-200">
                      <div className="flex-1">
                        <label className="block text-xs text-neutral-600 mb-1.5">
                          Od:
                        </label>
                        <input
                          type="time"
                          value={dayData.start || "09:00"}
                          onChange={(e) => {
                            setOpeningHoursData((prev) => ({
                              ...prev,
                              [day.key]: {
                                ...prev[day.key],
                                start: e.target.value,
                              },
                            }));
                          }}
                          className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-neutral-600 mb-1.5">
                          Do:
                        </label>
                        <input
                          type="time"
                          value={dayData.end || "17:00"}
                          onChange={(e) => {
                            setOpeningHoursData((prev) => ({
                              ...prev,
                              [day.key]: {
                                ...prev[day.key],
                                end: e.target.value,
                              },
                            }));
                          }}
                          className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-neutral-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors"
          >
            Anuluj
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-2"
          >
            <FaCheck className="w-4 h-4" />
            Zapisz godziny
          </button>
        </div>
      </div>
    </div>
  );
}

