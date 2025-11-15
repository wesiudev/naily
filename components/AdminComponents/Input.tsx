/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaSignOutAlt } from "react-icons/fa";

export default function Input({
  title,
  value,
  handleChange,
  type,
  label,
  closeInput,
}: {
  title: any;
  value: any;
  handleChange: any;
  type: string;
  label: string;
  closeInput: any;
}) {
  return (
    <>
      {type === "text" && (
        <div
          className={`z-50 fixed w-[50vw] h-[max] bg-slate-700 top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 p-8  flex items-center justify-center flex-col`}
        >
          <button
            onClick={() => closeInput()}
            className="flex w-full justify-between mb-4 text-white font-bold"
          >
            <p className="text-2xl">{label}</p>
            <div className="flex flex-row items-center">
              Zamknij
              <FaSignOutAlt className="ml-2" />
            </div>
          </button>
          <input
            autoFocus
            type="text"
            name={title}
            id={title}
            value={value}
            className="w-full p-3 text-xl"
            onChange={(e: any) => handleChange(e)}
          />
        </div>
      )}
    </>
  );
}
