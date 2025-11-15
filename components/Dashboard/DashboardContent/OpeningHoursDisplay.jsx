"use client";
import { FaClock, FaEdit } from "react-icons/fa";

const daysOfWeek = [
  { key: "monday", label: "Poniedziałek", short: "Pn" },
  { key: "tuesday", label: "Wtorek", short: "Wt" },
  { key: "wednesday", label: "Środa", short: "Śr" },
  { key: "thursday", label: "Czwartek", short: "Cz" },
  { key: "friday", label: "Piątek", short: "Pt" },
  { key: "saturday", label: "Sobota", short: "Sb" },
  { key: "sunday", label: "Niedziela", short: "Nd" },
];

function formatHours(start, end) {
  if (!start || !end) return "";
  return `${start} - ${end}`;
}

function hasConfiguredHours(openingHours) {
  return daysOfWeek.some(
    (day) => openingHours[day.key]?.enabled
  );
}

export default function OpeningHoursDisplay({
  openingHours,
  onEdit,
}) {
  const configured = hasConfiguredHours(openingHours || {});

  return (
    <div className="mb-4">
      <div 
        onClick={onEdit}
        className="group relative cursor-pointer rounded-lg p-3 transition-all bg-neutral-50/50 hover:bg-neutral-100 active:bg-neutral-200 border border-neutral-200/50 hover:border-neutral-300 touch-manipulation"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <FaClock className="w-4 h-4 text-neutral-600 flex-shrink-0" />
              <h3 className="text-sm font-semibold text-neutral-800 font-poppins">
                Godziny otwarcia
              </h3>
            </div>
            {configured ? (
              <div className="space-y-1.5">
                {daysOfWeek.map((day) => {
                  const dayData = openingHours[day.key];
                  if (!dayData?.enabled) return null;
                  return (
                    <div
                      key={day.key}
                      className="flex items-center gap-2 text-xs text-neutral-700"
                    >
                      <span className="font-medium min-w-[70px]">
                        {day.label}:
                      </span>
                      <span>
                        {formatHours(dayData.start, dayData.end)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-neutral-500 italic">
                Kliknij, aby skonfigurować godziny otwarcia...
              </p>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="text-neutral-500 hover:text-neutral-700 active:text-neutral-800 transition-colors flex-shrink-0 rounded-md hover:bg-white touch-manipulation"
            aria-label="Edytuj godziny otwarcia"
            title="Edytuj godziny otwarcia"
          >
            <FaEdit className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

