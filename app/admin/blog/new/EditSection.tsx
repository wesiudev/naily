"use client";
import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { EditSectionProps } from "@/types";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function EditSection({
  selectedSection,
  setSelectedSection,
  selectedPost,
  setSelectedPost,
  setSectionEditorOpen,
  sectionEditorOpen,
}: EditSectionProps) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    if (selectedSection) {
      const contentString =
        typeof selectedSection.content === "string"
          ? selectedSection.content
          : "";
      setHtml(contentString);
    }
  }, [selectedSection]);

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link", "image"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "align",
    "link",
    "image",
  ];

  const updateSelectedPost = () => {
    if (!selectedSection || selectedSection.id === undefined) return;
    const updatedSections = selectedPost.sections.map((section, i) =>
      i === selectedSection.id
        ? {
            ...section,
            title: selectedSection.title,
            content: html,
          }
        : section
    );
    setSelectedPost({ ...selectedPost, sections: updatedSections });
  };

  return (
    <div
      className={`h-screen w-[80vw] z-[1000] fixed right-0 top-0 bg-[#222430] text-white ease-in-out ${
        sectionEditorOpen ? "translate-x-[0%]" : "translate-x-[120%]"
      }`}
    >
      <div className="flex flex-col w-full relative">
        <button
          onClick={() => {
            setSectionEditorOpen(false);
          }}
          className="absolute left-0 -translate-x-[100%] w-max p-3 top-3 flex flex-row items-center bg-red-400 hover:bg-red-600 duration-200"
        >
          Zamknij
        </button>
        <div className="myEditor text-black p-3 rounded-xl bg-[#222430]">
          <h1 className="text-white text-2xl mb-2">Edytuj sekcję</h1>
          <p className="text-white text-lg mt-6 mb-2">Tytuł:</p>
          <input
            placeholder="Wpisz tytuł..."
            className="!text-black bg-slate-400 mt-1 p-2 outline-none placeholder:text-gray-500 rounded-md"
            type="text"
            value={selectedSection?.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSelectedSection({ ...selectedSection, title: e.target.value })
            }
          />
          <p className="text-white text-lg mb-2">Treść:</p>
          <div className="bg-slate-400 rounded-md max-h-[200px]">
            <ReactQuill
              theme="snow"
              value={html}
              onChange={setHtml}
              modules={modules}
              formats={formats}
              style={{ height: 200 }}
            />
          </div>
          <button
            className="flexmt-12 bg-gradient-to-tr from-red-400 via-red-600 to-red-400 font-bold text-white text-3xl hover:from-green-300 hover:via-green-500 hover:to-green-300 duration-500 ease-in-out p-6 w-full rounded-xl"
            onClick={updateSelectedPost}
          >
            Zatwierdź sekcję
          </button>
        </div>
      </div>
    </div>
  );
}
