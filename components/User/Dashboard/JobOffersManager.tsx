"use client";
import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { addJobOffer, fetchJobOffers, updateJobOffer, deleteJobOffer } from "@/firebase";
import { toast } from "react-toastify";
import { randId } from "@/lib/utils";
import { JobOffer } from "@/types";
import { getCities } from "@/utils/getCities";
import { ICity } from "@/types";
import { User } from "@/types";

export default function JobOffersManager({ user }: { user: User }) {
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<JobOffer | null>(null);
  const [cities, setCities] = useState<ICity[]>([]);
  const [formData, setFormData] = useState<Partial<JobOffer>>({
    title: "",
    description: "",
    city: "",
    cityId: "",
    salonName: user?.name || "",
    salonId: user?.uid || "",
    salary: "",
    employmentType: undefined,
    requirements: [],
    benefits: [],
    isActive: true,
    isAdminCreated: false,
    contactEmail: user?.email || "",
    contactPhone: user?.phoneNumber || "",
    location: user?.location?.address || "",
  });
  const [requirementInput, setRequirementInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const allCities = await getCities();
        const citiesOnly = allCities.filter((c) => c.type === "city");
        setCities(citiesOnly);

        const allOffers = await fetchJobOffers() as JobOffer[];
        const userOffers = allOffers.filter(
          (offer) => offer.salonId === user?.uid
        );
        setOffers(userOffers);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Błąd podczas ładowania danych");
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      loadData();
    }
  }, [user?.uid]);

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData({
        ...formData,
        requirements: [...(formData.requirements || []), requirementInput.trim()],
      });
      setRequirementInput("");
    }
  };

  const removeRequirement = (idx: number) => {
    const newRequirements = [...(formData.requirements || [])];
    newRequirements.splice(idx, 1);
    setFormData({ ...formData, requirements: newRequirements });
  };

  const addBenefit = () => {
    if (benefitInput.trim()) {
      setFormData({
        ...formData,
        benefits: [...(formData.benefits || []), benefitInput.trim()],
      });
      setBenefitInput("");
    }
  };

  const removeBenefit = (idx: number) => {
    const newBenefits = [...(formData.benefits || [])];
    newBenefits.splice(idx, 1);
    setFormData({ ...formData, benefits: newBenefits });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.cityId) {
      toast.error("Wypełnij wszystkie wymagane pola");
      return;
    }

    try {
      if (editingOffer) {
        await updateJobOffer(editingOffer.id, {
          ...formData,
          updatedAt: Date.now(),
        } as JobOffer);
        toast.success("Oferta pracy została zaktualizowana");
      } else {
        await addJobOffer({
          ...formData,
          id: randId(30, "aA0"),
          createdAt: Date.now(),
        } as JobOffer);
        toast.success("Oferta pracy została dodana");
      }

      // Reload offers
      const allOffers = await fetchJobOffers() as JobOffer[];
      const userOffers = allOffers.filter(
        (offer) => offer.salonId === user?.uid
      );
      setOffers(userOffers);

      setShowForm(false);
      setEditingOffer(null);
      setFormData({
        title: "",
        description: "",
        city: "",
        cityId: "",
        salonName: user?.name || "",
        salonId: user?.uid || "",
        salary: "",
        employmentType: undefined,
        requirements: [],
        benefits: [],
        isActive: true,
        isAdminCreated: false,
        contactEmail: user?.email || "",
        contactPhone: user?.phoneNumber || "",
        location: user?.location?.address || "",
      });
    } catch (error) {
      console.error("Error saving job offer:", error);
      toast.error("Błąd podczas zapisywania oferty");
    }
  };

  const handleEdit = (offer: JobOffer) => {
    setEditingOffer(offer);
    setFormData(offer);
    setShowForm(true);
  };

  const handleDelete = async (offerId: string) => {
    if (window.confirm("Czy na pewno chcesz usunąć tę ofertę pracy?")) {
      try {
        await deleteJobOffer(offerId);
        setOffers(offers.filter((offer) => offer.id !== offerId));
        toast.success("Oferta pracy została usunięta");
      } catch (error) {
        console.error("Error deleting job offer:", error);
        toast.error("Błąd podczas usuwania oferty");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Ładowanie...</div>;
  }

  // Only show for salons (seek === false)
  if (user?.seek !== false) {
    return (
      <div className="text-center py-8 text-gray-600">
        Ta funkcja jest dostępna tylko dla salonów.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!showForm && (
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Moje oferty pracy</h3>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingOffer(null);
              setFormData({
                title: "",
                description: "",
                city: "",
                cityId: "",
                salonName: user?.name || "",
                salonId: user?.uid || "",
                salary: "",
                employmentType: undefined,
                requirements: [],
                benefits: [],
                isActive: true,
                isAdminCreated: false,
                contactEmail: user?.email || "",
                contactPhone: user?.phoneNumber || "",
                location: user?.location?.address || "",
              });
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FaPlus />
            Dodaj ofertę pracy
          </button>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold mb-4">
            {editingOffer ? "Edytuj ofertę pracy" : "Nowa oferta pracy"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tytuł stanowiska *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Opis *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Miasto *</label>
                <select
                  value={formData.cityId}
                  onChange={(e) => {
                    const city = cities.find((c) => c.id === e.target.value);
                    setFormData({
                      ...formData,
                      cityId: e.target.value,
                      city: city?.name || "",
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Wybierz miasto</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Wynagrodzenie</label>
                <input
                  type="text"
                  value={formData.salary || ""}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="np. 3000-5000 PLN"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Typ zatrudnienia</label>
                <select
                  value={formData.employmentType || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      employmentType: e.target.value as JobOffer["employmentType"],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Wybierz typ</option>
                  <option value="full-time">Pełny etat</option>
                  <option value="part-time">Część etatu</option>
                  <option value="contract">Umowa zlecenie</option>
                  <option value="internship">Staż</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Lokalizacja</label>
                <input
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Wymagania</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Dodaj wymaganie"
                />
                <button
                  type="button"
                  onClick={addRequirement}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Dodaj
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.requirements?.map((req, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-lg"
                  >
                    {req}
                    <button
                      type="button"
                      onClick={() => removeRequirement(idx)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Benefity</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Dodaj benefit"
                />
                <button
                  type="button"
                  onClick={addBenefit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Dodaj
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.benefits?.map((benefit, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-lg"
                  >
                    {benefit}
                    <button
                      type="button"
                      onClick={() => removeBenefit(idx)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {editingOffer ? "Zaktualizuj" : "Dodaj"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingOffer(null);
                }}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
              >
                Anuluj
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <div className="space-y-4">
          {offers.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              Nie masz jeszcze żadnych ofert pracy. Dodaj pierwszą ofertę!
            </div>
          ) : (
            offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold mb-2">{offer.title}</h4>
                    <p className="text-gray-600 mb-2">{offer.city}</p>
                    {offer.salary && (
                      <p className="text-green-600 font-semibold mb-2">{offer.salary}</p>
                    )}
                    <p className="text-gray-700 line-clamp-2">{offer.description}</p>
                    {!offer.isActive && (
                      <span className="inline-block mt-2 px-2 py-1 bg-gray-200 text-gray-600 text-sm rounded">
                        Nieaktywna
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(offer)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edytuj"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Usuń"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

