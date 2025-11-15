"use client";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";

export default function DescriptionEditor({
  description,
  isEditing,
  onEdit,
  onCancel,
  value,
  onChange,
  onSave,
}) {
  return (
    <div className="mb-4">
      {!isEditing ? (
        <div 
          onClick={onEdit}
          className="group relative cursor-pointer rounded-lg p-3 transition-all bg-neutral-50/50 hover:bg-neutral-100 active:bg-neutral-200 border border-neutral-200/50 hover:border-neutral-300 touch-manipulation"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-neutral-800 font-poppins leading-relaxed">
                {description || (
                  <span className="text-neutral-500 italic">
                    Kliknij, aby dodać opis swojej działalności...
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="text-neutral-500 hover:text-neutral-700 active:text-neutral-800 transition-colors flex-shrink-0 rounded-md hover:bg-white touch-manipulation"
              aria-label="Edytuj opis"
              title="Edytuj opis"
            >
              <FaEdit className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          <textarea
            className="w-full text-sm border-2 border-blue-300 rounded-lg px-3 py-2.5 font-poppins focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none"
            value={value}
            onChange={onChange}
            rows={3}
            placeholder="Opisz swoją działalność, specjalizację, doświadczenie..."
            maxLength={500}
            autoFocus
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              {value.length}/500
            </span>
            <div className="flex items-center gap-2.5">
              <button
                onClick={onSave}
                className="text-green-600 hover:text-green-700 active:text-green-800 p-2 transition-colors rounded-md hover:bg-green-50 touch-manipulation"
                aria-label="Zapisz"
                title="Zapisz"
              >
                <FaCheck className="w-4 h-4" />
              </button>
              <button
                onClick={onCancel}
                className="text-neutral-500 hover:text-neutral-700 active:text-neutral-800 p-2 transition-colors rounded-md hover:bg-neutral-100 touch-manipulation"
                aria-label="Anuluj"
                title="Anuluj"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

