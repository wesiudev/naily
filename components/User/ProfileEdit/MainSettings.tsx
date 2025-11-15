import { setUser } from "@/redux/slices/user";
import { User } from "@/types";
import { useDispatch } from "react-redux";
import { MapInput } from "../ProfileConfig/AccountLocation/MapInput";
import { useGoogleMapsAPI } from "@/utils/googleMapsLoader";

import { useMemo, useState } from "react";
import Image from "next/image";
import { FaImage } from "react-icons/fa6";
import { v4 as uuidv4 } from "uuid";
import { storage, updateUser } from "@/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";
import UserSlugInput from "@/components/User/UserSlugInput";
export default function MainSettings({ user }: { user: User }) {
  const memoizedUser = useMemo(() => user, [user]);
  const dispatch = useDispatch();
  function handleState<T extends keyof User>(key: T, value: User[T]) {
    dispatch(setUser({ ...user, [key]: value }));
  }
  const { isReady, error } = useGoogleMapsAPI({ libraries: ["places"] });
  const [loading, setLoading] = useState<boolean>(false);
  async function cropToAspect(file: File, aspect: number): Promise<Blob> {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    await new Promise((res, rej) => {
      img.onload = () => res(null);
      img.onerror = rej;
    });
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const currentAspect = iw / ih;
    let sx = 0;
    let sy = 0;
    let sw = iw;
    let sh = ih;
    if (currentAspect > aspect) {
      // too wide -> crop width
      sw = Math.round(ih * aspect);
      sx = Math.round((iw - sw) / 2);
    } else if (currentAspect < aspect) {
      // too tall -> crop height
      sh = Math.round(iw / aspect);
      sy = Math.round((ih - sh) / 2);
    }
    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    return await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b as Blob), "image/jpeg", 0.9)
    );
  }

  async function upload(file: File) {
    setLoading(true);
    try {
      const cropped = await cropToAspect(file, 1); // square avatar
      const randId = uuidv4();
      const imageRef = ref(storage, `avatars/${user?.uid || "anon"}/${randId}`);
      await uploadBytes(
        imageRef,
        new File([cropped], file.name, { type: "image/jpeg" })
      );
      const url = await getDownloadURL(imageRef);
      handleState("logo", url);
      if (user?.uid) await updateUser(user.uid, { logo: url });
      toast.success("Zdjęcie profilu zaktualizowane");
    } catch (e) {
      toast.error("Nie udało się wgrać zdjęcia");
    } finally {
      setLoading(false);
    }
  }
  async function uploadBanner(file: File) {
    setLoading(true);
    try {
      const cropped = await cropToAspect(file, 16 / 9);
      const randId = uuidv4();
      const imageRef = ref(storage, `banners/${user?.uid || "anon"}/${randId}`);
      await uploadBytes(
        imageRef,
        new File([cropped], file.name, { type: "image/jpeg" })
      );
      const url = await getDownloadURL(imageRef);
      handleState("bannerUrl", url);
      if (user?.uid) await updateUser(user.uid, { bannerUrl: url });
      toast.success("Baner zaktualizowany");
    } catch (e) {
      toast.error("Nie udało się wgrać banera");
    } finally {
      setLoading(false);
    }
  }

  async function removeLogo() {
    handleState("logo", "");
    if (user?.uid) await updateUser(user.uid, { logo: "" });
    toast.success("Usunięto zdjęcie profilu");
  }

  async function removeBanner() {
    handleState("bannerUrl", "");
    if (user?.uid) await updateUser(user.uid, { bannerUrl: "" });
    toast.success("Usunięto baner");
  }
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 mt-4 gap-3">
        <div className="flex flex-col">
          <label className="font-semibold sm:text-lg">Nazwa</label>
          <input
            type="text"
            value={user?.name}
            onChange={(e) => {
              handleState("name", e.target.value);
            }}
            className={`border-gray-300 border rounded-md p-2 mt-1`}
            placeholder="Jan Kowalski sp. z o.o."
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold sm:text-lg">Numer telefonu</label>
          <input
            type="text"
            value={user?.phoneNumber}
            onChange={(e) => {
              handleState("phoneNumber", e.target.value);
            }}
            className={`border-gray-300 border rounded-md p-2 mt-1`}
            placeholder="+48 123 456 789"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold sm:text-lg">
            Ilość klientek dziennie
          </label>
          <input
            type="number"
            min={0}
            value={
              Number.isFinite(Number(user?.dailyClients))
                ? user?.dailyClients
                : 0
            }
            onChange={(e) => {
              const val = parseInt(e.target.value || "0", 10);
              handleState(
                "dailyClients",
                (isNaN(val) ? 0 : val) as User["dailyClients"]
              );
            }}
            className={`border-gray-300 border rounded-md p-2 mt-1`}
            placeholder="np. 5"
          />
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-lg">Baner</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => document.getElementById("uploaderBanner")?.click()}
              className="px-3 py-1.5 text-xs rounded-md bg-primary-600 text-white hover:bg-primary-700"
            >
              Zmień baner
            </button>
            {user?.bannerUrl && (
              <button
                type="button"
                onClick={removeBanner}
                className="px-3 py-1.5 text-xs rounded-md bg-neutral-200 text-neutral-800 hover:bg-neutral-300"
              >
                Usuń
              </button>
            )}
          </div>
        </div>
        <label htmlFor="uploaderBanner" className="relative group block mt-2">
          {!user.bannerUrl && !loading ? (
            <div className="cursor-pointer w-full h-[160px] rounded-md hover:bg-blue-50 border border-gray-300 bg-white p-3 flex flex-col items-center justify-center">
              <FaImage className="text-3xl" />
              <h3 className="text-center mt-2 font-light text-sm">
                Dodaj baner (16:9, min 1280×720)
              </h3>
            </div>
          ) : (
            <div className="relative cursor-pointer w-full h-[160px] rounded-md border border-gray-300 bg-white flex items-center justify-center overflow-hidden">
              {!loading && user?.bannerUrl && (
                <Image
                  src={user?.bannerUrl}
                  fill
                  alt="Baner profilu"
                  className="object-cover"
                />
              )}
              {loading && (
                <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full border-b-2 border-gray-900 h-12 w-12"></div>
                </div>
              )}
            </div>
          )}
        </label>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-lg">Zdjęcie</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => document.getElementById("uploader1")?.click()}
              className="px-3 py-1.5 text-xs rounded-md bg-primary-600 text-white hover:bg-primary-700"
            >
              Zmień zdjęcie
            </button>
            {user?.logo && (
              <button
                type="button"
                onClick={removeLogo}
                className="px-3 py-1.5 text-xs rounded-md bg-neutral-200 text-neutral-800 hover:bg-neutral-300"
              >
                Usuń
              </button>
            )}
          </div>
        </div>
        <label htmlFor="uploader1" className="relative group block mt-2">
          {!user.logo && !loading ? (
            <div className="cursor-pointer w-full h-[120px] rounded-md hover:bg-blue-50 border border-gray-300 bg-white p-3 flex flex-col items-center justify-center">
              <FaImage className="text-3xl" />
              <h3 className="text-center mt-2 font-light text-sm">
                Dodaj zdjęcie (1:1, min 400×400)
              </h3>
            </div>
          ) : (
            <div className="relative cursor-pointer max-w-36 max-h-36 aspect-square rounded-md border border-gray-300 bg-white p-3 flex items-center justify-center">
              {!loading && user?.logo && (
                <Image
                  src={user?.logo}
                  width={124}
                  height={124}
                  alt="Logo użytkownika"
                  className="absolute inset-0 object-cover w-auto max-h-[90%] mx-auto my-auto"
                />
              )}
              {loading && (
                <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full border-b-2 border-gray-900 h-12 w-12"></div>
                </div>
              )}
            </div>
          )}
        </label>
      </div>
      <label className="font-semibold text-lg mt-3 block">Opis</label>
      <textarea
        value={user?.description}
        onChange={(e) => {
          handleState("description", e.target.value);
        }}
        className={`h-[120px] w-full border-gray-300 border rounded-md p-2 mt-2`}
        placeholder="Uzupełnij pole"
      />
      <div className="flex flex-col mt-3">
        <label className="font-semibold sm:text-lg">Lokalizacja</label>
        <MapInput user={memoizedUser} isLoaded={isReady} loadError={error} />
      </div>
      <div className="flex flex-col mt-3">
        <label className="font-semibold sm:text-lg">Adres profilu</label>
        <UserSlugInput
          value={user?.userSlugUrl || ""}
          onChange={(val) => handleState("userSlugUrl", val)}
          currentUid={user?.uid || ""}
          baseUrlPrefix="naily.pl/u/"
        />
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files![0];
          if (!file) return;
          const validType = file.type.startsWith("image/");
          const validSize = file.size <= 5 * 1024 * 1024;
          if (!validType || !validSize) {
            toast.error(
              "Tylko zdjęcia o rozmiarze do 5MB są dozwolone (kwadratowe lub 16:9)",
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
              }
            );
            return;
          }
          upload(file);
        }}
        id="uploader1"
        className="text-white hidden"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files![0];
          if (!file) return;
          const validType = file.type.startsWith("image/");
          const validSize = file.size <= 5 * 1024 * 1024;
          if (!validType || !validSize) {
            toast.error(
              "Tylko zdjęcia o rozmiarze do 5MB są dozwolone (zalecany 16:9)",
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
              }
            );
            return;
          }
          uploadBanner(file);
        }}
        id="uploaderBanner"
        className="text-white hidden"
      />
    </div>
  );
}
