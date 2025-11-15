"use client";
import { useEffect, useRef, useState } from "react";
import { storage } from "@/firebase";
import { toast } from "react-toastify";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/slices/user";
import { updateUser } from "@/firebase";

export default function PortfolioManager({ uid }) {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", serviceIds: [] });
  const [itemToDelete, setItemToDelete] = useState(null);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const dragCounterRef = useRef(0);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  useEffect(() => {
    const handleOpenPortfolioPicker = () => {
      fileInputRef.current?.click();
    };
    window.addEventListener('openPortfolioPicker', handleOpenPortfolioPicker);
    return () => window.removeEventListener('openPortfolioPicker', handleOpenPortfolioPicker);
  }, []);

  // Initialize items from user.portfolio array
  useEffect(() => {
    if (user?.portfolio && Array.isArray(user.portfolio)) {
      // Deserialize items and sort by createdAt descending (most recent first)
      const normalized = user.portfolio.map(item => deserializePortfolioItem(item));
      const sorted = normalized.sort((a, b) => {
        const aTime = a.createdAt?.getTime?.() || new Date(a.createdAt).getTime() || 0;
        const bTime = b.createdAt?.getTime?.() || new Date(b.createdAt).getTime() || 0;
        return bTime - aTime;
      });
      setItems(sorted);
    } else {
      setItems([]);
    }
  }, [user?.portfolio]);

  function serializePortfolioItem(item) {
    // Convert createdAt to serializable format (ISO string)
    let createdAt = item.createdAt;
    if (createdAt?.toMillis) {
      // Firestore Timestamp
      createdAt = createdAt.toDate().toISOString();
    } else if (createdAt instanceof Date) {
      // Date object
      createdAt = createdAt.toISOString();
    } else if (typeof createdAt === 'string') {
      // Already a string, keep it
      createdAt = createdAt;
    } else if (createdAt) {
      // Try to convert unknown format
      createdAt = new Date(createdAt).toISOString();
    } else {
      // No createdAt, use current date
      createdAt = new Date().toISOString();
    }
    
    return {
      ...item,
      createdAt,
    };
  }

  function deserializePortfolioItem(item) {
    // Convert ISO string back to Date for display/sorting
    let createdAt = item.createdAt;
    if (typeof createdAt === 'string') {
      createdAt = new Date(createdAt);
    } else if (createdAt?.toDate) {
      // Firestore Timestamp
      createdAt = createdAt.toDate();
    } else if (createdAt?.toMillis) {
      // Firestore Timestamp
      createdAt = createdAt.toDate();
    }
    
    return {
      ...item,
      createdAt: createdAt || new Date(),
    };
  }

  async function updatePortfolioArray(updatedPortfolio) {
    if (!user?.uid) return;
    try {
      // Serialize all items before storing
      const serialized = updatedPortfolio.map(item => serializePortfolioItem(item));
      await updateUser(user.uid, { portfolio: serialized });
      dispatch(setUser({ ...user, portfolio: serialized }));
    } catch (error) {
      console.error("Error updating portfolio:", error);
      throw error;
    }
  }

  async function handleFiles(files) {
    if (!uid || !files?.length) return;
    const fileArray = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (fileArray.length === 0) return;
    
    setIsUploading(true);
    setProgress(0);
    try {
      const totalFiles = fileArray.length;
      let uploadedFiles = 0;
      const currentPortfolio = Array.isArray(user?.portfolio) ? [...user.portfolio] : [];
      const newItems = [];
      
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const id = uuidv4();
        const path = `users/${uid}/portfolio/${id}-${file.name}`;
        const sRef = storageRef(storage, path);
        const task = uploadBytesResumable(sRef, file);
        
        task.on("state_changed", (snap) => {
          const fileProgress = (snap.bytesTransferred / snap.totalBytes) * 100;
          const overallProgress = ((uploadedFiles + fileProgress / 100) / totalFiles) * 100;
          setProgress(Math.round(overallProgress));
        });
        
        await task;
        const url = await getDownloadURL(sRef);
        
        const newItem = {
          id,
          url,
          path,
          title: "",
          originalFileName: file.name,
          description: "",
          serviceIds: [],
          createdAt: Date.now(),
        };
        
        newItems.push(newItem);
        uploadedFiles++;
      }
      
      // Update user portfolio array
      const updatedPortfolio = [...currentPortfolio, ...newItems];
      await updatePortfolioArray(updatedPortfolio);
      
      toast.success(`${newItems.length} zdjęć zostało dodanych`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Nie udało się wgrać zdjęć", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const handleDragEnter = (e) => {
    // Only handle file drags on the main container
    if (!e.dataTransfer.types.includes("Files")) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    dragCounterRef.current++;
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e) => {
    // Only handle file drags
    if (!e.dataTransfer.types.includes("Files")) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Set drop effect to copy and ensure dragging state is set
    e.dataTransfer.dropEffect = "copy";
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    
    // Don't process if moving to a child element
    const relatedTarget = e.relatedTarget;
    if (relatedTarget && e.currentTarget.contains(relatedTarget)) {
      return;
    }
    
    dragCounterRef.current--;
    
    // Only hide dragging state when counter reaches 0
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    dragCounterRef.current = 0;
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  async function updateTitle(itemId, title) {
    if (!user?.uid || !itemId) return;
    const currentPortfolio = Array.isArray(user?.portfolio) ? [...user.portfolio] : [];
    const updatedPortfolio = currentPortfolio.map((item) =>
      item.id === itemId ? { ...item, title } : item
    );
    await updatePortfolioArray(updatedPortfolio);
  }

  async function updateDescription(itemId, description) {
    if (!user?.uid || !itemId) return;
    const currentPortfolio = Array.isArray(user?.portfolio) ? [...user.portfolio] : [];
    const updatedPortfolio = currentPortfolio.map((item) =>
      item.id === itemId ? { ...item, description } : item
    );
    await updatePortfolioArray(updatedPortfolio);
  }

  function handleEditClick(item) {
    // Check if services exist
    if (!user?.services || !Array.isArray(user.services) || user.services.length === 0) {
      toast.info("Dodaj usługi, aby skorzystać z tej funkcji", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    
    setEditingItem(item);
    setEditForm({
      title: item.title || "",
      description: item.description || "",
      serviceIds: Array.isArray(item.serviceIds) ? item.serviceIds : [],
    });
  }

  function handleCloseEdit() {
    setEditingItem(null);
    setEditForm({ title: "", description: "", serviceIds: [] });
    setServicesExpanded(false);
  }

  async function handleSaveEdit() {
    if (!editingItem || !user?.uid) return;
    
    const currentPortfolio = Array.isArray(user?.portfolio) ? [...user.portfolio] : [];
    const updatedPortfolio = currentPortfolio.map((item) =>
      item.id === editingItem.id
        ? { 
            ...item, 
            title: editForm.title, 
            description: editForm.description,
            serviceIds: editForm.serviceIds || []
          }
        : item
    );
    
    await updatePortfolioArray(updatedPortfolio);
    handleCloseEdit();
    toast.success("Zmiany zostały zapisane", {
      position: "top-right",
      autoClose: 3000,
    });
  }

  function isConfigured(item) {
    return item.description && item.description.trim().length > 0;
  }

  function confirmDelete(item) {
    setItemToDelete(item);
  }

  async function removeItem() {
    if (!user?.uid || !itemToDelete?.id) return;
    
    // Store the item before clearing state
    const itemToRemove = { ...itemToDelete };
    const itemId = itemToRemove.id;
    
    // Optimistically update UI immediately
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    setItemToDelete(null);
    
    try {
      // Remove from user portfolio array
      const currentPortfolio = Array.isArray(user?.portfolio) ? [...user.portfolio] : [];
      const updatedPortfolio = currentPortfolio.filter((item) => item.id !== itemId);
      await updatePortfolioArray(updatedPortfolio);
      
      // Then delete from Storage
      if (itemToRemove.path) {
        try {
          await deleteObject(storageRef(storage, itemToRemove.path));
        } catch (storageError) {
          console.error("Error deleting from storage:", storageError);
          // Still show success since array update worked
        }
      }
      
      toast.success("Zdjęcie zostało usunięte", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      
      // Revert optimistic update on error
      setItems((prevItems) => {
        const restored = [...prevItems, itemToRemove];
        // Maintain sort order - most recent first
        return restored.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            const aTime = a.createdAt?.toMillis?.() || a.createdAt?.getTime?.() || new Date(a.createdAt).getTime() || 0;
            const bTime = b.createdAt?.toMillis?.() || b.createdAt?.getTime?.() || new Date(b.createdAt).getTime() || 0;
            return bTime - aTime;
          }
          return 0;
        });
      });
      
      toast.error("Nie udało się usunąć zdjęcia. Spróbuj ponownie.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }

  function cancelDelete() {
    setItemToDelete(null);
  }

  // Show loading skeleton if user data is not yet available
  if (!user) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, idx) => (
            <div
              key={idx}
              className="border-2 border-blue-200 rounded-xl overflow-hidden bg-white"
            >
              <div className="relative w-full aspect-square bg-gray-100">
                <div className="absolute inset-0 animate-shimmer"></div>
              </div>
              <div className="p-3 space-y-2">
                <div className="h-4 w-3/4 rounded animate-shimmer"></div>
                <div className="h-3 w-1/2 rounded animate-shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {!uid && (
        <div className="p-4 mb-4 border-2 border-blue-200 rounded-xl bg-blue-50 text-sm text-blue-800 font-medium">
          Zaloguj się, aby zarządzać swoją galerią.
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {isUploading && (
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-blue-900">Wgrywanie zdjęć...</span>
            <span className="text-sm font-bold text-blue-700">{progress}%</span>
          </div>
          <div className="h-3 rounded-full bg-blue-200 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {items.length === 0 && !isUploading ? (
        <div
          ref={dropZoneRef}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`text-center py-16 px-4 border-2 border-dashed rounded-2xl bg-gradient-to-br transition-all cursor-pointer ${
            isDragging
              ? "border-blue-500 bg-blue-100 scale-[1.02] shadow-xl"
              : "border-blue-300 from-blue-50/50 to-white hover:border-blue-400 hover:from-blue-100/50"
          }`}
        >
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all ${
              isDragging ? "bg-blue-200 scale-110" : "bg-blue-100"
            }`}
          >
            <svg
              className={`w-8 h-8 text-blue-600 transition-transform ${isDragging ? "scale-125" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-lg font-bold text-gray-900 mb-2">
            {isDragging ? "Upuść zdjęcia tutaj" : "Trochę tutaj pusto..."}
          </p>
          <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
            {isDragging
              ? "Zwolnij, aby rozpocząć wgrywanie"
              : "Dodaj zdjęcia swoich najnowszych realizacji lub przeciągnij je tutaj"}
          </p>
          <button
            onClick={openFilePicker}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            Dodaj zdjęcia
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative min-h-[200px] gap-6 ${
            items.length === 1
              ? "flex justify-center"
              : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          }`}
        >
          {isDragging && (
            <div
              className="absolute inset-0 z-50 flex items-center justify-center bg-blue-500/90 backdrop-blur-sm rounded-2xl border-4 border-dashed border-white pointer-events-auto"
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white mb-4">
                  <svg
                    className="w-10 h-10 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-white mb-2">Upuść zdjęcia tutaj</p>
                <p className="text-white/90">Zwolnij, aby rozpocząć wgrywanie</p>
              </div>
            </div>
          )}
          {items.map((item) => {
            const configured = isConfigured(item);
            
            return (
              <div
                key={item.id}
                className={`group border-2 border-blue-200 rounded-xl overflow-hidden bg-white hover:shadow-xl transition-all hover:border-blue-300 ${
                  isDragging ? "pointer-events-none" : "cursor-pointer"
                } ${
                  items.length === 1
                    ? "w-full max-w-lg mx-auto"
                    : "w-full"
                }`}
                onClick={() => !isDragging && handleEditClick(item)}
              >
                <div className={`relative w-full aspect-square bg-gray-100 overflow-hidden ${
                  isDragging ? "pointer-events-none" : ""
                }`}>
                  {item.url && (
                    <Image
                      src={item.url}
                      alt={item.title || "galeria"}
                      fill
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-300 pointer-events-none"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                  
                  {/* Status Indicator */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm shadow-md pointer-events-none">
                    {configured ? (
                      <>
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs font-semibold text-green-700">Opis</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-xs font-semibold text-orange-600">Opis</span>
                      </>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDelete(item);
                    }}
                    className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center text-white bg-red-600 hover:bg-red-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-auto z-10"
                    title="Usuń zdjęcie"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseEdit();
            }
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-blue-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Edytuj zdjęcie</h3>
              <button
                onClick={handleCloseEdit}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full transition-all"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Image Preview */}
            {editingItem.url && (
              <div className="relative w-full h-48 mb-6 rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={editingItem.url}
                  alt={editingItem.title || "portfolio"}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Tytuł *
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                  placeholder="Dodaj tytuł..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Opis <span className="text-gray-500 font-normal text-xs">(opcjonalne)</span>
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  placeholder="Dodaj opis zdjęcia..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900">
                  Powiąż z usługami <span className="text-gray-500 font-normal text-xs">(opcjonalne)</span>
                </label>
                <p className="text-neutral-500 text-xs mb-3">Jeśli powiążesz zdjęcie z usługą, będzie ono wyświetlane w galerii realizacji oraz pod wybranymi usługami.</p>
                
                {(!user?.services || !Array.isArray(user.services) || user.services.length === 0) ? (
                  <div className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl bg-blue-50 text-sm text-blue-700">
                    Brak dostępnych usług. Dodaj usługi, aby skorzystać z tej funkcji.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Toggle Button */}
                    <button
                      type="button"
                      onClick={() => setServicesExpanded(!servicesExpanded)}
                      className="w-full flex items-center justify-between px-4 py-3 border-2 border-blue-200 rounded-xl hover:border-blue-300 transition-all bg-white hover:bg-blue-50/50 group"
                    >
                      <span className="font-semibold text-gray-900">
                        {editForm.serviceIds && editForm.serviceIds.length > 0
                          ? `Wybrano: ${editForm.serviceIds.length} ${
                              editForm.serviceIds.length === 1
                                ? 'usługę'
                                : editForm.serviceIds.length >= 2 && editForm.serviceIds.length <= 4
                                ? 'usługi'
                                : 'usług'
                            }`
                          : 'Wybierz usługi'}
                      </span>
                      <svg
                        className={`w-5 h-5 text-blue-600 transition-transform duration-200 ${servicesExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Expandable Services List */}
                    {servicesExpanded && (
                      <div className="border-2 border-blue-200 rounded-xl bg-white overflow-hidden shadow-sm">
                        <div className="max-h-64 overflow-y-auto">
                          {user.services.map((service, idx) => {
                            const serviceId = service.id ?? `service_${idx}_${(service.real_name || service.name || '').replace(/\s+/g, '_')}`;
                            const serviceName = service.real_name || service.name || `Usługa ${idx + 1}`;
                            const displayId = String(serviceId);
                            const isSelected = editForm.serviceIds?.includes(displayId) || false;

                            return (
                              <label
                                key={displayId}
                                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all hover:bg-blue-50/50 ${
                                  isSelected ? 'bg-blue-50' : ''
                                } ${idx !== user.services.length - 1 ? 'border-b border-blue-100' : ''}`}
                              >
                                {/* Custom Checkbox */}
                                <div className="relative flex-shrink-0">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      const currentIds = editForm.serviceIds || [];
                                      if (e.target.checked) {
                                        setEditForm({
                                          ...editForm,
                                          serviceIds: [...currentIds, displayId],
                                        });
                                      } else {
                                        setEditForm({
                                          ...editForm,
                                          serviceIds: currentIds.filter((id) => id !== displayId),
                                        });
                                      }
                                    }}
                                    className="sr-only"
                                  />
                                  <div
                                    className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                                      isSelected
                                        ? 'bg-blue-600 border-blue-600'
                                        : 'bg-white border-blue-300 hover:border-blue-400'
                                    }`}
                                  >
                                    {isSelected && (
                                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                                {/* Service Name */}
                                <span className={`flex-1 font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                                  {serviceName}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4 border-t-2 border-gray-200">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl font-bold text-base"
                >
                  <span>Zapisz</span>
                </button>
                <button
                  onClick={handleCloseEdit}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-300 transition-all font-semibold shadow-md hover:shadow-lg"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={cancelDelete}
        >
          <div
            className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border-2 border-red-100 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center shadow-lg">
                  <svg
                    className="w-10 h-10 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Usuń zdjęcie?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Czy na pewno chcesz usunąć to zdjęcie? Ta operacja jest nieodwracalna.
              </p>
            </div>

            {/* Image Preview */}
            {itemToDelete.url && (
              <div className="relative w-full h-32 mb-6 rounded-xl overflow-hidden bg-gray-100 border-2 border-red-200">
                <Image
                  src={itemToDelete.url}
                  alt={itemToDelete.title || "galeria"}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-red-500/10"></div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-300 transition-all font-semibold shadow-md hover:shadow-lg"
              >
                Anuluj
              </button>
              <button
                onClick={removeItem}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-bold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Usuń</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
