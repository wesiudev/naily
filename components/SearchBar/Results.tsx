"use client";
import { useState } from "react";
import { IService, PortfolioImage, User } from "@/types";
import Image from "next/image";
import defaultUser from "../../public/default-user.png";
import Link from "next/link";
import DynamicPrice from "@/components/Pricing/DynamicPrice";
import ReservePhone from "@/components/ReservePhone";

export default function Results({ results }: { results: User[] }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [servicesOpen, setServicesOpen] = useState<boolean>(false);
  const [phoneVisible, setPhoneVisible] = useState<boolean>(false);
  const [reservationSubmitting, setReservationSubmitting] = useState(false);
  const handleUserClick = (user: User) => {
    if (selectedUser) {
      setSelectedUser(null);
      setServicesOpen(false);
      setPhoneVisible(false);
    } else {
      setSelectedUser(user);
    }
  };
  return (
    <section className="mt-6">
      <div className="grid grid-cols-1 gap-4">
        {results.map((user) => (
          <div
            key={user.uid}
            className="border-gray-200 border flex items-center p-2 sm:p-4 bg-gray-100 shadow rounded-md cursor-pointer hover:bg-gray-50 transition"
            onClick={() => handleUserClick(user)}
          >
            {/* User Image */}
            <Image
              width={200}
              height={200}
              src={user.logo || defaultUser} // Default avatar if logo is unavailable
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover mr-2 sm:mr-4"
            />
            {/* User Info */}
            <div className="w-full flex flex-col">
              <div className="flex justify-between w-full">
                <h3 className="sm:text-lg font-semibold">{user.name}</h3>
                <p className="w-max text-xs sm:text-sm text-gray-500">
                  {user.services.length} {user.services.length === 0 && "Usług"}
                  {user.services.length === 1 && "Usługa"}
                  {user.services.length === 2 && "Usługi"}
                  {user.services.length === 3 && "Usługi"}
                  {user.services.length === 4 && "Usługi"}
                  {user.services.length === 5 && "Usługi"}
                  {user.services.length > 5 && "Usług"}
                </p>
              </div>
              <p className="text-sm text-gray-600">{user.location.address}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed View */}
      {selectedUser && (
        <div className="mt-6 bg-white p-6 border border-gray-200 rounded-md shadow">
          <div className="flex flex-col">
            {/* Selected User Image */}
            <div className="flex flex-col items-center justify-center lg:justify-start lg:items-start lg:flex-row lg:space-x-6">
              <Image
                width={200}
                height={200}
                src={selectedUser.logo || defaultUser}
                alt={selectedUser.name}
                className="w-20 h-20 rounded-full object-cover"
              />

              {/* Selected User Details */}

              <div className="flex flex-col">
                <h3 className="text-2xl font-bold mb-0 mt-3 lg:mt-0 text-center lg:text-left">
                  {selectedUser.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 italic text-center lg:text-left">
                  {selectedUser?.seek
                    ? "(Pojedynczy specjalista)"
                    : "(Salon kosmetyczny)"}
                </p>
                <p className="text-gray-600 text-center lg:text-left">
                  {selectedUser.location.address}
                </p>
                {!phoneVisible && (
                  <div className="flex gap-2 mt-3 justify-center lg:justify-start">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
                      onClick={() => setPhoneVisible(true)}
                    >
                      Zarezerwuj
                    </button>
                    <Link
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded shadow hover:bg-gray-200 transition"
                      href={
                        selectedUser.userSlugUrl
                          ? `/u/${encodeURIComponent(selectedUser.userSlugUrl)}`
                          : `/u/${encodeURIComponent(selectedUser.uid)}`
                      }
                    >
                      Zobacz profil
                    </Link>
                  </div>
                )}
                {phoneVisible && (
                  <div className="mt-3">
                    <ReservePhone
                      specialistUid={selectedUser.uid}
                      specialistName={selectedUser.name}
                      sourceSlug="search"
                    />
                    {!!selectedUser.phoneNumber && (
                      <Link
                        className="mt-2 inline-block px-4 py-2 bg-gray-200 text-gray-800 rounded"
                        href={`tel:${selectedUser.phoneNumber}`}
                      >
                        Zadzwoń
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div>
              {selectedUser?.description && (
                <div>
                  <h4 className="mt-3 lg:mt-6 text-lg font-semibold">Opis</h4>
                  <p className="mb-2 text-gray-600">
                    {selectedUser.description || ""}
                  </p>
                </div>
              )}
              {!(
                selectedUser?.subscription?.status === "active" ||
                selectedUser?.premiumActive ||
                selectedUser?.active
              ) && (
                <div>
                  <h4 className="text-lg font-semibold">Usługi</h4>
                  <p className="mb-2 text-gray-600">
                    {selectedUser?.services
                      ?.map((s) => s.real_name)
                      .join(", ") || ""}
                  </p>
                </div>
              )}
              {(selectedUser?.subscription?.status === "active" ||
                selectedUser?.premiumActive ||
                selectedUser?.active) && (
                <div>
                  <h4 className="text-lg font-semibold">Usługi</h4>
                  <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-3">
                    {selectedUser?.services
                      ?.slice(
                        0,
                        servicesOpen ? selectedUser?.services?.length : 3
                      )
                      ?.map((s: IService, index: number) => (
                        <div
                          className="bg-gray-200 p-2 rounded-md flex flex-col"
                          key={index}
                        >
                          <h5 className="font-semibold">{s.real_name}</h5>
                          <div className="text-sm text-gray-500">
                            {s?.duration && <>{s.duration} min</>}{" "}
                            {typeof s?.price === "number" && (
                              <>
                                |{" "}
                                <DynamicPrice
                                  basePrice={s.price}
                                  serviceName={s.real_name}
                                  cityName={
                                    selectedUser?.location?.address || ""
                                  }
                                />
                              </>
                            )}
                          </div>
                          <p className={`${s?.description ? "mt-1" : ""}`}>
                            {s?.description}
                          </p>
                        </div>
                      ))}
                  </div>
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className={`${
                      servicesOpen
                        ? "bg-gray-300 hover:bg-gray-400 text-gray-600"
                        : "text-white bg-red-400 hover:bg-red-500 duration-150"
                    } rounded-md h-full block px-4 py-2 mx-auto lg:mx-0 mt-4`}
                  >
                    {servicesOpen ? "Schowaj" : "Wszystkie usługi"}{" "}
                    {!servicesOpen && <>({selectedUser.services.length})</>}
                  </button>
                </div>
              )}
            </div>
            {selectedUser.portfolioImages && (
              <div>
                <h4 className="mt-3 lg:mt-6 text-lg font-semibold">
                  Portfolio
                </h4>
                <div className="mt-1.5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 lg:gap-4 xl:gap-5 2xl:gap-6">
                  {selectedUser.portfolioImages.map(
                    (image: PortfolioImage, i: number) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-md overflow-hidden"
                      >
                        <Image
                          src={image.src}
                          width={350}
                          height={350}
                          alt={image.text}
                          className="absolute inset-0 object-cover w-full h-full"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
