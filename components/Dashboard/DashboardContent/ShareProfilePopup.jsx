"use client";
import { FaTimes } from "react-icons/fa";

export default function ShareProfilePopup({
  isOpen,
  onClose,
  profileUrl,
  onCopy,
  copied,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Udostępnij profil</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Link do Twojego profilu:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={profileUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
            />
            <button
              onClick={onCopy}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                copied
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {copied ? "Skopiowano!" : "Kopiuj"}
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>Skopiuj ten link i udostępnij go klientkom, aby mogły zarezerwować wizytę u Ciebie.</p>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}

