"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { EditSectionProps } from "@/types";
import { renderMarkdown } from "@/utils/parseMarkdown";

export default function EditSection({
  selectedSection,
  setSelectedSection,
  selectedPost,
  setSelectedPost,
  setSectionEditorOpen,
  sectionEditorOpen,
}: EditSectionProps) {
  const [markdown, setMarkdown] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (selectedSection) {
      const contentString =
        typeof selectedSection.content === "string"
          ? selectedSection.content
          : "";
      setMarkdown(contentString);
    }
  }, [selectedSection]);

  function insertAtCursor(prefix: string, suffix: string, placeholder: string) {
    const textarea = textareaRef.current;
    if (!textarea) {
      setMarkdown((prev) => `${prev}${prefix}${placeholder}${suffix}`);
      return;
    }
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const before = markdown.slice(0, start);
    const selected = markdown.slice(start, end) || placeholder;
    const after = markdown.slice(end);
    const next = `${before}${prefix}${selected}${suffix}${after}`;
    setMarkdown(next);
    // Restore caret after inserted text
    requestAnimationFrame(() => {
      const pos =
        before.length + prefix.length + selected.length + suffix.length;
      textarea.selectionStart = textarea.selectionEnd = pos;
      textarea.focus();
    });
  }

  function insertImage() {
    const url = window.prompt("Wklej URL obrazka:") || "";
    if (!url) return;
    const alt = window.prompt("Tekst alternatywny (opcjonalnie):") || "";
    insertAtCursor(`![${alt}](`, ")", url || "image-url");
  }

  function insertLink() {
    const url = window.prompt("Wklej URL linku:") || "";
    if (!url) return;
    insertAtCursor("[", `](${url})`, "tekst linku");
  }

  function insertHeader(level: 2 | 3) {
    const hashes = level === 2 ? "## " : "### ";
    insertAtCursor("\n" + hashes, "", "Nagłówek");
  }

  function insertBold() {
    insertAtCursor("**", "**", "pogrubiony tekst");
  }

  function insertItalic() {
    insertAtCursor("_", "_", "kursywa");
  }

  const updateSelectedPost = () => {
    if (!selectedSection || selectedSection.id === undefined) return;
    const updatedSections = selectedPost.sections.map((section, i) =>
      i === selectedSection.id
        ? {
            ...section,
            title: selectedSection.title,
            content: markdown,
          }
        : section
    );
    setSelectedPost({ ...selectedPost, sections: updatedSections });
  };

  return (
    <div
      className={`fixed inset-0 z-[1000] bg-[#1a1c25] text-white transition-opacity ${
        sectionEditorOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSectionEditorOpen(false)}
              className="px-3 py-2 bg-red-500 hover:bg-red-600 rounded"
            >
              Zamknij
              <FaArrowRight className="inline ml-2" />
            </button>
            <input
              placeholder="Tytuł sekcji"
              className="!text-black bg-slate-300 p-2 rounded outline-none placeholder:text-gray-600 min-w-[280px]"
              type="text"
              value={selectedSection?.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSelectedSection({
                  ...selectedSection,
                  title: e.target.value,
                })
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => insertHeader(2)}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              H2
            </button>
            <button
              onClick={() => insertHeader(3)}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              H3
            </button>
            <button
              onClick={insertBold}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              B
            </button>
            <button
              onClick={insertItalic}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              I
            </button>
            <button
              onClick={insertLink}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              Link
            </button>
            <button
              onClick={insertImage}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded"
            >
              + Obraz
            </button>
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold"
              onClick={updateSelectedPost}
            >
              Zapisz sekcję
            </button>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="h-full flex flex-col">
            <textarea
              ref={textareaRef}
              className="flex-1 w-full !text-black bg-slate-100 p-4 outline-none font-mono text-sm resize-none"
              placeholder="Napisz treść w Markdown..."
              value={markdown}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setMarkdown(e.target.value)
              }
            />
          </div>
          <div className="h-full overflow-auto p-6 bg-[#11131a]">
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={renderMarkdown(markdown)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
