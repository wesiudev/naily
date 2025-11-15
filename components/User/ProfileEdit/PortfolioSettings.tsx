/* eslint-disable @typescript-eslint/no-explicit-any */
import { storage } from "@/firebase";
import { setUser } from "@/redux/slices/user";
import { PortfolioImage, User } from "@/types";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { useState } from "react";
import { FaImages, FaUpload } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
export default function PortfolioSettings({ user }: { user: User }) {
  const [dragging, setDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [isUploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState();
  const dispatch = useDispatch();
  async function handler(files: any) {
    const isActive = Boolean(
      user?.subscription?.status === "active" ||
        user?.premiumActive ||
        user?.active
    );
    const currentCount = Array.isArray(user?.portfolioImages)
      ? user.portfolioImages.length
      : 0;
    const maxFree = 6;
    let limitedFiles = files as any[];
    if (!isActive) {
      const remaining = Math.max(0, maxFree - currentCount);
      if (remaining <= 0) {
        toast.error(
          "Osiągnięto limit 6 zdjęć w planie darmowym. Aktywuj konto, aby dodać więcej.",
          { position: "top-center" }
        );
        return;
      }
      if (files.length > remaining) {
        toast.info(
          `Dodano ${remaining} z ${files.length} zdjęć (limit planu darmowego).`,
          {
            position: "top-center",
          }
        );
        limitedFiles = files.slice(0, remaining);
      }
    }

    setUploading(true);
    const localImagesArray: any = [];
    const uploadFile = async (file: any) => {
      const randId = uuidv4();
      const imageRef = ref(storage, randId);
      try {
        await uploadBytes(imageRef, file);
        const url = await getDownloadURL(imageRef);
        const data = {
          src: url,
        };
        localImagesArray.push(data);
      } catch (err: any) {
        toast.error(`Wystąpił błąd podczas przesyłania zdjęcia: ${err}`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    };
    const uploadPromises = limitedFiles.map(uploadFile);
    try {
      await Promise.all(uploadPromises);
      const updatedImages = user?.portfolioImages
        ? [...user?.portfolioImages, ...localImagesArray]
        : localImagesArray;
      dispatch(setUser({ ...user, portfolioImages: updatedImages }));
      setUploading(false);
    } catch (err: any) {
      setUploading(false);
      toast.error(`Wystąpił błąd podczas przesyłania zdjęć: ${err}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  }

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);
    setDragging(true);
  };

  const handleDragEnd = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev - 1);
    if (dragCounter <= 1) {
      setDragging(false);
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    if (e.dataTransfer.files.length) {
      const filesArray = Array.from(e.dataTransfer.files).filter((file: any) =>
        file.type.startsWith("image/")
      );
      handler(filesArray); // Pass the array of valid files to the handler
    }
  };
  return (
    <div className="w-full">
      {isUploading && (
        <div className="z-[500] flex items-center justify-center text-center fixed left-0 top-0 bg-black bg-opacity-75 w-full h-screen font-bold text-xl text-white">
          Dodawanie {uploadCount} obrazów...
        </div>
      )}
      <div
        className={`mt-3 z-[60] w-full overflow-x-hidden rounded-lg ${
          dragging
            ? "bg-green-200 cursor-grabbing"
            : "bg-gray-200 cursor-default"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDragEnd}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="w-full py-12 flex items-center justify-center text-center flex-col">
          <FaImages className="text-4xl text-black/50 mb-3" />
          <div className="font-light px-6 max-w-xs text-sm text-black/50 italic">
            Dodaj zdjęcia o rozmiarze do 5MB/każde lub upuść pliki tutaj
            {!(
              user?.subscription?.status === "active" ||
              user?.premiumActive ||
              user?.active
            ) && (
              <>
                <br />
                Limit planu darmowego: maks. 6 zdjęć
              </>
            )}
          </div>
          <label
            htmlFor="uploader5"
            className="text-white rounded-md w-max mt-4 py-3 px-12 text-center justify-center items-center flex font-gotham bg-blue-600 duration-150 hover:bg-blue-700 cursor-pointer"
          >
            <FaUpload className="mr-2" />
            Dodaj zdjęcia
          </label>
          {!(
            user?.subscription?.status === "active" ||
            user?.premiumActive ||
            user?.active
          ) && (
            <div className="mt-2 text-xs text-black/50">
              Pozostało: {Math.max(0, 6 - (user?.portfolioImages?.length || 0))}
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e: any) => {
            const files = e.target.files;
            const imageFiles = Array.from(files).filter((file: any) =>
              file.type.startsWith("image/")
            );
            const validFiles = imageFiles.filter((file: any) => {
              const fileType = file.type;
              const fileSize = file.size;
              const validType = fileType.startsWith("image/");
              const validSize = fileSize <= 5 * 1024 * 1024;

              if (!validType || !validSize) {
                toast.error("Tylko zdjęcia o rozmiarze do 5MB są dozwolone", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                });
                return false;
              }
              return true;
            });
            handler(validFiles); // Now it's a proper array of valid images
          }}
          id="uploader5"
          className="hidden"
        />
      </div>
      <div className="flex flex-col mt-4">
        {user?.portfolioImages?.length > 0 && (
          <h3 className="text-lg font-semibold">Twoje portfolio</h3>
        )}
        {user?.portfolioImages?.map((image: PortfolioImage, i: number) => (
          <div key={i} className="flex flex-row space-x-3 mt-4">
            <div className="w-1/3">
              <Image
                src={image.src}
                alt={`Portfolio image ${i}`}
                className="w-full rounded-md"
                width={300}
                height={300}
              />
            </div>
            <div className="flex flex-col w-full">
              <textarea
                value={image.text}
                placeholder="Uzupełnij opis zdjęcia"
                className="text-sm sm:text-base border-gray-300 border rounded-md p-2 w-full h-full"
                onChange={(e) => {
                  const updatedImages = user?.portfolioImages.map(
                    (img, index) =>
                      index === i ? { ...img, text: e.target.value } : img
                  );
                  dispatch(
                    setUser({ ...user, portfolioImages: updatedImages })
                  );
                }}
              ></textarea>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
