/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FaSignOutAlt } from "react-icons/fa";
import dynamic from "next/dynamic";
import { TOOLBAR_OPTIONS } from "@/utils/toolbarOptions";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function HtmlInput({
  label,
  type,
  closeInput,
  product,
  setProduct,
  currentInput,
}: {
  label: any;
  type: any;
  closeInput: any;
  product: any;
  setProduct: any;
  currentInput: any;
}) {
  return (
    <>
      {type === "html" && (
        <div className="z-[250] fixed w-[50vw] min-h-[50vh] bg-slate-700 top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 p-8 flex items-center justify-center flex-col">
          <button
            onClick={closeInput}
            className="flex w-full justify-between mb-4 text-white font-bold"
          >
            <p className="text-2xl">{label}</p>
            <div className="flex flex-row items-center">
              Zamknij
              <FaSignOutAlt className="ml-2" />
            </div>
          </button>
          <ReactQuill
            theme="snow"
            placeholder="Wpisz tekst"
            className="text-black"
            modules={{
              toolbar: {
                container: TOOLBAR_OPTIONS,
              },
            }}
            value={product[currentInput.title]}
            onChange={(e) => {
              setProduct({
                ...product,
                [currentInput.title]: e,
              });
            }}
          />
          {/* Pass the correct value */}
          <button
            onClick={closeInput}
            className="text-white w-full p-4 bg-green-500 hover:bg-green-600 mt-4"
          >
            Zatwierdź
          </button>
        </div>
      )}
    </>
  );
}
