/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { FaImages } from "react-icons/fa";
import { FaUpload } from "react-icons/fa6";
import { toast } from "react-toastify";

export default function ImagePicker({ handler }: { handler: any }) {
  const [dragging, setDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

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
      handler(e.dataTransfer); // Pass the array of valid files to the handler
    }
  };

  return (
    <div
      className={`mt-3 z-[60] w-full overflow-x-hidden rounded-lg ${
        dragging ? "bg-red-500 cursor-grabbing" : ""
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDragEnd}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="w-full py-12 flex items-center justify-center text-center flex-col">
        <FaImages className="text-4xl text-white mb-3" />
        <div className="font-light px-6 max-w-sm text-sm text-white">
          Dodaj zdjęcia o rozmiarze do 5MB/każde lub upuść pliki tutaj...
        </div>
        <label
          htmlFor="uploader4"
          className="text-white rounded-md w-max mt-4 py-3 px-12 text-center justify-center items-center flex font-gotham bg-blue-500 duration-300 hover:underline"
        >
          <FaUpload className="mr-2" />
          Dodaj zdjęcia
        </label>
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
        id="uploader4"
        className="hidden"
      />
    </div>
  );
}
