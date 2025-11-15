import React from "react";
import { FaClock, FaUser, FaStar, FaInfoCircle } from "react-icons/fa";

const AdditionalInfo = () => {
  return (
    <div className="bg-beauty-rose-50 rounded-elegant p-6">
      <h3 className="text-lg font-bold text-beauty-charcoal mb-4">
        Informacje dodatkowe
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="flex items-start gap-3">
          <FaClock className="text-beauty-rose-500 mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium text-beauty-charcoal">Czas trwania</p>
            <p className="text-beauty-slate">
              Usługi trwają od 20 do 90 minut w zależności od wybranej opcji
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <FaUser className="text-beauty-rose-500 mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium text-beauty-charcoal">Specjaliści</p>
            <p className="text-beauty-slate">
              Wszystkie usługi wykonywane są przez doświadczonych specjalistów
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <FaStar className="text-beauty-rose-500 mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium text-beauty-charcoal">Jakość</p>
            <p className="text-beauty-slate">
              Używamy tylko wysokiej jakości produktów i materiałów
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <FaInfoCircle className="text-beauty-rose-500 mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium text-beauty-charcoal">Rezerwacja</p>
            <p className="text-beauty-slate">
              Zalecamy wcześniejszą rezerwację, szczególnie w weekendy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo;
