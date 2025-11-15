import React from "react";
import ServiceCard from "./ServiceCard";

const ServiceGrid = ({
  filteredServices,
  showDetails,
  toggleDetails,
  handleEdit,
  handleDelete,
  getCategoryColor,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {filteredServices.map((service, index) => (
        <ServiceCard
          key={index}
          service={service}
          index={index}
          showDetails={showDetails}
          toggleDetails={toggleDetails}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          getCategoryColor={getCategoryColor}
        />
      ))}
    </div>
  );
};

export default ServiceGrid;
