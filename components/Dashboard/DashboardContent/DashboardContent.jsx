"use client";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/user";
import { updateUser as updateUserDoc } from "@/firebase";
import { auth } from "@/firebase";
import { updateEmail as updateAuthEmail } from "firebase/auth";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  FaBell,
  FaPlus,
  FaCrown,
  FaListUl,
  FaHeart,
  FaCog,
  FaPalette,
} from "react-icons/fa";
import { MdWork } from "react-icons/md";
import ReservationManager from "@/components/User/Dashboard/ReservationManager";
import AdsTab from "@/components/User/Payments/Pricing/AdsTab";
import ServiceConfiguration from "@/components/User/Dashboard/ServiceConfiguration";
import FavoritesManager from "@/components/User/Dashboard/FavoritesManager";
import NotificationManager from "@/components/User/Dashboard/NotificationManager";
import PortfolioManager from "@/components/User/Dashboard/PortfolioManager";
import DashboardOverview from "../DashboardOverview";
import ProfileHeader from "./ProfileHeader";
import ShareProfilePopup from "./ShareProfilePopup";
import OpeningHoursPopup from "./OpeningHoursPopup";
import SettingsTab from "./SettingsTab";
import CalendarTab from "./CalendarTab";
import PremiumExpiredPopup from "./PremiumExpiredPopup";
import { uploadBanner as uploadBannerUtil, uploadProfilePhoto as uploadProfilePhotoUtil } from "./bannerUtils";
import { FaTrophy } from "react-icons/fa6";
import JobOffersManager from "@/components/User/Dashboard/JobOffersManager";

export default function DashboardContent({
  activeTab,
  user,
  firebaseUser,
  dashboardData,
  getStatusColor,
  getStatusText,
  setActiveTab,
}) {
  const dispatch = useDispatch();

  function getSafeSettings(u) {
    return (
      u?.settings || {
        emailNotifications: false,
        autoReminders: false,
        pushNotifications: false,
        darkMode: false,
        twoFactorEnabled: false,
        publicProfile: true,
      }
    );
  }

  // Inline edit states for basic information
  const [editing, setEditing] = useState({
    name: false,
    email: false,
    phone: false,
    description: false,
  });
  const [formValues, setFormValues] = useState({
    name: user?.name || "",
    email: firebaseUser?.email || user?.email || "",
    phone: user?.phoneNumber || user?.phone || "",
    description: user?.description || "",
  });

  // Share profile popup state
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [copied, setCopied] = useState(false);

  // Opening hours popup state
  const [showOpeningHoursPopup, setShowOpeningHoursPopup] = useState(false);
  const [openingHoursData, setOpeningHoursData] = useState({});

  // Premium expired popup state
  const [showPremiumExpiredPopup, setShowPremiumExpiredPopup] = useState(false);

  // Banner upload state
  const [bannerUploading, setBannerUploading] = useState(false);
  const bannerFileInputRef = useRef(null);

  // Profile photo upload state
  const [profilePhotoUploading, setProfilePhotoUploading] = useState(false);
  const profilePhotoFileInputRef = useRef(null);

  useEffect(() => {
    setFormValues({
      name: user?.name || "",
      email: firebaseUser?.email || user?.email || "",
      phone: user?.phoneNumber || user?.phone || "",
      description: user?.description || "",
    });
  }, [
    user?.name,
    user?.phoneNumber,
    user?.phone,
    user?.description,
    firebaseUser?.email,
    user?.email,
  ]);

  // Initialize opening hours from user data
  useEffect(() => {
    if (user?.openingHours) {
      setOpeningHoursData(user.openingHours);
    } else {
      const defaultHours = {
        monday: { enabled: false, start: "09:00", end: "17:00" },
        tuesday: { enabled: false, start: "09:00", end: "17:00" },
        wednesday: { enabled: false, start: "09:00", end: "17:00" },
        thursday: { enabled: false, start: "09:00", end: "17:00" },
        friday: { enabled: false, start: "09:00", end: "17:00" },
        saturday: { enabled: false, start: "09:00", end: "17:00" },
        sunday: { enabled: false, start: "09:00", end: "17:00" },
      };
      setOpeningHoursData(defaultHours);
    }
  }, [user?.openingHours]);

  // Google metadata configuration state
  const [metaDraft, setMetaDraft] = useState({
    seoTitle: user?.metadata?.seoTitle || "",
    seoDescription: user?.metadata?.seoDescription || "",
    seoKeywords: user?.metadata?.seoKeywords || "",
  });

  useEffect(() => {
    setMetaDraft({
      seoTitle: user?.metadata?.seoTitle || "",
      seoDescription: user?.metadata?.seoDescription || "",
      seoKeywords: user?.metadata?.seoKeywords || "",
    });
  }, [
    user?.metadata?.seoTitle,
    user?.metadata?.seoDescription,
    user?.metadata?.seoKeywords,
  ]);

  async function saveBasicField(fieldKey) {
    if (!user?.uid) return;
    const updates = {};
    if (fieldKey === "name") updates.name = formValues.name;
    if (fieldKey === "phone") updates.phoneNumber = formValues.phone;
    if (fieldKey === "email") updates.email = formValues.email;
    if (fieldKey === "description") updates.description = formValues.description;

    const nextUser = { ...user, ...updates };
    dispatch(setUser(nextUser));
    try {
      await updateUserDoc(user.uid, updates);
      if (fieldKey === "email" && auth?.currentUser && formValues.email) {
        try {
          await updateAuthEmail(auth.currentUser, formValues.email);
        } catch (_) {
          // Ignore auth email update failure
        }
      }
      setEditing((prev) => ({ ...prev, [fieldKey]: false }));
      toast.success("Zmiany zostały zapisane");
    } catch (e) {
      dispatch(setUser(user));
      toast.error("Nie udało się zapisać zmian");
    }
  }

  async function saveMetadata() {
    if (!user?.uid) return;
    const next = {
      ...user,
      metadata: { ...(user?.metadata || {}), ...metaDraft },
    };
    dispatch(setUser(next));
    try {
      await updateUserDoc(user.uid, { metadata: next.metadata });
    } catch (e) {
      dispatch(setUser(user));
    }
  }

  async function toggleSetting(settingKey) {
    if (!user?.uid) return;
    const currentSettings = getSafeSettings(user);
    const nextSettings = {
      ...currentSettings,
      [settingKey]: !Boolean(currentSettings?.[settingKey]),
    };
    const nextUser = { ...user, settings: nextSettings };
    dispatch(setUser(nextUser));
    try {
      await updateUserDoc(user.uid, { settings: nextSettings });
    } catch (e) {
      dispatch(setUser(user));
    }
  }

  async function handleBannerUpload(file) {
    if (!user?.uid) return;
    setBannerUploading(true);
    try {
      const url = await uploadBannerUtil(
        file,
        user.uid,
        updateUserDoc,
        dispatch,
        setUser
      );
      const nextUser = { ...user, bannerUrl: url };
      dispatch(setUser(nextUser));
      await updateUserDoc(user.uid, { bannerUrl: url });
      toast.success("Zdjęcie w tle zostało zaktualizowane");
    } catch (e) {
      toast.error("Nie udało się wgrać zdjęcia w tle");
      console.error(e);
    } finally {
      setBannerUploading(false);
      if (bannerFileInputRef.current) {
        bannerFileInputRef.current.value = "";
      }
    }
  }

  async function handleProfilePhotoUpload(file) {
    if (!user?.uid) return;
    setProfilePhotoUploading(true);
    try {
      const url = await uploadProfilePhotoUtil(
        file,
        user.uid,
        updateUserDoc,
        dispatch,
        setUser
      );
      const nextUser = { ...user, logo: url };
      dispatch(setUser(nextUser));
      await updateUserDoc(user.uid, { logo: url });
      toast.success("Zdjęcie profilu zostało zaktualizowane");
    } catch (e) {
      toast.error("Nie udało się wgrać zdjęcia profilu");
      console.error(e);
    } finally {
      setProfilePhotoUploading(false);
      if (profilePhotoFileInputRef.current) {
        profilePhotoFileInputRef.current.value = "";
      }
    }
  }

  function shareProfile() {
    setShowSharePopup(true);
  }

  function copyProfileLink() {
    try {
      const url = getProfileUrl();
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (_) {}
  }

  async function saveOpeningHours(data) {
    if (!user?.uid) return;
    const nextUser = { ...user, openingHours: data };
    dispatch(setUser(nextUser));
    try {
      await updateUserDoc(user.uid, { openingHours: data });
      setShowOpeningHoursPopup(false);
      toast.success("Godziny otwarcia zostały zapisane");
    } catch (e) {
      dispatch(setUser(user));
      toast.error("Nie udało się zapisać godzin otwarcia");
    }
  }

  function getProfileUrl() {
    return `${window?.location?.origin || ""}/zarezerwuj/${
      user?.userSlugUrl || user?.uid || "profil"
    }`;
  }

  // Check if user has active premium access
  function hasPremiumAccess() {
    if (!user) return false;
    
    // Check if premium is active (including trialing status for sandbox/test mode)
    const subscriptionStatus = user?.subscription?.status;
    const isPremiumActive = 
      user?.premiumActive || 
      user?.active || 
      subscriptionStatus === "active" ||
      subscriptionStatus === "trialing";
    
    if (!isPremiumActive) return false;
    
    // Check if subscription period has expired
    if (user?.subscription?.currentPeriodEnd) {
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      const periodEnd = user.subscription.currentPeriodEnd;
      if (periodEnd < currentTime) {
        return false; // Subscription expired
      }
    }
    
    return true;
  }

  // Determine if freemium expired or premium expired
  function isFreemiumExpired() {
    if (!user?.subscription?.id) return true; // No subscription = freemium expired
    return user.subscription.id.startsWith("free_trial_");
  }

  // Check premium access when accessing premium tabs
  useEffect(() => {
    const premiumTabs = ["calendar", "services", "portfolio"];
    if (premiumTabs.includes(activeTab)) {
      if (!hasPremiumAccess()) {
        setShowPremiumExpiredPopup(true);
      } else {
        setShowPremiumExpiredPopup(false);
      }
    } else {
      setShowPremiumExpiredPopup(false);
    }
  }, [activeTab, user]);

  return (
    <div className="w-full">
      {activeTab === "overview" && (
        <>
          {/* Welcome / Quick Actions header */}
          {user?.uid && (
              <ProfileHeader
                user={user}
                openingHours={openingHoursData}
                onOpeningHoursEdit={() => setShowOpeningHoursPopup(true)}
                editing={editing}
                onEditingChange={setEditing}
                formValues={formValues}
                onFormValuesChange={setFormValues}
                onSaveField={saveBasicField}
                bannerFileInputRef={bannerFileInputRef}
                bannerUploading={bannerUploading}
                onBannerUpload={handleBannerUpload}
                profilePhotoFileInputRef={profilePhotoFileInputRef}
                profilePhotoUploading={profilePhotoUploading}
                onProfilePhotoUpload={handleProfilePhotoUpload}
                setActiveTab={setActiveTab}
                onShare={shareProfile}
                shareProfile={shareProfile}
                dashboardData={dashboardData}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
              />
          )}
          
        </>
      )}

      <div className="px-4 pb-6">
        {/* Tab Content */}
      {activeTab === "notifications" && (
        <Card className="shadow-lg rounded-2xl border-2 border-blue-100 my-6 overflow-hidden">
          {/* Desktop Header */}
          <CardHeader className="hidden md:block pt-8 pb-6 px-8 bg-gradient-to-br from-blue-50 via-white to-blue-50/50">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
                  <div className="relative p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg transform hover:scale-105 transition-transform">
                    <FaBell className="text-white text-2xl" />
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <CardTitle className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                    Powiadomienia
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600 leading-relaxed">
                    Bądź na bieżąco — tutaj znajdziesz aktualizacje dotyczące Twojego konta i rezerwacji.
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>

          {/* Mobile Header */}
          <CardHeader className="md:hidden pt-6 pb-4 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-50/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 rounded-xl blur-lg opacity-20"></div>
                <div className="relative p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                  <FaBell className="text-white text-xl" />
                </div>
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  Powiadomienia
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-1">
                  Bądź na bieżąco — tutaj znajdziesz aktualizacje dotyczące Twojego konta i rezerwacji.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-2 pb-8 px-4 md:px-8">
            <NotificationManager />
          </CardContent>
        </Card>
      )}

      {activeTab === "ads" && (
        <Card className="shadow-sm rounded-xl">
          <CardHeader className="p-6 pb-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <FaCrown className="text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Reklama</CardTitle>
                <CardDescription>
                  Zarządzaj budżetem reklamowym i włącz promocję w Google.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <AdsTab user={user} />
          </CardContent>
        </Card>
      )}

      {activeTab === "services" && (
        <>
          {hasPremiumAccess() ? (
            <Card className="shadow-lg rounded-2xl border-2 border-blue-100 my-6 overflow-hidden">
          {/* Desktop Header */}
          <CardHeader className="hidden md:block pt-8 pb-6 px-8 bg-gradient-to-br from-blue-50 via-white to-blue-50/50">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
                  <div className="relative p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg transform hover:scale-105 transition-transform">
                    <FaListUl className="text-white text-2xl" />
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <CardTitle className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                    Moje usługi
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600 leading-relaxed">
                    Dodawaj, edytuj i organizuj usługi, które oferujesz.
                  </CardDescription>
                </div>
              </div>
              <button
                onClick={() => {
                  // Trigger add service from ServiceConfiguration
                  const event = new CustomEvent('openServiceForm');
                  window.dispatchEvent(event);
                }}
                className="group relative px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-bold text-base overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative flex items-center gap-2">
                  <FaPlus className="text-xl group-hover:rotate-90 transition-transform duration-300" />
                  <span>Dodaj usługę</span>
                </div>
              </button>
            </div>
          </CardHeader>

          {/* Mobile Header */}
          <CardHeader className="md:hidden pt-6 pb-4 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-50/50">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-600 rounded-xl blur-lg opacity-20"></div>
                  <div className="relative p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                    <FaListUl className="text-white text-xl" />
                  </div>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    Moje usługi
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 mt-1">
                    Dodawaj, edytuj i organizuj usługi, które oferujesz.
                  </CardDescription>
                </div>
              </div>
              <button
                onClick={() => {
                  const event = new CustomEvent('openServiceForm');
                  window.dispatchEvent(event);
                }}
                className="w-full group relative px-5 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-bold text-base overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <FaPlus className="text-lg group-hover:rotate-90 transition-transform duration-300" />
                  <span>Dodaj usługę</span>
                </div>
              </button>
            </div>
          </CardHeader>

          <CardContent className="pt-2 pb-8 px-4 md:px-8">
            <ServiceConfiguration />
          </CardContent>
        </Card>
          ) : null}
        </>
      )}

      {activeTab === "portfolio" && (
        <>
          {hasPremiumAccess() ? (
            <Card className="shadow-lg rounded-2xl border-2 border-blue-100 my-6 overflow-hidden">
          {/* Desktop Header */}
          <CardHeader className="hidden md:block pt-8 pb-6 px-8 bg-gradient-to-br from-blue-50 via-white to-blue-50/50">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
                  <div className="relative p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg transform hover:scale-105 transition-transform">
                    <FaTrophy className="text-white text-2xl" />
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <CardTitle className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                    Moja galeria
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600 leading-relaxed">
                    Dodawaj zdjęcia swoich najnowszych prac i zarządzaj nimi.
                  </CardDescription>
                </div>
              </div>
              <button
                onClick={() => {
                  // Trigger file picker from GalleryManager
                  const event = new CustomEvent('openPortfolioPicker');
                  window.dispatchEvent(event);
                }}
                className="group relative px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-bold text-base overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative flex items-center gap-2">
                  <FaPlus className="text-xl group-hover:rotate-90 transition-transform duration-300" />
                  <span>Dodaj zdjęcia</span>
                </div>
              </button>
            </div>
          </CardHeader>

          {/* Mobile Header */}
          <CardHeader className="md:hidden pt-6 pb-4 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-50/50">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-600 rounded-xl blur-lg opacity-20"></div>
                  <div className="relative p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                    <FaTrophy className="text-white text-xl" />
                  </div>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    Moja galeria
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 mt-1">
                    Dodawaj zdjęcia swoich ostatnich prac i zarządzaj nimi.
                  </CardDescription>
                </div>
              </div>
              <button
                onClick={() => {
                  const event = new CustomEvent('openPortfolioPicker');
                  window.dispatchEvent(event);
                }}
                className="w-full group relative px-5 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-bold text-base overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <FaPlus className="text-lg group-hover:rotate-90 transition-transform duration-300" />
                  <span>Dodaj zdjęcia</span>
                </div>
              </button>
            </div>
          </CardHeader>

          <CardContent className="pt-2 pb-8 px-4 md:px-8">
            <PortfolioManager uid={user?.uid} />
          </CardContent>
        </Card>
          ) : null}
        </>
      )}

      {activeTab === "favorites" && (
        <Card className="shadow-sm rounded-xl">
          <CardHeader className="p-6 pb-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <FaHeart className="text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Ulubione</CardTitle>
                <CardDescription>
                  Zapisuj miejsca i specjalistów, do których chcesz wrócić.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <FavoritesManager />
          </CardContent>
        </Card>
      )}

      {activeTab === "calendar" && (
        <>
          {hasPremiumAccess() ? (
            <CalendarTab user={user} />
          ) : null}
        </>
      )}

      {activeTab === "joboffers" && (
        <>
          {user?.seek === false ? (
            <Card className="shadow-lg rounded-2xl border-2 border-blue-100 my-6 overflow-hidden">
              <CardHeader className="hidden md:block pt-8 pb-6 px-8 bg-gradient-to-br from-blue-50 via-white to-blue-50/50">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-5">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
                      <div className="relative p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg transform hover:scale-105 transition-transform">
                        <MdWork className="text-white text-2xl" />
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <CardTitle className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                        Oferty pracy
                      </CardTitle>
                      <CardDescription className="text-base text-gray-600 leading-relaxed">
                        Dodawaj i zarządzaj ofertami pracy w Twoim salonie.
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2 pb-8 px-4 md:px-8">
                <JobOffersManager user={user} />
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-sm rounded-xl">
              <CardContent className="p-6">
                <p className="text-center text-gray-600">
                  Ta funkcja jest dostępna tylko dla salonów.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {activeTab === "settings" && (
        <Card className="shadow-lg rounded-2xl border-2 border-blue-100 my-6 overflow-hidden">
          {/* Desktop Header */}
          <CardHeader className="hidden md:block pt-8 pb-6 px-8 bg-gradient-to-br from-blue-50 via-white to-blue-50/50">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
                  <div className="relative p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg transform hover:scale-105 transition-transform">
                    <FaCog className="text-white text-2xl" />
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <CardTitle className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                    Ustawienia konta
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600 leading-relaxed">
                    Zarządzaj danymi profilu, preferencjami, prywatnością i bezpieczeństwem.
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>

          {/* Mobile Header */}
          <CardHeader className="md:hidden pt-6 pb-4 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-50/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 rounded-xl blur-lg opacity-20"></div>
                <div className="relative p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                  <FaCog className="text-white text-xl" />
                </div>
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  Ustawienia konta
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-1">
                  Zarządzaj danymi profilu, preferencjami, prywatnością i bezpieczeństwem.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-2 pb-8 px-4 md:px-8">
            <SettingsTab
              user={user}
              firebaseUser={firebaseUser}
              editing={editing}
              onEditingChange={setEditing}
              formValues={formValues}
              onFormValuesChange={setFormValues}
              onSaveField={saveBasicField}
              metaDraft={metaDraft}
              onMetaDraftChange={setMetaDraft}
              onSaveMetadata={saveMetadata}
              getSafeSettings={getSafeSettings}
              onToggleSetting={toggleSetting}
            />
          </CardContent>
        </Card>
      )}
      </div>
      
      {/* Popups */}
      <ShareProfilePopup
        isOpen={showSharePopup}
        onClose={() => setShowSharePopup(false)}
        profileUrl={getProfileUrl()}
        onCopy={copyProfileLink}
        copied={copied}
      />

      <OpeningHoursPopup
        isOpen={showOpeningHoursPopup}
        onClose={() => setShowOpeningHoursPopup(false)}
        openingHours={user?.openingHours}
        onSave={saveOpeningHours}
      />

      <PremiumExpiredPopup
        isOpen={showPremiumExpiredPopup}
        onClose={() => {
          setShowPremiumExpiredPopup(false);
          setActiveTab("overview");
        }}
        isFreemiumExpired={isFreemiumExpired()}
        onUpgrade={() => {
          setShowPremiumExpiredPopup(false);
          setActiveTab("settings");
        }}
      />
    </div>
  );
}

