"use client";

import { useEffect, useState } from "react";
import { User, IService } from "@/types";
import { getUsers } from "@/utils/getUsers";
import { toast } from "react-toastify";
import Image from "next/image";
import { FaEdit, FaSave, FaTimes, FaPlus, FaTrash, FaMagic } from "react-icons/fa";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase";
import { v4 as uuidv4 } from "uuid";

export default function ProfilesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadingImage, setUploadingImage] = useState<"logo" | "banner" | null>(null);
  const [generatingServiceIndex, setGeneratingServiceIndex] = useState<number | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers || []);
    } catch (error) {
      toast.error("Nie udało się załadować użytkowników");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(user: User) {
    setSelectedUser(user);
    setEditingUser({ ...user });
  }

  function handleCancel() {
    setSelectedUser(null);
    setEditingUser(null);
  }

  async function handleSave() {
    if (!editingUser || !selectedUser) return;

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.uid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      toast.success("Profil zaktualizowany pomyślnie");
      await loadUsers();
      handleCancel();
    } catch (error) {
      toast.error("Nie udało się zaktualizować profilu");
      console.error(error);
    }
  }

  async function handleImageUpload(file: File, type: "logo" | "banner") {
    if (!editingUser) return;

    setUploadingImage(type);
    try {
      const randId = uuidv4();
      const path = type === "logo" ? `avatars/${editingUser.uid}/${randId}` : `banners/${editingUser.uid}/${randId}`;
      const imageRef = ref(storage, path);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);

      setEditingUser({
        ...editingUser,
        [type === "logo" ? "logo" : "bannerUrl"]: url,
      });

      toast.success(`${type === "logo" ? "Zdjęcie profilu" : "Zdjęcie tła"} zaktualizowane`);
    } catch (error) {
      toast.error(`Nie udało się wgrać ${type === "logo" ? "zdjęcia profilu" : "zdjęcia tła"}`);
      console.error(error);
    } finally {
      setUploadingImage(null);
    }
  }

  function updateField(field: string, value: any) {
    if (!editingUser) return;
    setEditingUser({ ...editingUser, [field]: value });
  }

  function updateNestedField(path: string[], value: any) {
    if (!editingUser) return;
    const newUser = { ...editingUser };
    let current: any = newUser;
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setEditingUser(newUser);
  }

  function addCustomVariable() {
    if (!editingUser) return;
    const key = prompt("Nazwa zmiennej:");
    if (!key) return;
    const value = prompt("Wartość:");
    if (value === null) return;
    
    setEditingUser({
      ...editingUser,
      customVariables: {
        ...(editingUser.customVariables || {}),
        [key]: value,
      },
    });
  }

  function removeCustomVariable(key: string) {
    if (!editingUser) return;
    const newVars = { ...(editingUser.customVariables || {}) };
    delete newVars[key];
    setEditingUser({
      ...editingUser,
      customVariables: newVars,
    });
  }

  function addService() {
    if (!editingUser) return;
    const newService: IService = {
      flatten_name: "",
      real_name: "",
      price: 0,
      duration: 0,
      description: "",
      isCustomService: true,
    };
    setEditingUser({
      ...editingUser,
      services: [...(editingUser.services || []), newService],
    });
  }

  function updateService(index: number, field: keyof IService, value: any) {
    if (!editingUser) return;
    const newServices = [...(editingUser.services || [])];
    newServices[index] = { ...newServices[index], [field]: value };
    setEditingUser({ ...editingUser, services: newServices });
  }

  function removeService(index: number) {
    if (!editingUser) return;
    const newServices = [...(editingUser.services || [])];
    newServices.splice(index, 1);
    setEditingUser({ ...editingUser, services: newServices });
  }

  async function generateService(index: number) {
    if (!editingUser) return;
    const service = editingUser.services?.[index];
    const serviceName = service?.real_name?.trim();
    if (!service || !serviceName) {
      toast.error("Najpierw wprowadź nazwę usługi");
      return;
    }

    setGeneratingServiceIndex(index);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL || ""}/api/services/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: serviceName }),
        }
      );

      if (!res.ok) throw new Error("Generation failed");

      const responseData = await res.json();
      
      // Handle nested response structure if present (some APIs wrap in 'response' key)
      const data = (responseData.response || responseData) as {
        name?: string;
        description?: string;
        category?: string;
        price?: number | string;
        duration?: number | string;
        features?: string[];
      };

      console.log("Generated service data:", data); // Debug log

      const generatedName = String(data.name ?? serviceName);
      
      // Generate flatten_name from the generated name (same as kreator-profilu)
      const flattenName = generatedName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "");

      // Convert price and duration - API returns numbers, but handle both cases
      const priceValue = typeof data.price === "number" 
        ? data.price 
        : typeof data.price === "string" 
          ? parseFloat(data.price) || 0 
          : 0;
      
      const durationValue = typeof data.duration === "number"
        ? data.duration
        : typeof data.duration === "string"
          ? parseInt(data.duration) || 0
          : 0;

      const descriptionValue = String(data.description ?? "");

      console.log("Updating service:", { 
        index, 
        real_name: generatedName, 
        description: descriptionValue, 
        price: priceValue, 
        duration: durationValue,
        flatten_name: flattenName 
      }); // Debug log

      // Update all fields at once to ensure state consistency
      if (!editingUser) return;
      const newServices = [...(editingUser.services || [])];
      if (newServices[index]) {
        const updatedService: IService = {
          ...newServices[index],
          real_name: generatedName,
          description: descriptionValue,
          price: priceValue,
          duration: durationValue,
          flatten_name: flattenName,
          isCustomService: newServices[index].isCustomService ?? true,
        };
        newServices[index] = updatedService;
        setEditingUser({ ...editingUser, services: newServices });
      }

      toast.success("Usługa wygenerowana pomyślnie");
    } catch (error) {
      toast.error("Nie udało się wygenerować usługi");
      console.error(error);
    } finally {
      setGeneratingServiceIndex(null);
    }
  }

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.uid?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-full px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-white text-center">Ładowanie...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Zarządzanie profilami
        </h1>
        <p className="text-gray-300 mb-8">
          Zarządzaj profilami użytkowników, priorytetami i zmiennymi niestandardowymi
        </p>

        {!selectedUser ? (
          <>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Szukaj po nazwie, emailu lub UID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ color: 'black', backgroundColor: 'white' }}
              />
            </div>

            <div className="grid gap-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.uid}
                  className="bg-gray-800/60 border border-gray-700 rounded-xl p-5 hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {user.logo && (
                        <Image
                          src={user.logo}
                          alt={user.name}
                          width={50}
                          height={50}
                          className="rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h3 className="text-white font-semibold">{user.name || "Brak nazwy"}</h3>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                        <p className="text-gray-500 text-xs">UID: {user.uid}</p>
                        {user.priorityLevel !== undefined && (
                          <p className="text-purple-400 text-xs mt-1">
                            Priorytet: {user.priorityLevel}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleEdit(user)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <FaEdit /> Edytuj
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Edytuj profil: {selectedUser.name}</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <FaSave /> Zapisz
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <FaTimes /> Anuluj
                </button>
              </div>
            </div>

            {editingUser && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Nazwa</label>
                    <input
                      type="text"
                      value={editingUser.name || ""}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ color: 'black', backgroundColor: 'white' }}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={editingUser.email || ""}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ color: 'black', backgroundColor: 'white' }}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Telefon</label>
                    <input
                      type="text"
                      value={editingUser.phoneNumber || ""}
                      onChange={(e) => updateField("phoneNumber", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ color: 'black', backgroundColor: 'white' }}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Priorytet (priorityLevel)</label>
                    <input
                      type="number"
                      value={editingUser.priorityLevel ?? 0}
                      onChange={(e) => updateField("priorityLevel", parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ color: 'black', backgroundColor: 'white' }}
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      Wyższa wartość = wyższa pozycja w listach
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-300 mb-2">Opis</label>
                  <textarea
                    value={editingUser.description || ""}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ color: 'black', backgroundColor: 'white' }}
                  />
                </div>

                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Zdjęcie profilu</label>
                    {editingUser.logo && (
                      <Image
                        src={editingUser.logo}
                        alt="Profile"
                        width={150}
                        height={150}
                        className="rounded-lg mb-2 object-cover"
                      />
                    )}
                    <label className="block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, "logo");
                        }}
                        disabled={uploadingImage === "logo"}
                        className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                      />
                    </label>
                    {uploadingImage === "logo" && (
                      <p className="text-gray-400 text-sm mt-1">Przesyłanie...</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Zdjęcie tła</label>
                    {editingUser.bannerUrl && (
                      <Image
                        src={editingUser.bannerUrl}
                        alt="Banner"
                        width={300}
                        height={150}
                        className="rounded-lg mb-2 object-cover"
                      />
                    )}
                    <label className="block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, "banner");
                        }}
                        disabled={uploadingImage === "banner"}
                        className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                      />
                    </label>
                    {uploadingImage === "banner" && (
                      <p className="text-gray-400 text-sm mt-1">Przesyłanie...</p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Adres</label>
                    <input
                      type="text"
                      value={editingUser.location?.address || ""}
                      onChange={(e) =>
                        updateNestedField(["location", "address"], e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ color: 'black', backgroundColor: 'white' }}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Szerokość geograficzna</label>
                    <input
                      type="number"
                      step="any"
                      value={editingUser.location?.lat || 0}
                      onChange={(e) =>
                        updateNestedField(["location", "lat"], parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ color: 'black', backgroundColor: 'white' }}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Długość geograficzna</label>
                    <input
                      type="number"
                      step="any"
                      value={editingUser.location?.lng || 0}
                      onChange={(e) =>
                        updateNestedField(["location", "lng"], parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ color: 'black', backgroundColor: 'white' }}
                    />
                  </div>
                </div>

                {/* Custom Variables */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-gray-300">Zmienne niestandardowe</label>
                    <button
                      onClick={addCustomVariable}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
                    >
                      <FaPlus /> Dodaj
                    </button>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 space-y-2">
                    {Object.entries(editingUser.customVariables || {}).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm flex-1">
                          <strong className="text-white">{key}:</strong> {String(value)}
                        </span>
                        <button
                          onClick={() => removeCustomVariable(key)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    {Object.keys(editingUser.customVariables || {}).length === 0 && (
                      <p className="text-gray-500 text-sm">Brak zmiennych niestandardowych</p>
                    )}
                  </div>
                </div>

                {/* Services */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-gray-300">Usługi</label>
                    <button
                      onClick={addService}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
                    >
                      <FaPlus /> Dodaj usługę
                    </button>
                  </div>
                  <div className="space-y-4">
                    {editingUser.services?.map((service, index) => (
                      <div
                        key={index}
                        className="bg-gray-900 rounded-lg p-4 border border-gray-700"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-semibold">
                            Usługa #{index + 1}
                          </h4>
                          <div className="flex gap-2">
                            <button
                              onClick={() => generateService(index)}
                              disabled={generatingServiceIndex === index}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white rounded text-sm flex items-center gap-1"
                              title="Wygeneruj usługę"
                            >
                              <FaMagic /> {generatingServiceIndex === index ? "Generuję..." : "Generuj"}
                            </button>
                            <button
                              onClick={() => removeService(index)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-gray-400 text-sm mb-1">Nazwa</label>
                            <input
                              type="text"
                              value={service.real_name || ""}
                              onChange={(e) => updateService(index, "real_name", e.target.value)}
                              className="w-full px-3 py-2 rounded bg-white border border-gray-300 text-black text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                              style={{ color: 'black', backgroundColor: 'white' }}
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-sm mb-1">Flatten name</label>
                            <input
                              type="text"
                              value={service.flatten_name || ""}
                              onChange={(e) => updateService(index, "flatten_name", e.target.value)}
                              className="w-full px-3 py-2 rounded bg-white border border-gray-300 text-black text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                              style={{ color: 'black', backgroundColor: 'white' }}
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-sm mb-1">Cena (zł)</label>
                            <input
                              type="number"
                              value={service.price || 0}
                              onChange={(e) => updateService(index, "price", parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 rounded bg-white border border-gray-300 text-black text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                              style={{ color: 'black', backgroundColor: 'white' }}
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-sm mb-1">Czas trwania (min)</label>
                            <input
                              type="number"
                              value={service.duration || 0}
                              onChange={(e) => updateService(index, "duration", parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 rounded bg-white border border-gray-300 text-black text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                              style={{ color: 'black', backgroundColor: 'white' }}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-gray-400 text-sm mb-1">Opis</label>
                            <textarea
                              value={service.description || ""}
                              onChange={(e) => updateService(index, "description", e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 rounded bg-white border border-gray-300 text-black text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                              style={{ color: 'black', backgroundColor: 'white' }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!editingUser.services || editingUser.services.length === 0) && (
                      <p className="text-gray-500 text-sm">Brak usług</p>
                    )}
                  </div>
                </div>

                {/* Status Flags */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center gap-2 text-gray-300">
                    <input
                      type="checkbox"
                      checked={editingUser.active || false}
                      onChange={(e) => updateField("active", e.target.checked)}
                      className="rounded"
                    />
                    Aktywny
                  </label>
                  <label className="flex items-center gap-2 text-gray-300">
                    <input
                      type="checkbox"
                      checked={editingUser.configured || false}
                      onChange={(e) => updateField("configured", e.target.checked)}
                      className="rounded"
                    />
                    Skonfigurowany
                  </label>
                  <label className="flex items-center gap-2 text-gray-300">
                    <input
                      type="checkbox"
                      checked={editingUser.premiumActive || false}
                      onChange={(e) => updateField("premiumActive", e.target.checked)}
                      className="rounded"
                    />
                    Premium
                  </label>
                  <label className="flex items-center gap-2 text-gray-300">
                    <input
                      type="checkbox"
                      checked={editingUser.seek || false}
                      onChange={(e) => updateField("seek", e.target.checked)}
                      className="rounded"
                    />
                    Szuka pracy
                  </label>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

