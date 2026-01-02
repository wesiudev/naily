"use client";

import { useEffect, useState } from "react";
import { User, IService } from "@/types";
import { getUsers } from "@/utils/getUsers";
import { toast } from "react-toastify";
import Image from "next/image";
import { FaEdit, FaSave, FaTimes, FaPlus, FaTrash, FaMagic, FaImage } from "react-icons/fa";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable, deleteObject } from "firebase/storage";
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
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
  const [portfolioProgress, setPortfolioProgress] = useState(0);
  const [editingPortfolioItem, setEditingPortfolioItem] = useState<{ id: string; title: string; description: string } | null>(null);
  const [deletingPortfolioItem, setDeletingPortfolioItem] = useState<string | null>(null);
  const [editingSeo, setEditingSeo] = useState({ title: false, description: false });
  const [metaDraft, setMetaDraft] = useState({ seoTitle: "", seoDescription: "", seoKeywords: "" });

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
    // Initialize SEO metadata draft
    setMetaDraft({
      seoTitle: user.metadata?.seoTitle || "",
      seoDescription: user.metadata?.seoDescription || "",
      seoKeywords: user.metadata?.seoKeywords || "",
    });
    setEditingSeo({ title: false, description: false });
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

  async function handlePortfolioUpload(files: FileList | null) {
    if (!editingUser || !files || files.length === 0) return;

    const fileArray = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (fileArray.length === 0) return;

    setUploadingPortfolio(true);
    setPortfolioProgress(0);

    try {
      const currentPortfolio = Array.isArray(editingUser.portfolio) ? [...editingUser.portfolio] : [];
      const newItems: Array<{
        id: string;
        url: string;
        path: string;
        title: string;
        originalFileName: string;
        description: string;
        serviceIds: string[];
        createdAt: number;
      }> = [];
      const totalFiles = fileArray.length;
      let uploadedFiles = 0;

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const id = uuidv4();
        const path = `users/${editingUser.uid}/portfolio/${id}-${file.name}`;
        const imageRef = ref(storage, path);
        
        const task = uploadBytesResumable(imageRef, file);
        
        await new Promise<void>((resolve, reject) => {
          task.on("state_changed", 
            (snapshot) => {
              const fileProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              const overallProgress = ((uploadedFiles + fileProgress / 100) / totalFiles) * 100;
              setPortfolioProgress(Math.round(overallProgress));
            },
            (error) => reject(error),
            async () => {
              const url = await getDownloadURL(imageRef);
              newItems.push({
                id,
                url,
                path,
                title: "",
                originalFileName: file.name,
                description: "",
                serviceIds: [],
                createdAt: Date.now(),
              });
              uploadedFiles++;
              resolve();
            }
          );
        });
      }

      const updatedPortfolio = [...currentPortfolio, ...newItems];
      setEditingUser({ ...editingUser, portfolio: updatedPortfolio });
      
      toast.success(`${newItems.length} zdjęć zostało dodanych`);
    } catch (error) {
      toast.error("Nie udało się wgrać zdjęć");
      console.error(error);
    } finally {
      setUploadingPortfolio(false);
      setPortfolioProgress(0);
    }
  }

  async function handlePortfolioDelete(itemId: string) {
    if (!editingUser || !itemId) return;

    const item = editingUser.portfolio?.find((p: any) => p.id === itemId);
    if (!item) return;

    try {
      // Remove from portfolio array
      const updatedPortfolio = editingUser.portfolio?.filter((p: any) => p.id !== itemId) || [];
      setEditingUser({ ...editingUser, portfolio: updatedPortfolio });

      // Delete from storage
      if (item.path) {
        try {
          await deleteObject(ref(storage, item.path));
        } catch (storageError) {
          console.error("Error deleting from storage:", storageError);
        }
      }

      toast.success("Zdjęcie zostało usunięte");
      setDeletingPortfolioItem(null);
    } catch (error) {
      toast.error("Nie udało się usunąć zdjęcia");
      console.error(error);
    }
  }

  function handlePortfolioEdit(item: any) {
    setEditingPortfolioItem({
      id: item.id,
      title: item.title || "",
      description: item.description || "",
    });
  }

  async function handlePortfolioSaveEdit() {
    if (!editingUser || !editingPortfolioItem) return;

    const updatedPortfolio = editingUser.portfolio?.map((item: any) =>
      item.id === editingPortfolioItem.id
        ? { ...item, title: editingPortfolioItem.title, description: editingPortfolioItem.description }
        : item
    ) || [];

    setEditingUser({ ...editingUser, portfolio: updatedPortfolio });
    setEditingPortfolioItem(null);
    toast.success("Zmiany zostały zapisane");
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

  function updateMetadataField(field: "seoTitle" | "seoDescription" | "seoKeywords", value: string) {
    if (!editingUser) return;
    const currentMetadata = editingUser.metadata || {};
    setEditingUser({
      ...editingUser,
      metadata: {
        ...currentMetadata,
        [field]: value,
      },
    });
    setMetaDraft({
      ...metaDraft,
      [field]: value,
    });
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

                {/* Portfolio Images */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-gray-300 text-lg font-semibold">Portfolio</label>
                    <label className="block">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handlePortfolioUpload(e.target.files)}
                        disabled={uploadingPortfolio}
                        className="hidden"
                        id="portfolio-upload"
                      />
                      <button
                        onClick={() => document.getElementById("portfolio-upload")?.click()}
                        disabled={uploadingPortfolio}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
                      >
                        <FaPlus /> {uploadingPortfolio ? `Przesyłanie... ${portfolioProgress}%` : "Dodaj zdjęcia"}
                      </button>
                    </label>
                  </div>

                  {uploadingPortfolio && (
                    <div className="mb-4">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${portfolioProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {editingUser.portfolio?.map((item: any, index: number) => (
                      <div
                        key={item.id || index}
                        className="bg-gray-900 rounded-lg p-4 border border-gray-700 relative group"
                      >
                        <div className="relative aspect-square mb-3 w-full">
                          <Image
                            src={item.url}
                            alt={item.title || `Portfolio ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="rounded-lg object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
                            <button
                              onClick={() => handlePortfolioEdit(item)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center gap-1"
                            >
                              <FaEdit /> Edytuj
                            </button>
                            <button
                              onClick={() => setDeletingPortfolioItem(item.id)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm flex items-center gap-1"
                            >
                              <FaTrash /> Usuń
                            </button>
                          </div>
                        </div>
                        {item.title && (
                          <p className="text-white text-sm font-semibold mb-1 truncate">{item.title}</p>
                        )}
                        {item.description && (
                          <p className="text-gray-400 text-xs line-clamp-2">{item.description}</p>
                        )}
                        {!item.title && !item.description && (
                          <p className="text-gray-500 text-xs">Brak opisu</p>
                        )}
                      </div>
                    ))}
                    {(!editingUser.portfolio || editingUser.portfolio.length === 0) && (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        <FaImage className="text-4xl mx-auto mb-2 opacity-50" />
                        <p>Brak zdjęć w portfolio</p>
                      </div>
                    )}
                  </div>

                  {/* Edit Modal */}
                  {editingPortfolioItem && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
                        <h3 className="text-white text-xl font-bold mb-4">Edytuj zdjęcie</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-gray-300 mb-2">Tytuł</label>
                            <input
                              type="text"
                              value={editingPortfolioItem.title}
                              onChange={(e) =>
                                setEditingPortfolioItem({ ...editingPortfolioItem, title: e.target.value })
                              }
                              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                              style={{ color: 'black', backgroundColor: 'white' }}
                            />
                          </div>
                          <div>
                            <label className="block text-gray-300 mb-2">Opis</label>
                            <textarea
                              value={editingPortfolioItem.description}
                              onChange={(e) =>
                                setEditingPortfolioItem({ ...editingPortfolioItem, description: e.target.value })
                              }
                              rows={4}
                              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                              style={{ color: 'black', backgroundColor: 'white' }}
                            />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => setEditingPortfolioItem(null)}
                              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                            >
                              Anuluj
                            </button>
                            <button
                              onClick={handlePortfolioSaveEdit}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                            >
                              Zapisz
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Delete Confirmation Modal */}
                  {deletingPortfolioItem && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-white text-xl font-bold mb-4">Usunąć zdjęcie?</h3>
                        <p className="text-gray-300 mb-6">
                          Czy na pewno chcesz usunąć to zdjęcie? Tej operacji nie można cofnąć.
                        </p>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setDeletingPortfolioItem(null)}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                          >
                            Anuluj
                          </button>
                          <button
                            onClick={() => handlePortfolioDelete(deletingPortfolioItem)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                          >
                            Usuń
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* SEO Metadata */}
                <div>
                  <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2">
                    <FaMagic className="text-purple-400" />
                    SEO - Wygląd w Google
                  </h3>
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Tytuł SEO (max 60 znaków)</label>
                      {!editingSeo.title ? (
                        <div className="flex items-center group">
                          <div
                            onClick={() => setEditingSeo((p) => ({ ...p, title: true }))}
                            className="text-white text-base cursor-pointer hover:text-blue-400 flex-1 min-w-0"
                          >
                            {metaDraft.seoTitle || editingUser.metadata?.seoTitle || "Kliknij, aby dodać tytuł SEO"}
                          </div>
                          <button
                            onClick={() => setEditingSeo((p) => ({ ...p, title: true }))}
                            className="opacity-0 group-hover:opacity-100 px-2 py-1 text-blue-400 hover:text-blue-300 text-sm"
                          >
                            Edytuj
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={metaDraft.seoTitle}
                            onChange={(e) => {
                              const value = e.target.value.slice(0, 60);
                              updateMetadataField("seoTitle", value);
                            }}
                            className="w-full px-3 py-2 rounded bg-white border border-gray-300 text-black text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            style={{ color: 'black', backgroundColor: 'white' }}
                            placeholder="Wprowadź tytuł (max 60 znaków)"
                            maxLength={60}
                            autoFocus
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingSeo((p) => ({ ...p, title: false }))}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                            >
                              Zapisz
                            </button>
                            <button
                              onClick={() => {
                                setMetaDraft({ ...metaDraft, seoTitle: editingUser.metadata?.seoTitle || "" });
                                setEditingSeo((p) => ({ ...p, title: false }));
                              }}
                              className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
                            >
                              Anuluj
                            </button>
                            <span className="text-gray-400 text-xs">
                              {metaDraft.seoTitle.length}/60
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">Opis SEO (max 160 znaków)</label>
                      {!editingSeo.description ? (
                        <div className="flex items-start gap-2 group">
                          <p
                            onClick={() => setEditingSeo((p) => ({ ...p, description: true }))}
                            className="text-gray-400 text-sm line-clamp-2 cursor-pointer hover:text-gray-300 flex-1 min-w-0"
                          >
                            {metaDraft.seoDescription || editingUser.metadata?.seoDescription || "Kliknij, aby dodać opis SEO"}
                          </p>
                          <button
                            onClick={() => setEditingSeo((p) => ({ ...p, description: true }))}
                            className="opacity-0 group-hover:opacity-100 px-2 py-1 text-blue-400 hover:text-blue-300 text-sm"
                          >
                            Edytuj
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <textarea
                            value={metaDraft.seoDescription}
                            onChange={(e) => {
                              const value = e.target.value.slice(0, 160);
                              updateMetadataField("seoDescription", value);
                            }}
                            className="w-full px-3 py-2 rounded bg-white border border-gray-300 text-black text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                            style={{ color: 'black', backgroundColor: 'white' }}
                            placeholder="Wprowadź opis (max 160 znaków)"
                            maxLength={160}
                            rows={3}
                            autoFocus
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingSeo((p) => ({ ...p, description: false }))}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                            >
                              Zapisz
                            </button>
                            <button
                              onClick={() => {
                                setMetaDraft({ ...metaDraft, seoDescription: editingUser.metadata?.seoDescription || "" });
                                setEditingSeo((p) => ({ ...p, description: false }));
                              }}
                              className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
                            >
                              Anuluj
                            </button>
                            <span className="text-gray-400 text-xs">
                              {metaDraft.seoDescription.length}/160
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">Słowa kluczowe SEO (opcjonalne)</label>
                      <input
                        type="text"
                        value={metaDraft.seoKeywords}
                        onChange={(e) => updateMetadataField("seoKeywords", e.target.value)}
                        className="w-full px-3 py-2 rounded bg-white border border-gray-300 text-black text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        style={{ color: 'black', backgroundColor: 'white' }}
                        placeholder="np: manicure, pedicure, paznokcie, Warszawa"
                      />
                    </div>

                    <div className="pt-2 border-t border-gray-700">
                      <p className="text-gray-400 text-xs">
                        URL profilu: naily.pl/zarezerwuj/{editingUser.userSlugUrl || editingUser.uid}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Jeśli nie ustawisz tytułu lub opisu SEO, zostaną one wygenerowane automatycznie na podstawie danych profilu.
                      </p>
                    </div>
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

