"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setPremiumGiftPopupOpen } from "@/redux/slices/cta";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { setUser } from "@/redux/slices/user";
import { toast } from "react-toastify";
import { FaCheck } from "react-icons/fa";
import UserSlugInput from "@/components/User/UserSlugInput";
import { FaCalendar } from "react-icons/fa6";

interface FastConfigurationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FastConfigurationPopup({
  isOpen,
  onClose,
}: FastConfigurationPopupProps) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    location: user?.location?.address || "",
    userSlugUrl: user?.userSlugUrl || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Update formData when user data changes
  useEffect(() => {
    if (user) {
      const next = {
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        location: user.location?.address || "",
        userSlugUrl: user.userSlugUrl || "",
      };
      // Prevent infinite loops by only setting when something actually changed
      setFormData((prev) =>
        prev.name === next.name &&
        prev.email === next.email &&
        prev.phoneNumber === next.phoneNumber &&
        prev.location === next.location &&
        prev.userSlugUrl === next.userSlugUrl
          ? prev
          : next
      );
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const id = toast.loading("Aktualizuję profil...", {
      position: "top-right",
      isLoading: true,
    });

    try {
      if (!user?.uid) {
        toast.update(id, {
          render: "Błąd: Użytkownik nie jest zalogowany",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        setIsLoading(false);
        return;
      }

      // Normalize slug (basic safety)
      const normalizedSlug = (formData.userSlugUrl || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      // Ensure slug uniqueness if provided
      if (normalizedSlug) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("userSlugUrl", "==", normalizedSlug));
        const snap = await getDocs(q);
        let conflict = false;
        snap.forEach((docSnap) => {
          const data = docSnap.data();
          if (data?.uid && data.uid !== user.uid) conflict = true;
        });
        if (conflict) {
          toast.update(id, {
            render: "Wybrany adres profilu jest zajęty.",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
          setIsLoading(false);
          return;
        }
      }

      // Update user document
      await updateDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        location: {
          ...user.location,
          address: formData.location,
        },
        userSlugUrl: normalizedSlug || user.uid,
        configured: true,
      });

      // Update Redux state
      dispatch(
        setUser({
          ...user,
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          location: {
            ...user.location,
            address: formData.location,
          },
          userSlugUrl: normalizedSlug || user.uid,
          configured: true,
        })
      );

      toast.update(id, {
        render: "Profil zaktualizowany pomyślnie!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      onClose();

      // Show premium gift popup after configuration is complete
      // Check if user has free trial premium (new user)
      if (user?.premiumActive && user?.subscription?.id?.startsWith("free_trial_")) {
        // Small delay to ensure FastConfigurationPopup closes first
        setTimeout(() => {
          dispatch(setPremiumGiftPopupOpen(true));
        }, 300);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.update(id, {
        render: "Błąd podczas aktualizacji profilu",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }

    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed w-screen inset-0 z-[300] flex items-center justify-center p-8 bg-black/80 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fast-config-title"
    >
      <div className="relative bg-white rounded-xl shadow-xl w-[85%] lg:w-max flex flex-col p-6 lg:p-12 lg:min-w-[768px] max-h-[85vh] overflow-y-auto">
        <div className="absolute top-4 right-4 lg:top-16 lg:right-16">
          <FaCalendar className="text-5xl text-zinc-800/20 rotate-45 lg:text-7xl" />
        </div>
        <h2 className="text-4xl lg:text-6xl font-bold text-zinc-800 mb-3 font-baloo">
          Jeszcze jedno...
        </h2>
        <p className="text-sm lg:text-base text-zinc-800 mb-6 lg:mb-12 font-poppins">
          Aby aktywować rezerwacje, ustaw adres profilu.
        </p>
        <h2 className="text-lg lg:text-2xl font-bold text-zinc-800 mb-3 font-baloo">
          Klientki będą miały dostęp do:
        </h2>
        <ul className="list-none text-sm lg:text-base text-zinc-800 mb-6 lg:mb-12 font-poppins">
          <li className="flex items-center gap-2">
            <FaCheck className="text-green-500" />
            Rezerwacji usług
          </li>
          <li className="flex items-center gap-2">
            <FaCheck className="text-green-500" />
            Kontaktu z Tobą
          </li>
          <li className="flex items-center gap-2">
            <FaCheck className="text-green-500" />
            Twojego portfolio
          </li>
          <li className="flex items-center gap-2">
            <FaCheck className="text-green-500" />
            Cennika usług
          </li>
          <li className="flex items-center gap-2">
            <FaCheck className="text-green-500" />
            Ofert szkoleniowych
          </li>
          <li className="flex items-center gap-2">
            <FaCheck className="text-green-500" />
            Ofert pracy
          </li>
        </ul>

        <h2 className="text-base text-zinc-800 mb-1.5 font-poppins">
          Adres profilu
        </h2>
        <UserSlugInput
          value={formData.userSlugUrl}
          onChange={
            // Use stable functional update to prevent re-renders from stale closures
            (val) =>
              setFormData((prev) =>
                prev.userSlugUrl === val ? prev : { ...prev, userSlugUrl: val }
              )
          }
          currentUid={user?.uid || ""}
          baseUrlPrefix="naily.pl/zarezerwuj/"
          onContinue={handleSubmit}
        />
      </div>
    </div>
  );
}
