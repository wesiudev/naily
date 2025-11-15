"use client";
import { FaTrash } from "react-icons/fa";
import { TagInputProps } from "@/types";

export default function TagsHandler({
  tagInput,
  setTagInput,
  addTag,
  removeTag,
  input,
}: TagInputProps) {
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.includes(" ")) {
      setTagInput(value.replace(/\s/g, ""));
    } else {
      setTagInput(value);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addTag();
        setTagInput("");
      }}
      className="flex flex-col w-full"
    >
      <div>Utwórz tagi</div>
      <div className="flex flex-row items-center">
        <div className="relative h-max w-max">
          <div className="absolute left-2 top-[53%] -translate-y-[50%] text-gray-700 select-none placeholder:text-gray-500">
            #
          </div>
          <input
            placeholder="Wpisz tekst..."
            value={tagInput}
            onChange={handleTagInputChange}
            className="!text-black  bg-slate-400 p-2 pl-6 outline-none placeholder:text-gray-500"
            type="text"
          />
        </div>
        <button
          value={tagInput}
          type="submit"
          className="!text-lg w-max bg-blue-500 hover:bg-blue-700 duration-200 text-white flex flex-row items-center justify-center outline-none ml-2 rounded-md py-1 px-2"
        >
          Dodaj
        </button>
      </div>

      {input.tags.length > 0 && <h1 className="my-2">Twoje tagi:</h1>}
      <div className="flex flex-row items-center w-full">
        {input.tags.map((tag: string, i: number) => (
          <div key={i} className="flex items-center">
            {tag}
            <button onClick={() => removeTag(i)} className="ml-3 mr-4">
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </form>
  );
}
