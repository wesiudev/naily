"use client";
import { useState } from "react";
import { updateDocument } from "@/firebase";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import { FaLongArrowAltLeft, FaSave, FaEye } from "react-icons/fa";
import { Post, BlogType, FaqItem, Section } from "@/types";
import PostImages from "../PostImages";
import SectionsList from "../../new/PostSections/SectionsList";
import SectionContentEditor from "../../new/PostSections/SectionContentEditor";
import EditSection from "../EditSection";

interface EditPostFormProps {
  post: Post;
}

export default function EditPostForm({ post }: EditPostFormProps) {
  const [formData, setFormData] = useState<Post>(post);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section>({
    title: "",
    content: "",
    id: 0,
  });
  const [sectionEditorOpen, setSectionEditorOpen] = useState(false);

  const blogTypes: BlogType[] = ["art", "tattoo", "design", "inspiration"];

  const handleInputChange = (
    field: keyof Post,
    value: string | string[] | FaqItem[] | Section[] | BlogType | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...(formData.tags || [])];
    newTags[index] = value;
    handleInputChange("tags", newTags);
  };

  const addTag = () => {
    const newTags = [...(formData.tags || []), ""];
    handleInputChange("tags", newTags);
  };

  const removeTag = (index: number) => {
    const newTags = [...(formData.tags || [])];
    newTags.splice(index, 1);
    handleInputChange("tags", newTags);
  };

  const handleFaqChange = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    const newFaq = [...(formData.faq || [])];
    newFaq[index] = { ...newFaq[index], [field]: value };
    handleInputChange("faq", newFaq);
  };

  const addFaq = () => {
    const newFaq = [...(formData.faq || []), { question: "", answer: "" }];
    handleInputChange("faq", newFaq);
  };

  const removeFaq = (index: number) => {
    const newFaq = [...(formData.faq || [])];
    newFaq.splice(index, 1);
    handleInputChange("faq", newFaq);
  };

  // Sections handlers
  const addSection = (title: string, content: string) => {
    const updated = [...(formData.sections || []), { title, content }];
    handleInputChange("sections", updated);
  };

  const removeSection = (index: number) => {
    const updated = [...(formData.sections || [])];
    updated.splice(index, 1);
    handleInputChange("sections", updated);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateDocument(
        [
          "title",
          "intro",
          "outro",
          "sections",
          "metaTitle",
          "metaDescription",
          "mainImage",
          "images",
          "tags",
          "faq",
          "blogType",
          "url",
        ],
        [
          formData.title,
          formData.intro,
          formData.outro,
          formData.sections,
          formData.metaTitle,
          formData.metaDescription,
          formData.mainImage,
          formData.images || [],
          formData.tags,
          formData.faq,
          formData.blogType,
          formData.url,
        ],
        "blog",
        post.postId
      );
      toast.success("Post został zaktualizowany");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Błąd podczas aktualizacji postu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-12">
      <EditSection
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
        selectedPost={formData}
        setSelectedPost={(p: Post) => setFormData(p)}
        setSectionEditorOpen={setSectionEditorOpen}
        sectionEditorOpen={sectionEditorOpen}
      />
      <div className="flex justify-between items-center mb-8">
        <Link
          href="/admin/blog"
          className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
        >
          <FaLongArrowAltLeft />
          Powrót do bloga
        </Link>
        <div className="flex gap-4">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FaEye />
            {previewMode ? "Ukryj podgląd" : "Podgląd"}
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FaSave />
            {loading ? "Zapisywanie..." : "Zapisz zmiany"}
          </button>
        </div>
      </div>

      {previewMode ? (
        <div className="bg-white text-black p-8 rounded-lg max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{formData.title}</h1>
          {formData.mainImage && (
            <Image
              src={formData.mainImage}
              alt={formData.title}
              width={800}
              height={256}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          <div className="prose max-w-none">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Wstęp</h2>
              <p>{formData.intro}</p>
            </div>

            {formData.sections && formData.sections.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Sekcje</h2>
                {formData.sections.map((section: Section, index: number) => (
                  <div key={index} className="mb-4">
                    <h3 className="text-lg font-medium mb-2">
                      {section.title}
                    </h3>
                    <div
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  </div>
                ))}
              </div>
            )}

            {formData.faq && formData.faq.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">FAQ</h2>
                {formData.faq.map((item: FaqItem, index: number) => (
                  <div key={index} className="mb-4">
                    <h4 className="font-medium mb-1">{item.question}</h4>
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Zakończenie</h2>
              <p>{formData.outro}</p>
            </div>

            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="bg-gray-200 px-2 py-1 rounded text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Tytuł</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Typ bloga
              </label>
              <select
                value={formData.blogType}
                onChange={(e) => handleInputChange("blogType", e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                {blogTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">URL</label>
              <input
                type="text"
                value={formData.url}
                onChange={(e) => handleInputChange("url", e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Główne zdjęcie
              </label>
              <input
                type="text"
                value={formData.mainImage}
                onChange={(e) => handleInputChange("mainImage", e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="URL zdjęcia"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Galeria zdjęć (upload + kopia markdown)
              </label>
              <PostImages
                selectedPost={formData}
                setSelectedPost={setFormData}
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Meta tytuł
              </label>
              <input
                type="text"
                value={formData.metaTitle || ""}
                onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Meta opis
              </label>
              <textarea
                value={formData.metaDescription || ""}
                onChange={(e) =>
                  handleInputChange("metaDescription", e.target.value)
                }
                rows={3}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Wstęp</label>
              <textarea
                value={formData.intro}
                onChange={(e) => handleInputChange("intro", e.target.value)}
                rows={4}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Sekcje
              </label>
              <div className="text-black">
                <SectionContentEditor addSection={addSection} />
                <SectionsList
                  input={formData}
                  setSelectedSection={setSelectedSection}
                  setSectionEditorOpen={setSectionEditorOpen}
                  removeSection={removeSection}
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Zakończenie
              </label>
              <textarea
                value={formData.outro}
                onChange={(e) => handleInputChange("outro", e.target.value)}
                rows={4}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Tagi</label>
              <div className="space-y-2">
                {(formData.tags || []).map((tag: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      className="flex-1 p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={() => removeTag(index)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                      Usuń
                    </button>
                  </div>
                ))}
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Dodaj tag
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">FAQ</label>
              <div className="space-y-4">
                {(formData.faq || []).map((item: FaqItem, index: number) => (
                  <div
                    key={index}
                    className="border border-gray-600 rounded p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">
                        Pytanie {index + 1}
                      </span>
                      <button
                        onClick={() => removeFaq(index)}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                      >
                        Usuń
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) =>
                        handleFaqChange(index, "question", e.target.value)
                      }
                      placeholder="Pytanie"
                      className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none mb-2"
                    />
                    <textarea
                      value={item.answer}
                      onChange={(e) =>
                        handleFaqChange(index, "answer", e.target.value)
                      }
                      placeholder="Odpowiedź"
                      rows={3}
                      className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                ))}
                <button
                  onClick={addFaq}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Dodaj FAQ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
