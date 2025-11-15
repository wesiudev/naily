import { setUser } from "@/redux/slices/user";
import { IService, User } from "@/types";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { updateUser } from "@/firebase";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import Image from "next/image";
import serviceImage from "../../../public/services.png";
import { toast } from "react-toastify";

export default function Services({
  servicesOpen,
  setServicesOpen,
  user,
  setProfileEditOpen,
}: {
  servicesOpen: boolean;
  setServicesOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
  setProfileEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useDispatch();
  const [editingService, setEditingService] = useState<IService | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  function handleState(updatedServices: IService[]) {
    dispatch(setUser({ ...user, services: updatedServices }));
  }

  // Generate flatten_name from real_name
  function generateFlattenName(realName: string): string {
    return realName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");
  }

  function handleSave(service: IService) {
    // Ensure all required fields are present
    const completeService: IService = {
      ...service,
      flatten_name:
        service.flatten_name || generateFlattenName(service.real_name),
      real_name: service.real_name || "",
      price: service.price || 0,
      duration: service.duration || 0,
      description: service.description || "",
      isCustomService: service.isCustomService || true,
    };

    const updatedServices = [...(user?.services || [])];
    if (editingIndex !== null) {
      updatedServices[editingIndex] = completeService; // Update existing service
    } else {
      updatedServices.push(completeService); // Add new service
    }
    handleState(updatedServices);
    closePopup();
  }

  function handleDelete(index: number) {
    const updatedServices = [...(user?.services || [])];
    updatedServices.splice(index, 1); // Remove service at the specified index
    handleState(updatedServices);
  }

  function closePopup() {
    setEditingService(null);
    setEditingIndex(null);
  }

  return (
    <>
      <div
        onClick={() => {
          setServicesOpen(false);
        }}
        className={`bg-black/50 z-[92] fixed left-0 top-0 w-screen h-screen overflow-y-scroll flex  p-6 lg:p-12 xl:p-40 2xl:p-64 !pt-6 lg:!pt-12 xl:!pt-24 pb-24 ${
          servicesOpen && user?.configured ? "block" : "hidden"
        }`}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="h-max bg-white mx-auto max-w-[40rem] p-6 rounded-xl shadow-sm shadow-zinc-800"
        >
          <h2 className="text-2xl font-bold text-center mb-2">
            Zarządzaj usługami
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Skonfiguruj usługi wyświetlające się w Twoim profilu
          </p>

          {user?.services?.length > 0 ? (
            <div>
              <h3 className="text-lg font-medium mb-3">Lista usług</h3>
              <div className="grid grid-cols-1 gap-4">
                {user?.services.map((service, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-100 rounded-lg shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-base font-semibold text-gray-800 pr-6">
                          {service.real_name}
                        </p>
                        <div className="mt-2 w-max grid grid-cols-3 gap-3">
                          <div className="text-lg text-gray-600 flex gap-1 items-center justify-center">
                            {!service.duration ? (
                              <FaCircleXmark className="text-red-700" />
                            ) : (
                              <FaCircleCheck className="text-green-700" />
                            )}{" "}
                            <span className="text-sm">Czas</span>
                          </div>
                          <div className="text-lg text-gray-600 flex gap-1 items-center justify-center">
                            {!service.price ? (
                              <FaCircleXmark className="text-red-700" />
                            ) : (
                              <FaCircleCheck className="text-green-700" />
                            )}{" "}
                            <span className="text-sm">Cena</span>
                          </div>
                          <div className="text-lg text-gray-600 flex gap-1 items-center justify-center">
                            {!service.description ? (
                              <FaCircleXmark className="text-red-700" />
                            ) : (
                              <FaCircleCheck className="text-green-700" />
                            )}{" "}
                            <span className="text-sm">Opis</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            if (
                              user?.subscription?.status === "active" ||
                              user?.premiumActive ||
                              user?.active
                            ) {
                              setEditingService({
                                ...service,
                                isCustomService:
                                  service.isCustomService || false,
                                duration: service.duration || 0,
                                price: service.price || 0,
                                description: service.description || "",
                              });
                              setEditingIndex(index);
                            } else {
                              toast.error(
                                "Aktywuj konto premium, aby spersonalizować usługi.",
                                {
                                  position: "top-center",
                                  autoClose: 5000,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: true,
                                  draggable: true,
                                  progress: undefined,
                                }
                              );
                            }
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edytuj
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Usuń
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center flex flex-col items-center justify-center">
              <Image
                src={serviceImage}
                alt="Obraz usług"
                className="w-[100px] mb-3 opacity-30"
              />
              <p className="text-lg font-medium text-gray-500 italic">
                Brak usług.
              </p>
              <p className="text-sm text-gray-500 italic">
                Skonfiguruj usługi, które chcesz wyświetlać w swoim profilu.
              </p>
              <button
                onClick={() => {
                  setProfileEditOpen(true);
                  setServicesOpen(false);
                }}
                className="flex flex-col mt-4 rounded-md px-4 py-2 bg-red-500 duration-150 hover:bg-red-600 text-white font-bold"
              >
                Ustawienia
              </button>
            </div>
          )}
          <div
            style={{ boxShadow: "0px 0px 3px black" }}
            className="fixed bottom-0 w-max left-1/2 -translate-x-1/2 bg-white flex items-center justify-center gap-3 py-2 px-4 rounded-t-lg"
          >
            <button
              onClick={() => {
                if (
                  user?.subscription?.status === "active" ||
                  user?.premiumActive ||
                  user?.active
                ) {
                  setEditingService({
                    real_name: "",
                    flatten_name: "",
                    duration: 0,
                    price: 0,
                    description: "",
                    isCustomService: true,
                  });
                } else {
                  toast.error(
                    "Aktywuj konto premium, aby dodać własne usługi.",
                    {
                      position: "top-center",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    }
                  );
                }
              }}
              className="px-12 rounded-md w-max text-sm sm:text-base bg-blue-600 text-white py-2 hover:bg-blue-700"
            >
              Dodaj usługę
            </button>
            <button
              onClick={() => {
                updateUser(user?.uid, user);
                toast.success("Zmiany zostały zapisane", {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              }}
              className="px-12 rounded-md w-max text-sm sm:text-base bg-green-600 text-white py-2 hover:bg-green-700"
            >
              Zapisz zmiany
            </button>
          </div>
        </div>
      </div>

      {editingService && (
        <div
          className="fixed inset-0 bg-black/50 z-[90] flex justify-center items-center"
          onClick={closePopup}
        >
          <div
            className="bg-gray-200 rounded-lg shadow-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">
              {editingIndex !== null ? "Edytuj usługę" : "Dodaj nową usługę"}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (
                  user?.subscription?.status === "active" ||
                  user?.premiumActive ||
                  user?.active
                ) {
                  handleSave(editingService);
                  toast.success("Usługa została zapisana", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                } else {
                  toast.error("Aktywuj konto premium, aby edytować usługę.", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                }
              }}
              className="space-y-4"
            >
              <div>
                {editingService?.isCustomService ? (
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nazwa usługi
                    </label>
                    <input
                      type="text"
                      value={editingService?.real_name}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService!,
                          real_name: e.target.value,
                          flatten_name: generateFlattenName(e.target.value),
                        })
                      }
                      className="w-full border-gray-300 border rounded-md p-2 mt-1"
                      required
                    />
                  </div>
                ) : (
                  <div className="flex flex-col bg-white p-2 rounded-md">
                    <div className="text-lg font-semibold">
                      {editingService?.real_name}
                    </div>

                    <span className="text-sm text-gray-500 flex flex-row mt-1">
                      <FaInfoCircle className="text-lg mr-1" /> Możesz edytować
                      jedynie nazwy usług premium
                    </span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Czas trwania (minuty)
                  </label>
                  <input
                    type="number"
                    value={editingService.duration}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        duration: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border-gray-300 rounded-md p-2"
                    min={0}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cena (zł)
                  </label>
                  <input
                    type="number"
                    value={editingService.price}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        price: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border-gray-300 rounded-md p-2"
                    min={0}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opis (opcjonalny)
                </label>
                <textarea
                  value={editingService.description}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      description: e.target.value.slice(0, 100),
                    })
                  }
                  className="w-full border-gray-300 rounded-md p-2"
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {editingService?.description?.length}/100
                </p>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closePopup}
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Zapisz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
