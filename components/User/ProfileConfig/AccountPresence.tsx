import { User } from "@/types";
import Help from "./Help";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/user";
import { toast } from "react-toastify";
import { FaImage } from "react-icons/fa6";
import Image from "next/image";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase";

export default function AccountPresence({
  user,
  setStep,
}: {
  user: User;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const dispatch = useDispatch();
  function handleState(key: string, value: string) {
    dispatch(setUser({ ...user, [key]: value }));
  }
  const [loading, setLoading] = useState<boolean>(false);
  async function upload(file: File) {
    setLoading(true);
    const randId = uuidv4();
    const imageRef = ref(storage, randId);
    await uploadBytes(imageRef, file);
    const url = await getDownloadURL(imageRef);
    handleState("logo", url);
    setLoading(false);
  }

  return (
    <div>
      <div className="mt-3">
        <label className="font-semibold text-lg">Zdjęcie</label>
        <Help text="Dodaj zdjęcie główne profilu, ostatnia stylizacja manicure, logo - wybór należy do Ciebie!" />
        <label htmlFor="uploader3" className="relative group block mt-2">
          {!user.logo && !loading ? (
            <div className="cursor-pointer w-full h-[120px] rounded-md hover:bg-blue-50 border border-gray-300 bg-white p-3 flex flex-col items-center justify-center">
              <FaImage className="text-3xl" />
              <h3 className="text-center mt-2 font-light text-sm">
                Dodaj zdjęcie
              </h3>
            </div>
          ) : (
            <div className="relative cursor-pointer max-w-36 max-h-36 aspect-square rounded-md border border-gray-300 bg-white p-3 flex items-center justify-center">
              {!loading && user?.logo && (
                <Image
                  src={user.logo}
                  width={124}
                  height={124}
                  alt="logo"
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
      <label className="font-semibold text-lg mt-2 block">Opis</label>
      <Help text="Utwórz opis, który wyświetli się po kliknięciu na Twój profil." />
      <textarea
        value={user?.description}
        onChange={(e) => {
          handleState("description", e.target.value);
        }}
        className={`h-[120px] w-full border-gray-300 border rounded-md p-2 mt-2`}
        placeholder="Uzupełnij pole"
      />
      <div className="flex items-center justify-center w-full mt-3">
        <button
          onClick={() => {
            setStep(1);
          }}
          className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 mx-auto"
        >
          Powrót
        </button>
        <button
          onClick={() => {
            setStep(3);
          }}
          className="w-max mx-auto px-[1.5rem] py-[0.6rem] bg-green-500 text-white rounded-md"
        >
          Dalej (4/4)
        </button>
      </div>{" "}
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
        id="uploader3"
        className="text-white hidden"
      />
    </div>
  );
}
