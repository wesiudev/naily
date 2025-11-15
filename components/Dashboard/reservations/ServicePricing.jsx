import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { setUser } from "../../../redux/slices/user";
import ServiceCard from "./ServiceCard";
import ServiceForm from "./ServiceForm";
import CategoryFilter from "./CategoryFilter";
import ServiceGrid from "./ServiceGrid";
import AdditionalInfo from "./AdditionalInfo";
import { FaPlus } from "react-icons/fa6";

// Placeholder services data
const placeholderServices = [
  {
    id: "manicure-hybrydowy",
    name: "Manicure hybrydowy",
    price: 80,
    duration: 60,
    description: "Kompletny manicure z lakierem hybrydowym",
    category: "Manicure",
    features: [
      "Przygotowanie płytki",
      "Lakier hybrydowy",
      "Olejek do skórek",
      "Masaż dłoni",
    ],
    popular: true,
    isPlaceholder: true,
  },
  {
    id: "pedicure-klasyczny",
    name: "Pedicure klasyczny",
    price: 120,
    duration: 90,
    description: "Pełny pedicure z pielęgnacją stóp",
    category: "Pedicure",
    features: [
      "Kąpiel stóp",
      "Usunięcie zrogowaciałego naskórka",
      "Przycięcie paznokci",
      "Lakier klasyczny",
    ],
    popular: false,
    isPlaceholder: true,
  },
  {
    id: "manicure-japoński",
    name: "Manicure japoński",
    price: 100,
    duration: 75,
    description: "Intensywna regeneracja dłoni",
    category: "Manicure",
    features: [
      "Masaż regenerujący",
      "Maska parafinowa",
      "Olejki nawilżające",
      "Lakier ochronny",
    ],
    popular: true,
    isPlaceholder: true,
  },
];

// Real user services data
const getUserServices = () => {
  return [
    {
      description: "11",
      duration: 10,
      flatten_name: "dddddd",
      isCustomService: true,
      price: 11,
      real_name: "dddddd",
    },
  ];
};

export default function ServicePricing() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  // State management
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [userServices, setUserServices] = useState(getUserServices());
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    description: "",
    category: "",
    features: [""],
    popular: false,
  });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showDetails, setShowDetails] = useState({});

  // Combine user services with placeholder services
  const allServices = [...userServices, ...placeholderServices];

  // Filter services based on selected category
  const filteredServices =
    selectedCategory === "all"
      ? allServices
      : allServices.filter((service) => service.category === selectedCategory);

  // Get unique categories for filter
  const categories = [
    "all",
    ...new Set(allServices.map((service) => service.category)),
  ];

  // Service categories for form
  const serviceCategories = [
    "Manicure",
    "Pedicure",
    "Regeneracja",
    "Stylizacja",
    "Inne",
  ];

  // Toggle service details
  const toggleDetails = (serviceId) => {
    setShowDetails((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      duration: "",
      description: "",
      category: "",
      features: [""],
      popular: false,
    });
    setEditingService(null);
  };

  // Feature management
  const handleAddFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleFeatureChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) =>
        i === index ? value : feature
      ),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.duration) {
      toast.error("Proszę wypełnić wszystkie wymagane pola");
      return;
    }

    // Create service object that matches IService interface
    const newService = {
      id:
        formData.name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "_")
          .replace(/_+/g, "_")
          .replace(/^_|_$/g, "") +
        "_" +
        Date.now(),
      name: formData.name,
      price: parseInt(formData.price),
      duration: parseInt(formData.duration),
      description: formData.description || "",
      features: formData.features.filter((feature) => feature.trim() !== ""),
      category: formData.category,
      popular: formData.popular,
      isCustomService: true,
    };

    try {
      if (editingService) {
        // Update existing service in user.services array
        const updatedServices =
          user?.services?.map((service, index) =>
            service === editingService ? newService : service
          ) || [];

        // Update user document in Firestore
        await updateDoc(doc(db, "users", user.uid), {
          services: updatedServices,
        });

        // Update Redux state
        dispatch(
          setUser({
            ...user,
            services: updatedServices,
          })
        );

        // Update local state
        setUserServices(updatedServices);
        toast.success("Usługa została zaktualizowana");
      } else {
        // Add new service to user.services array
        const updatedServices = [...(user?.services || []), newService];

        // Update user document in Firestore
        await updateDoc(doc(db, "users", user.uid), {
          services: updatedServices,
        });

        // Update Redux state
        dispatch(
          setUser({
            ...user,
            services: updatedServices,
          })
        );

        // Update local state
        setUserServices(updatedServices);
        toast.success("Usługa została dodana");
      }
      setShowCreateForm(false);
      resetForm();
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Wystąpił błąd podczas zapisywania usługi");
    }
  };

  // Handle service editing
  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.real_name || service.name || "",
      price: service.price?.toString() || "",
      duration: service.duration?.toString() || "",
      description: service.description || "",
      category: service.category || "",
      features: service.features?.length > 0 ? service.features : [""],
      popular: service.popular || false,
    });
    setShowCreateForm(true);
  };

  // Handle service deletion
  const handleDelete = async (serviceToDelete) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tę usługę?")) {
      return;
    }

    try {
      const updatedServices =
        user?.services?.filter((service) => service !== serviceToDelete) || [];

      // Update user document in Firestore
      await updateDoc(doc(db, "users", user.uid), {
        services: updatedServices,
      });

      // Update Redux state
      dispatch(
        setUser({
          ...user,
          services: updatedServices,
        })
      );

      // Update local state
      setUserServices(updatedServices);
      toast.success("Usługa została usunięta");
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Wystąpił błąd podczas usuwania usługi");
    }
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      Manicure: "bg-pink-100 text-pink-800",
      Pedicure: "bg-purple-100 text-purple-800",
      Regeneracja: "bg-green-100 text-green-800",
      Stylizacja: "bg-blue-100 text-blue-800",
      Inne: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.Inne;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-beauty-charcoal mb-2">
            Cennik usług
          </h2>
          <p className="text-beauty-slate">
            Zarządzaj swoimi usługami i cenami
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-beauty-rose-500 text-white px-4 py-2 rounded-elegant hover:bg-beauty-rose-600 transition-colors"
        >
          <FaPlus />
          <span>Dodaj nową usługę</span>
        </button>
      </div>

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Services Grid */}
      <ServiceGrid
        filteredServices={filteredServices}
        showDetails={showDetails}
        toggleDetails={toggleDetails}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        getCategoryColor={getCategoryColor}
      />

      {/* Additional Information */}
      <AdditionalInfo />

      {/* Service Creation Modal */}
      <ServiceForm
        showCreateForm={showCreateForm}
        editingService={editingService}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        handleAddFeature={handleAddFeature}
        handleRemoveFeature={handleRemoveFeature}
        handleFeatureChange={handleFeatureChange}
        serviceCategories={serviceCategories}
        onClose={() => {
          setShowCreateForm(false);
          resetForm();
        }}
      />
    </div>
  );
}
