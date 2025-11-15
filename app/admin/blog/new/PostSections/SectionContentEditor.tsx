"use client";
import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { SectionContentEditorProps } from "@/types";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function SectionContentEditor({
  addSection,
}: SectionContentEditorProps) {
  const [sectionContent, setSectionContent] = useState<string>("");
  const [sectionTitle, setSectionTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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

  const handleAddSection = () => {
    if (sectionTitle.trim() && sectionContent.trim()) {
      addSection(sectionTitle, sectionContent);
      setSectionTitle("");
      setSectionContent("");
      setIsOpen(false);
    }
  };

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <div className="myEditor">
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white"
      >
        Otwórz kreator sekcji
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full h-full max-w-6xl mx-auto bg-[#1a1c26] text-white rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold">Kreator sekcji</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600"
              >
                Zamknij
              </button>
            </div>

            {/* Body */}
            <div className="p-5 h-[calc(100%-120px)] overflow-hidden flex flex-col gap-3">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Tytuł
                </label>
                <input
                  placeholder="Wpisz tytuł..."
                  className="w-full !text-black bg-slate-300 mt-1 p-2 rounded-md outline-none placeholder:text-gray-600"
                  type="text"
                  value={sectionTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSectionTitle(e.target.value)
                  }
                />
              </div>

              <div className="flex-1 min-h-0">
                <label className="block text-sm text-gray-300 mb-2">
                  Treść
                </label>
                <div className="bg-slate-300 rounded-md h-full">
                  <ReactQuill
                    theme="snow"
                    value={sectionContent}
                    onChange={setSectionContent}
                    modules={modules}
                    formats={formats}
                    style={{ height: "100%" }}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-700">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
              >
                Anuluj
              </button>
              <button
                onClick={handleAddSection}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700"
              >
                Dodaj sekcję
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// import { EditorState, convertToRaw } from "draft-js";
//       import draftToHtml from "draftjs-to-html";

//       export default function SectionContentEditor({
//         addSection,
//       }: {
//         addSection: Function;
//         removeSection: Function;
//       }) {
//         const [sectionContent, setSectionContent] = React.useState(() =>
//           EditorState.createEmpty()
//         );
//         const [sectionTitle, setSectionTitle] = useState("");

//         const handleAddSection = () => {
//           const content = draftToHtml(convertToRaw(sectionContent.getCurrentContent()));
//           addSection(sectionTitle, content);
//         };

//         return (
//           <div className="myEditor text-black p-3 rounded-xl bg-[#222430]">
//             <h1 className="text-white text-2xl mb-2">Dodaj sekcję</h1>
//             <p className="text-white text-lg mt-6 mb-2">Tytuł:</p>
//             <input
//               placeholder="Wpisz tytuł..."
//               className="!text-black  bg-slate-400 mt-1 p-2 outline-none placeholder:text-gray-500"
//               type="text"
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                 setSectionTitle(e.target.value)
//               }
//             />
//             <p className="text-white text-lg mb-2">Treść:</p>
//             <Editor
//               editorStyle={{
//                 backgroundColor: "rgb(148 163 184)",
//                 color: "black",
//                 height: "300px",
//                 padding: "3px 15px",
//               }}
//               editorState={sectionContent}
//               onEditorStateChange={setSectionContent}
//             />
//             <button
//               onClick={handleAddSection}
//               className="px-4 py-2 bg-green-500 rounded-md text-white mt-2"
//             >
//               Zatwierdź sekcję
//             </button>
//           </div>
//         );
//       }
//       <button
//         onClick={() => addSection(sectionTitle, sectionContent)}
//         className="px-4 py-2 bg-green-500 rounded-md text-white mt-2"
//       >
//         Zatwierdź sekcję
//       </button>
//     </div>
//   );
// }
