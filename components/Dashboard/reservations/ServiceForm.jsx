import React from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

const ServiceForm = ({
  showCreateForm,
  editingService,
  formData,
  setFormData,
  handleSubmit,
  handleAddFeature,
  handleRemoveFeature,
  handleFeatureChange,
  serviceCategories,
  onClose,
}) => {
  if (!showCreateForm) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-elegant p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-beauty-charcoal">
            {editingService ? "Edytuj usługę" : "Dodaj nową usługę"}
          </h3>
          <button
            onClick={onClose}
            className="text-beauty-slate hover:text-beauty-charcoal transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-beauty-charcoal mb-2">
                Nazwa usługi *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-3 border border-beauty-rose-200 rounded-elegant focus:ring-2 focus:ring-beauty-rose-500 focus:border-transparent"
                placeholder="np. Manicure hybrydowy"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-beauty-charcoal mb-2">
                Kategoria
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full p-3 border border-beauty-rose-200 rounded-elegant focus:ring-2 focus:ring-beauty-rose-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-beauty-charcoal mb-2">
                Cena (zł) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full p-3 border border-beauty-rose-200 rounded-elegant focus:ring-2 focus:ring-beauty-rose-500 focus:border-transparent"
                placeholder="80"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-beauty-charcoal mb-2">
                Czas trwania (min) *
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                className="w-full p-3 border border-beauty-rose-200 rounded-elegant focus:ring-2 focus:ring-beauty-rose-500 focus:border-transparent"
                placeholder="60"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-beauty-charcoal mb-2">
              Opis usługi
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="3"
              className="w-full p-3 border border-beauty-rose-200 rounded-elegant focus:ring-2 focus:ring-beauty-rose-500 focus:border-transparent"
              placeholder="Opisz szczegóły usługi..."
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-beauty-charcoal mb-2">
              Funkcje usługi
            </label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 p-3 border border-beauty-rose-200 rounded-elegant focus:ring-2 focus:ring-beauty-rose-500 focus:border-transparent"
                    placeholder="np. Lakier hybrydowy"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="p-3 text-red-500 hover:bg-red-100 rounded-elegant transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddFeature}
                className="flex items-center gap-2 text-beauty-rose-500 hover:text-beauty-rose-600"
              >
                <FaPlus />
                <span>Dodaj funkcję</span>
              </button>
            </div>
          </div>

          {/* Popular Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="popular"
              checked={formData.popular}
              onChange={(e) =>
                setFormData({ ...formData, popular: e.target.checked })
              }
              className="w-4 h-4 text-beauty-rose-500 border-beauty-rose-200 rounded focus:ring-beauty-rose-500"
            />
            <label
              htmlFor="popular"
              className="text-sm font-medium text-beauty-charcoal"
            >
              Oznacz jako popularne
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-beauty-rose-500 text-white py-3 px-6 rounded-elegant hover:bg-beauty-rose-600 transition-colors font-medium"
            >
              {editingService ? "Zaktualizuj usługę" : "Dodaj usługę"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-beauty-rose-200 text-beauty-rose-500 rounded-elegant hover:bg-beauty-rose-50 transition-colors font-medium"
            >
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;
