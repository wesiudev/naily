"use client";
import Image from "next/image";
import QuickActions from "./QuickActions";
import { FaUser, FaImage, FaCamera } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import OpeningHoursDisplay from "./OpeningHoursDisplay";
import DescriptionEditor from "./DescriptionEditor";
import ContactInfo from "./ContactInfo";
import { Card, CardContent } from "@/components/ui/card";
import DashboardOverview from "../DashboardOverview";
import { toast } from "react-toastify";

export default function ProfileHeader({
  user,
  openingHours,
  onOpeningHoursEdit,
  editing,
  onEditingChange,
  formValues,
  onFormValuesChange,
  onSaveField,
  bannerFileInputRef,
  bannerUploading,
  onBannerUpload,
  profilePhotoFileInputRef,
  profilePhotoUploading,
  onProfilePhotoUpload,
  setActiveTab,
  onShare,
  shareProfile,
  dashboardData,
  getStatusColor,
  getStatusText,
}) {
  function handleBannerFileChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      onBannerUpload(file);
    }
  }

  function openBannerFilePicker() {
    bannerFileInputRef.current?.click();
  }

  function handleProfilePhotoFileChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validType = file.type.startsWith("image/");
      const validSize = file.size <= 5 * 1024 * 1024; // 5MB
      if (!validType || !validSize) {
        toast.error("Tylko zdjęcia o rozmiarze do 5MB są dozwolone", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      onProfilePhotoUpload(file);
    }
  }

  function openProfilePhotoFilePicker() {
    profilePhotoFileInputRef.current?.click();
  }

  return (
    <div className="w-full flex flex-col mt-3 lg:mt-2.5">
      {/* Banner & Profile Section */}
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200">
        {/* Background Image */}
        {user?.bannerUrl ? (
          <div className="relative w-full h-48 lg:h-64">
            <Image
              src={user.bannerUrl}
              alt="Banner"
              fill
              className="object-cover"
              quality={100}
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        ) : (
          <div className="w-full h-48 lg:h-64 flex items-center justify-center">
            <div className="text-center">
              <FaImage className="w-16 h-16 text-neutral-400 mx-auto mb-3" />
            </div>
          </div>
        )}

        {/* Banner Upload Button */}
        <div className="absolute top-4 right-4 z-10">
          <input
            ref={bannerFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleBannerFileChange}
            className="hidden"
          />
          <button
            onClick={openBannerFilePicker}
            disabled={bannerUploading}
            className="px-4 py-2 bg-white/90 hover:bg-white backdrop-blur-sm text-neutral-700 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {bannerUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-700 rounded-full animate-spin" />
                <span>Wczytywanie...</span>
              </>
            ) : (
              <>
                <FaCamera className="w-4 h-4" />
                <span>{user?.bannerUrl ? "Zmień zdjęcie w tle" : "Dodaj zdjęcie w tle"}</span>
              </>
            )}
          </button>
        </div>

        {/* User Info Card Overlay */}
        <div className="relative">
          <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
            {/* Avatar */}
            <div className="absolute -top-[75px] lg:-top-[5rem] left-4">
              <div className="relative group">
                <Avatar className="h-[150px] w-[150px] lg:h-[10rem] lg:w-[10rem] border-4 border-white shadow-lg flex-shrink-0">
                  {user?.logo ? (
                    <AvatarImage src={user.logo} alt={user?.name || "Avatar"} />
                  ) : null}
                  <AvatarFallback className="bg-blue-500 text-white">
                    <FaUser className="h-8 w-8 lg:h-10 lg:w-10" />
                  </AvatarFallback>
                </Avatar>
                {/* Camera Icon Overlay */}
                <button
                  onClick={openProfilePhotoFilePicker}
                  disabled={profilePhotoUploading}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full cursor-pointer disabled:cursor-not-allowed"
                  title="Zmień zdjęcie profilu"
                  aria-label="Zmień zdjęcie profilu"
                >
                  {profilePhotoUploading ? (
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FaCamera className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                  )}
                </button>
                {/* Hidden file input */}
                <input
                  ref={profilePhotoFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoFileChange}
                  className="hidden"
                />
              </div>
            </div>
            <div className="lg:pl-[10rem] pl-[10rem]">
              <div className="font-poppins flex flex-row items-center justify-between w-full gap-2 mb-2">
                <div className="text-lg lg:text-2xl font-bold">
                  {`Cześć${user?.name ? ", " + user.name : ""}!`}{" "}
                  <span className="hidden lg:inline">👋</span>
                </div>
              </div>
              
              <div className="inline-block mb-4 text-white bg-zinc-500 px-2.5 py-1 rounded-full font-roboto text-xs">
                {user?.seek ? "Stylistka paznokci" : "Salon kosmetyczny"}
              </div>
            </div>

          <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-12 lg:mt-6">
            <div className="w-full lg:w-1/3">
              {/* User Details */}
              <div className="flex-1 min-w-0">

                      <OpeningHoursDisplay
                        openingHours={openingHours}
                        onEdit={onOpeningHoursEdit}
                      />
                    <DescriptionEditor
                      description={user?.description}
                      isEditing={editing.description}
                      onEdit={() => onEditingChange((p) => ({ ...p, description: true }))}
                      onCancel={() => {
                        onFormValuesChange((v) => ({
                          ...v,
                          description: user?.description || "",
                        }));
                        onEditingChange((p) => ({ ...p, description: false }));
                      }}
                      value={formValues.description}
                      onChange={(e) =>
                        onFormValuesChange((v) => ({
                          ...v,
                          description: e.target.value,
                        }))
                      }
                      onSave={() => onSaveField("description")}
                    />
                <ContactInfo user={user} />
              </div>
            </div>
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              <Card className="shadow-sm rounded-xl">
                <CardContent className="w-full">
                  <DashboardOverview
                    setActiveTab={setActiveTab}
                    dashboardData={dashboardData}
                    getStatusColor={getStatusColor}
                    getStatusText={getStatusText}
                  />
                </CardContent>
              </Card>
              <QuickActions
                user={user}
                setActiveTab={setActiveTab}
                onShare={shareProfile}
              />
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

