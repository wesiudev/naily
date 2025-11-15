/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { FaCog } from "react-icons/fa";
import GoogleViewConfig from "./GoogleViewConfig";
import GoogleKeywordsConfig from "./GoogleKeywordsConfig";
import UrlConfig from "./UrlConfig";

export default function ExtraSettings({
  setExtraSettingsOpen,
  extraSettingsOpen,
  product,
  handleChange,
  dbUpdate,
  error,
}: {
  setExtraSettingsOpen: any;
  extraSettingsOpen: boolean;
  product: any;
  handleChange: any;
  dbUpdate: any;
  error: boolean;
}) {
  useEffect(() => {
    dbUpdate(product.id, product);
  }, [extraSettingsOpen]);
  return (
    <div>
      <div
        className={`p-2 border-2 ${
          error &&
          (!product.googleTitle || !product.googleDescription || !product.url)
            ? "border-red-500 bg-red-500 animate-pulse"
            : "border-transparent"
        }`}
      >
        <button
          onClick={() => setExtraSettingsOpen(!extraSettingsOpen)}
          className="flex items-center justify-center text-white"
        >
          <FaCog className="mr-2" />
          Ustawienia dodatkowe
        </button>
      </div>
      {extraSettingsOpen && (
        <div className="fixed pt-6 w-[550px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center h-[80vh] shadow-md bg-white shadow-black z-10">
          <div className="flex items-center justify-between w-full px-6">
            <h2 className="text-2xl font-bold">Ustawienia dodatkowe</h2>
            <button
              onClick={() => setExtraSettingsOpen(false)}
              className="bg-gray-600 text-white  px-3 py-1.5 hover:bg-gray-500 duration-300"
            >
              Zamknij
            </button>
          </div>
          <div className="flex flex-col w-full px-6">
            {!product.googleTitle && error && (
              <div className="text-red-500 font-bold ">
                Uzupełnij tytuł Google!
              </div>
            )}
            {!product.googleDescription && error && (
              <div className="text-red-500 font-bold mt-3">
                Uzupełnij opis Google!
              </div>
            )}
            {!product.url && error && (
              <div className="text-red-500 font-bold mt-3">Uzupełnij link!</div>
            )}
          </div>
          <div className="h-full overflow-y-scroll w-full p-6">
            <GoogleViewConfig
              handleChange={handleChange}
              product={product}
              error={error}
            />
            <GoogleKeywordsConfig
              product={product}
              handleChange={handleChange}
            />
            <UrlConfig
              handleChange={handleChange}
              product={product}
              error={error}
            />
          </div>
        </div>
      )}
    </div>
  );
}
