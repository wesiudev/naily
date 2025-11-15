"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Image from "next/image";
import {
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaClock,
  FaMoneyBillWave,
  FaInfoCircle,
  FaCheck,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { FaMagic } from "react-icons/fa";
import { updateUser } from "@/firebase";
import { setUser } from "@/redux/slices/user";
import { FaPlus } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";

// In production we initialize from the logged-in user's services if present

const serviceCategories = [
  "Manicure",
  "Pedicure",
  "Przedłużanie",
  "Naprawa",
  "Stylizacja",
  "Pielęgnacja",
  "Inne",
];

export default function ServiceConfiguration() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    description: "",
    category: "",
    features: [""],
    active: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const generateFlattenName = (realName) =>
    String(realName || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");

  // Get service ID matching PortfolioManager logic
  const getServiceId = (service, index) => {
    if (!user?.services || !Array.isArray(user.services)) return null;
    
    // Find the matching service in user.services by name (real_name or name)
    const userServiceIndex = user.services.findIndex((s) => {
      const userServiceName = s.real_name || s.name || "";
      return userServiceName === service.name;
    });
    
    if (userServiceIndex === -1) return null;
    
    const userService = user.services[userServiceIndex];
    // Match PortfolioManager logic exactly
    const serviceId = userService.id ?? `service_${userServiceIndex}_${(userService.real_name || userService.name || '').replace(/\s+/g, '_')}`;
    return String(serviceId);
  };

  // Get portfolio images linked to a service
  const getServiceImages = (service, index) => {
    if (!user?.portfolio || !Array.isArray(user.portfolio)) return [];
    const serviceId = getServiceId(service, index);
    if (!serviceId) return [];
    
    return user.portfolio.filter((item) => {
      if (!item.serviceIds || !Array.isArray(item.serviceIds)) return false;
      return item.serviceIds.includes(serviceId);
    });
  };

  useEffect(() => {
    if (user?.services && Array.isArray(user.services)) {
      // Normalize to internal shape
      const normalized = user.services.map((s, idx) => ({
        id: s.id ?? idx + 1,
        name: s.real_name || s.name || "",
        price: Number(s.price) || 0,
        duration: Number(s.duration) || 0,
        description: s.description || "",
        category: s.category || "Inne",
        active: s.active ?? true,
        features: Array.isArray(s.features) ? s.features : [],
      }));
      setServices(normalized);
    } else {
      setServices([]);
    }
  }, [user]);

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      duration: "",
      description: "",
      category: "",
      features: [""],
      active: true,
    });
    setEditingService(null);
  };

  const handleAddFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ""],
    });
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      features: newFeatures.length > 0 ? newFeatures : [""],
    });
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({
      ...formData,
      features: newFeatures,
    });
  };

  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.price ||
      !formData.duration ||
      !formData.category
    ) {
      toast.error("Proszę wypełnić wszystkie wymagane pola");
      return;
    }

    const serviceData = {
      ...formData,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
      features: formData.features.filter((f) => f.trim() !== ""),
    };

    // Persist to Firestore as IService-compatible object
    const persistItem = {
      real_name: serviceData.name,
      flatten_name: generateFlattenName(serviceData.name),
      price: serviceData.price,
      duration: serviceData.duration,
      description: serviceData.description,
      isCustomService: true,
      // keep extras
      category: serviceData.category,
      features: serviceData.features,
      active: serviceData.active,
    };

    const currentUserServices = Array.isArray(user?.services)
      ? [...user.services]
      : [];

    const targetIndex = editingService
      ? currentUserServices.findIndex(
          (s) =>
            (s?.flatten_name || generateFlattenName(s?.real_name || "")) ===
            generateFlattenName(editingService.name)
        )
      : currentUserServices.findIndex(
          (s) =>
            (s?.flatten_name || generateFlattenName(s?.real_name || "")) ===
            persistItem.flatten_name
        );

    let updatedForUser;
    if (targetIndex >= 0) {
      updatedForUser = [...currentUserServices];
      updatedForUser[targetIndex] = persistItem;
    } else {
      updatedForUser = [...currentUserServices, persistItem];
    }

    // Update Firestore and Redux, then local UI state
    if (!user?.uid) {
      toast.error("Brak zalogowanego użytkownika");
      return;
    }
    updateUser(user.uid, { services: updatedForUser })
      .then(() => {
        dispatch(setUser({ ...user, services: updatedForUser }));

        if (editingService) {
          setServices(
            services.map((s) =>
              s.id === editingService.id ? { ...s, ...serviceData } : s
            )
          );
          toast.success("Usługa została zaktualizowana!");
        } else {
          const newService = { ...serviceData, id: Date.now() };
          setServices([...services, newService]);
          toast.success("Usługa została dodana!");
        }

        setShowForm(false);
        resetForm();
      })
      .catch(() => {
        toast.error("Nie udało się zapisać usługi");
      });
  };

  const handleGenerate = async () => {
    if (!formData.name || isGenerating) return;
    try {
      setIsGenerating(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/services/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
        }),
      });
      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      setFormData({
        name: data.name || formData.name,
        price: data.price ? String(data.price) : formData.price,
        duration: data.duration ? String(data.duration) : formData.duration,
        description: data.description || formData.description,
        category: data.category || formData.category,
        features:
          Array.isArray(data.features) && data.features.length > 0
            ? data.features
            : formData.features,
        active: true,
      });
      toast.success("Wygenerowano propozycję usługi");
    } catch (_e) {
      toast.error("Nie udało się wygenerować usługi");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      price: service.price.toString(),
      duration: service.duration.toString(),
      description: service.description,
      category: service.category,
      features: service.features.length > 0 ? service.features : [""],
      active: service.active,
    });
    setShowForm(true);
  };

  const handleDelete = (serviceId) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tę usługę?")) return;
    const toDelete = services.find((s) => s.id === serviceId);
    setServices(services.filter((s) => s.id !== serviceId));

    // Sync deletion to Firestore
    try {
      const currentUserServices = Array.isArray(user?.services)
        ? [...user.services]
        : [];
      const updatedForUser = currentUserServices.filter(
        (s) =>
          (s?.flatten_name || generateFlattenName(s?.real_name || "")) !==
          (toDelete ? generateFlattenName(toDelete.name) : "__none__")
      );
      if (user?.uid) {
        updateUser(user.uid, { services: updatedForUser });
        dispatch(setUser({ ...user, services: updatedForUser }));
      }
      toast.success("Usługa została usunięta!");
    } catch (_e) {
      toast.error("Nie udało się zaktualizować usług");
    }
  };

  const toggleServiceStatus = (serviceId) => {
    const updatedLocal = services.map((s) =>
      s.id === serviceId ? { ...s, active: !s.active } : s
    );
    setServices(updatedLocal);

    // Persist active flag alongside the service if it exists in user.services
    const changed = updatedLocal.find((s) => s.id === serviceId);
    if (!changed || !user?.uid) return;
    const currentUserServices = Array.isArray(user?.services)
      ? [...user.services]
      : [];
    const idx = currentUserServices.findIndex(
      (s) =>
        (s?.flatten_name || generateFlattenName(s?.real_name || "")) ===
        generateFlattenName(changed.name)
    );
    if (idx >= 0) {
      const updatedForUser = [...currentUserServices];
      updatedForUser[idx] = { ...updatedForUser[idx], active: changed.active };
      updateUser(user.uid, { services: updatedForUser })
        .then(() => dispatch(setUser({ ...user, services: updatedForUser })))
        .catch(() => {});
    }
  };


  useEffect(() => {
    const handleOpenServiceForm = () => {
      setFormData({
        name: "",
        price: "",
        duration: "",
        description: "",
        category: "",
        features: [""],
        active: true,
      });
      setEditingService(null);
      setShowForm(true);
    };
    window.addEventListener('openServiceForm', handleOpenServiceForm);
    return () => window.removeEventListener('openServiceForm', handleOpenServiceForm);
  }, []);

  // Show loading skeleton if user data is not yet available
  if (!user) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className="bg-white border-2 border-gray-200 rounded-xl shadow-md"
          >
            <div className="p-6">
              <div className="flex items-start justify-between gap-6 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-7 w-48 rounded-lg animate-shimmer"></div>
                    <div className="h-6 w-24 rounded-full animate-shimmer"></div>
                    <div className="h-6 w-20 rounded-full animate-shimmer"></div>
                  </div>
                  <div className="h-4 w-full rounded animate-shimmer mb-2"></div>
                  <div className="h-4 w-3/4 rounded animate-shimmer"></div>
                </div>
                <div className="h-10 w-10 rounded-lg animate-shimmer"></div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-8">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg animate-shimmer"></div>
                      <div>
                        <div className="h-3 w-12 rounded animate-shimmer mb-1"></div>
                        <div className="h-5 w-16 rounded animate-shimmer"></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg animate-shimmer"></div>
                  <div className="h-10 w-10 rounded-lg animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="">

      {/* Services List */}
      <div className="space-y-4">
        {services.length === 0 ? (
          <div className="text-center py-12 px-4">
            <MdCategory className="text-5xl text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-6">Nie masz jeszcze żadnych usług</p>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              Dodaj pierwszą usługę
            </button>
          </div>
        ) : (
          services.map((service, idx) => {
            const serviceImages = getServiceImages(service, idx);
            return (
            <div
              key={service.id}
              className={`bg-white border-2 rounded-xl hover:shadow-xl transition-all ${
                service.active
                  ? "border-blue-300 shadow-md"
                  : "border-gray-300 opacity-75 shadow-sm"
              }`}
            >
              {/* Desktop Layout */}
              <div className="hidden md:block p-6 relative">
                <div className="pr-16">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-2xl text-gray-900">
                      {service.name}
                    </h3>
                    {!service.active && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700 whitespace-nowrap">
                        Nieaktywna
                      </span>
                    )}
                  </div>
                  {service.description && (
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {service.description}
                    </p>
                  )}
                </div>
                
                <button
                  onClick={() => toggleServiceStatus(service.id)}
                  className={`absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-lg transition-all shadow-sm hover:shadow-md ${
                    service.active
                      ? "text-blue-600 hover:bg-blue-50 bg-blue-50"
                      : "text-gray-600 hover:bg-gray-100 bg-gray-50"
                  }`}
                  title={service.active ? "Dezaktywuj" : "Aktywuj"}
                >
                  {service.active ? <FaEye className="text-lg flex-shrink-0" /> : <FaEyeSlash className="text-lg flex-shrink-0" />}
                </button>

                <div className="flex items-center justify-end pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="w-10 h-10 flex items-center justify-center text-blue-600 hover:bg-blue-50 bg-blue-50 rounded-lg transition-all shadow-sm hover:shadow-md"
                      title="Edytuj"
                    >
                      <FaEdit className="text-lg" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="w-10 h-10 flex items-center justify-center text-red-600 hover:bg-red-50 bg-red-50 rounded-lg transition-all shadow-sm hover:shadow-md"
                      title="Usuń"
                    >
                      <FaTrash className="text-lg" />
                    </button>
                  </div>
                </div>

                {/* Portfolio Images - Desktop */}
                {serviceImages.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Połączone zdjęcia ({serviceImages.length})</h4>
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                      {serviceImages.map((image) => (
                        <button
                          key={image.id}
                          onClick={() => setSelectedImage(image)}
                          className="relative aspect-square rounded-lg overflow-hidden border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-md group"
                        >
                          <Image
                            src={image.url || ""}
                            alt={image.title || "Portfolio"}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                            sizes="(max-width: 768px) 25vw, (max-width: 1024px) 12.5vw, 10vw"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden p-4 relative">
                <div className="pr-14">
                  {/* Header with Title and Status */}
                  <div className="mb-2">
                    <h3 className="font-bold text-lg text-gray-900 break-words">
                      {service.name}
                    </h3>
                    {!service.active && (
                      <div className="flex items-center gap-2 flex-wrap mt-1">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
                          Nieaktywna
                        </span>
                      </div>
                    )}
                  </div>
                  {service.description && (
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                      {service.description}
                    </p>
                  )}
                </div>
                
                <button
                  onClick={() => toggleServiceStatus(service.id)}
                  className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                    service.active
                      ? "text-blue-600 hover:bg-blue-50 bg-blue-50"
                      : "text-gray-600 hover:bg-gray-100 bg-gray-50"
                  }`}
                  title={service.active ? "Dezaktywuj" : "Aktywuj"}
                >
                  {service.active ? <FaEye className="text-lg flex-shrink-0" /> : <FaEyeSlash className="text-lg flex-shrink-0" />}
                </button>

                {/* Portfolio Images - Mobile */}
                {serviceImages.length > 0 && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Połączone zdjęcia ({serviceImages.length})</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {serviceImages.map((image) => (
                        <button
                          key={image.id}
                          onClick={() => setSelectedImage(image)}
                          className="relative aspect-square rounded-lg overflow-hidden border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-md group"
                        >
                          <Image
                            src={image.url || ""}
                            alt={image.title || "Portfolio"}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                            sizes="25vw"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleEdit(service)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-semibold text-sm bg-blue-50"
                  >
                    <FaEdit />
                    <span>Edytuj</span>
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-all font-semibold text-sm bg-red-50"
                  >
                    <FaTrash />
                    <span>Usuń</span>
                  </button>
                </div>
              </div>
            </div>
            );
          })
        )}
      </div>

      {/* Service Form Modal */}
      {showForm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => {
            setShowForm(false);
            resetForm();
          }}
        >
          <div 
            className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-blue-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingService ? "Edytuj usługę" : "Dodaj nową usługę"}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full transition-all"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Service Name - Full Width */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-bold text-gray-900">
                    Nazwa usługi *
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={!formData.name || isGenerating}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-600 shadow-md hover:shadow-lg transition-all font-semibold text-sm"
                    title="Wygeneruj szczegóły usługi"
                  >
                    <FaMagic className="flex-shrink-0" />
                    <span className="hidden sm:inline">{isGenerating ? "Generuję..." : "Wygeneruj"}</span>
                    <span className="sm:hidden">{isGenerating ? "..." : "Auto"}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                  placeholder="np. Manicure hybrydowy"
                />
              </div>

              {/* Category, Price, Duration - Two Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Kategoria *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                  >
                    <option value="">Wybierz kategorię</option>
                    {serviceCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Cena i czas trwania *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                      placeholder="Cena (zł)"
                      min="0"
                      step="0.01"
                    />
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                      placeholder="Czas (min)"
                      min="15"
                      step="15"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Opis usługi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  rows="4"
                  placeholder="Opisz szczegóły usługi..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Funkcje/usługi w pakiecie
                </label>
                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) =>
                          handleFeatureChange(index, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (feature.trim() && index === formData.features.length - 1) {
                              handleAddFeature();
                              // Focus the new input after state update
                              setTimeout(() => {
                                const inputs = document.querySelectorAll('input[placeholder="np. Przygotowanie płytki"]');
                                if (inputs.length > 0) {
                                  inputs[inputs.length - 1].focus();
                                }
                              }, 0);
                            }
                          }
                        }}
                        className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="np. Przygotowanie płytki"
                      />
                      {formData.features.length > 1 && (
                        <button
                          onClick={() => handleRemoveFeature(index)}
                          className="w-12 h-12 flex items-center justify-center text-red-600 hover:bg-red-100 bg-red-50 border-2 border-red-200 rounded-lg transition-all hover:shadow-md"
                          title="Usuń funkcję"
                        >
                          <FaTrash className="text-base" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={handleAddFeature}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-semibold hover:bg-blue-50 px-3 py-2 rounded-lg transition-all"
                  >
                    <FaPlus />
                    <span>Dodaj funkcję</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border-2 border-blue-100">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                  className="rounded border-2 border-blue-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
                />
                <label htmlFor="active" className="text-sm font-semibold text-gray-900 cursor-pointer">
                  Usługa aktywna (widoczna dla klientów)
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t-2 border-gray-200">
                <button
                  onClick={handleSubmit}
                  className="w-full sm:flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl font-bold text-base"
                >
                  <FaSave className="flex-shrink-0" />
                  <span>
                    {editingService ? "Zapisz zmiany" : "Dodaj usługę"}
                  </span>
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="w-full sm:flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-300 transition-all font-semibold shadow-md hover:shadow-lg"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Detail Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-blue-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Szczegóły zdjęcia</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full transition-all"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="mb-4">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-blue-200 bg-gray-100">
                <Image
                  src={selectedImage.url || ""}
                  alt={selectedImage.title || "Portfolio"}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            </div>

            <div className="space-y-4">
              {selectedImage.title && (
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Tytuł
                  </label>
                  <p className="text-base text-gray-700 bg-gray-50 px-4 py-3 rounded-xl border-2 border-gray-200">
                    {selectedImage.title}
                  </p>
                </div>
              )}

              {selectedImage.description && (
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Opis
                  </label>
                  <p className="text-base text-gray-700 bg-gray-50 px-4 py-3 rounded-xl border-2 border-gray-200 whitespace-pre-wrap">
                    {selectedImage.description}
                  </p>
                </div>
              )}

              {(!selectedImage.title && !selectedImage.description) && (
                <div className="text-center py-6 text-gray-500">
                  <p className="text-sm">Brak tytułu i opisu dla tego zdjęcia</p>
                </div>
              )}
            </div>

<p className="text-neutral-500 text-sm mt-3">
  Możesz edytować informacje o zdjęciu w Galerii Realizacji
</p>
            <div className="mt-2 pt-4 border-t-2 border-gray-200">
              <button
                onClick={() => setSelectedImage(null)}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-md hover:shadow-lg"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
