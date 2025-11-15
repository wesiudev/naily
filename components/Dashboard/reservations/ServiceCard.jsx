import React from "react";
import { FaCheck, FaInfoCircle, FaEdit, FaTrash } from "react-icons/fa";
import { MdAttachMoney, MdSchedule } from "react-icons/md";

const ServiceCard = ({
  service,
  index,
  showDetails,
  toggleDetails,
  handleEdit,
  handleDelete,
  getCategoryColor,
}) => {
  // Handle different service formats
  const serviceName = service.real_name || service.name || "Usługa";
  const servicePrice = service.price || 0;
  const serviceDuration = service.duration || 0;
  const serviceDescription = service.description || "";
  const serviceCategory = service.category || "Inne";
  const serviceFeatures = service.features || [];
  const serviceId =
    service.id ||
    `${service.real_name || service.name || "service"}-${service.price || 0}-${
      service.duration || 0
    }-${index}`;
  const isPopular = service.popular || false;
  const isPlaceholder = service.isPlaceholder || false;

  return (
    <div
      key={serviceId}
      className={`bg-white border rounded-elegant p-4 md:p-6 hover:shadow-elegant transition-all ${
        isPopular
          ? "border-beauty-rose-300 ring-2 ring-beauty-rose-100"
          : "border-beauty-rose-200"
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="flex justify-center mb-3 md:mb-4">
          <span className="bg-beauty-rose-500 text-white px-2 md:px-3 py-1 rounded-full text-xs font-medium">
            Popularne
          </span>
        </div>
      )}

      {/* Service Header */}
      <div className="text-center mb-3 md:mb-4">
        <h3 className="text-base md:text-lg font-bold text-beauty-charcoal mb-2">
          {serviceName}
        </h3>
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
            serviceCategory
          )}`}
        >
          {serviceCategory}
        </span>
      </div>

      {/* Price */}
      <div className="text-center mb-3 md:mb-4">
        <div className="flex items-center justify-center gap-1 mb-1">
          <MdAttachMoney className="text-xl md:text-2xl text-beauty-rose-500" />
          <span className="text-2xl md:text-3xl font-bold text-beauty-charcoal">
            {servicePrice}
          </span>
          <span className="text-beauty-slate text-sm md:text-base">zł</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-beauty-slate">
          <MdSchedule className="text-beauty-rose-500" />
          <span>{serviceDuration} min</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs md:text-sm text-beauty-slate text-center mb-3 md:mb-4">
        {serviceDescription}
      </p>

      {/* Features */}
      {serviceFeatures.length > 0 && (
        <div className="space-y-2 mb-3 md:mb-4">
          {serviceFeatures.slice(0, 3).map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-xs md:text-sm"
            >
              <FaCheck className="text-green-500 text-xs" />
              <span className="text-beauty-charcoal">{feature}</span>
            </div>
          ))}
          {serviceFeatures.length > 3 && (
            <button
              onClick={() => toggleDetails(serviceId)}
              className="flex items-center gap-2 text-xs md:text-sm text-beauty-rose-500 hover:text-beauty-rose-600"
            >
              <FaInfoCircle />
              <span>
                {showDetails[serviceId] ? "Ukryj szczegóły" : "Pokaż więcej"}
              </span>
            </button>
          )}
        </div>
      )}

      {/* Expanded Features */}
      {showDetails[serviceId] && serviceFeatures.length > 0 && (
        <div className="border-t border-beauty-rose-100 pt-3 md:pt-4 mt-3 md:mt-4">
          <div className="space-y-2">
            {serviceFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-xs md:text-sm"
              >
                <FaCheck className="text-green-500 text-xs" />
                <span className="text-beauty-charcoal">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-3 md:mt-4">
        <button className="flex-1 bg-beauty-rose-500 text-white py-2 px-3 md:px-4 rounded-elegant hover:bg-beauty-rose-600 transition-colors text-xs md:text-sm">
          Zarezerwuj
        </button>
        {!isPlaceholder && (
          <div className="flex gap-1">
            <button
              onClick={() => handleEdit(service)}
              className="p-2 text-beauty-rose-500 hover:bg-beauty-rose-100 rounded-elegant transition-colors"
              title="Edytuj usługę"
            >
              <FaEdit className="text-sm" />
            </button>
            <button
              onClick={() => handleDelete(service)}
              className="p-2 text-red-500 hover:bg-red-100 rounded-elegant transition-colors"
              title="Usuń usługę"
            >
              <FaTrash className="text-sm" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
