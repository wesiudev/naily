/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { useEffect, useState } from "react";

export default function GoogleViewConfig({
  product,
  handleChange,
  error,
}: {
  product: any;
  handleChange: any;
  error: boolean;
}) {
  const [activeProperty, setActiveProperty] = useState("");
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (
        event.key === "Enter" &&
        event.target instanceof HTMLTextAreaElement
      ) {
        setActiveProperty("");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <div className="h-max">
      <h2 className="text-xl my-3 font-bold text-zinc-800 drop-shadow-xl shadow-black">
        Wygląd w Google
      </h2>
      <div className="flex flex-col justify-start w-full p-3 bg-gray-300  mt-3">
        <div className="flex items-center">
          <div className="w-12 h-12 p-3 rounded-full bg-white">
            <Image
              src="/favicons/android-chrome-192x192.png"
              width={256}
              height={256}
              alt=""
              className="w-full h-full"
            />
          </div>
          <div className="flex flex-col ml-3 cursor-default">
            <h2 className="text-sm text-black">quixy.pl</h2>
            <h2 className="text-sm text-blue-600 mt-1">https://quixy.pl/</h2>
          </div>
        </div>
        <button
          onClick={() => setActiveProperty("googleTitle")}
          title="kliknij by edytować"
          className="text-lg font-bold text-blue-600 !text-left mt-3"
        >
          {activeProperty === "googleTitle" && (
            <div className="relative w-full h-max">
              <textarea
                autoFocus
                rows={4}
                onBlur={() => setActiveProperty("")}
                value={product.googleTitle}
                name="googleTitle"
                onChange={(e: any) => handleChange(e)}
                className="w-full bg-gray-300 outline-none focus:outline-none"
              />
              <button
                onClick={() => setActiveProperty("")}
                className="bg-green-500 hover:bg-green-600 text-white font-normal py-1 px-2 duration-300 absolute right-0 bottom-0"
              >
                Zatwierdź
              </button>
            </div>
          )}
          {/* if there is content, show it */}
          {product.googleTitle &&
            activeProperty !== "googleTitle" &&
            product.googleTitle}

          {/* if there is no content, show placeholder */}
          {product.googleTitle !== undefined &&
            product.googleTitle.trim() === "" &&
            activeProperty !== "googleTitle" && (
              <div
                className={`${
                  error ? "text-red-500 border-red-500" : "border-transparent"
                } p-2 border-2`}
              >
                Tytuł wyświetlany w Google (max. 80 znaków)
              </div>
            )}
        </button>

        <button
          onClick={() => setActiveProperty("googleDescription")}
          title="kliknij by edytować"
          className="text-base text-zinc-800 drop-shadow-xl shadow-black !text-left mt-1"
        >
          {activeProperty === "googleDescription" && (
            <div className="relative w-full h-max">
              <textarea
                autoFocus
                rows={5}
                onBlur={() => setActiveProperty("")}
                value={product.googleDescription}
                name="googleDescription"
                onChange={(e: any) => handleChange(e)}
                className="w-full bg-gray-300 outline-none focus:outline-none"
              />
              <button
                onClick={() => setActiveProperty("")}
                className="bg-green-500 hover:bg-green-600 text-white font-normal py-1 px-2 duration-300 absolute right-0 bottom-1"
              >
                Zatwierdź
              </button>
            </div>
          )}
          {/* if there is content, show it */}
          {product.googleDescription &&
            activeProperty !== "googleDescription" &&
            product.googleDescription}
          {/* if there is no content, show placeholder */}
          {product.googleDescription !== undefined &&
            product.googleDescription.trim() === "" &&
            activeProperty !== "googleDescription" && (
              <div
                className={`${
                  error ? "text-red-500 border-red-500" : "border-transparent"
                } p-2 border-2`}
              >
                Opis wyświetlany w Google (max. 180-230 znaków) (Co znajdziesz
                na stronie tego wpisu?/Jakia jest tematyka wpisu?/Co
                najwazniejsze?/Dodatkowe informacje)
              </div>
            )}
        </button>
      </div>
    </div>
  );
}
