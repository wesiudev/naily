/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import Input from "@/components/AdminComponents/Input";
import { useEffect, useState } from "react";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import ContentButton from "@/components/AdminComponents/ContentButton";
import HtmlInput from "@/components/AdminComponents/HtmlInput";
import { v4 as uuid } from "uuid";
import {
  addDocument,
  deleteDraft,
  deleteProduct,
  storage,
  updateProduct,
} from "@/firebase";

import ImagePicker from "@/components/AdminComponents/ImagePicker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";
import ExtraSettings from "@/components/AdminComponents/ExtraSettings";

import { createLinkFromText } from "@/utils/createLinkFromText";
import { getServices } from "@/utils/getServices";
import { generateSection } from "@/utils/generateSection";
import Viewer from "./Viewer";
async function requestPostGeneration(topic: string) {
  const answer = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/generateBlogPost?topic=${topic}`
  );
  return answer;
}
export default function ProductEdit({
  source,
  place,
}: {
  source: any;
  place: "products" | "drafts" | "new";
}) {
  const router = useRouter();
  const initialInput = {
    type: "",
    title: "",
    label: "",
  };
  const [topic, setTopic] = useState("");
  function generateBlogPost(topic: string) {
    if (!topic) {
      return;
    }
    (async () => {
      try {
        const data = await requestPostGeneration(topic).then((data) => {
          return data.json();
        });

        setProduct((prev: any) => ({
          ...prev,
          title: data?.title || "",
          shortDesc: data?.shortDesc || "",
          text1Title: data?.text1Title || "",
          text1Desc: data?.text1Desc || "",
          text2Title: data?.text2Title || "",
          text2Desc: data?.text2Desc || "",
          text3Title: data?.text3Title || "",
          text3Desc: data?.text3Desc || "",
          text4Title: data?.text4Title || "",
          text4Desc: data?.text4Desc || "",
          text5Title: data?.text5Title || "",
          text5Desc: data?.text5Desc || "",
          text6Title: data?.text6Title || "",
          text6Desc: data?.text6Desc || "",
          text7Title: data?.text7Title || "",
          text7Desc: data?.text7Desc || "",
          googleTitle: data?.googleTitle || "",
          googleDescription: data?.googleDescription || "",
          googleKeywords: data?.googleKeywords || "",
          url: data?.url || "",
          tags: data?.tags || "",
          section2: data?.section2 || prev.section2,
          section3: data?.section3 || prev.section3,
          section4: data?.section4 || prev.section4,
          section5: data?.section5 || prev.section5,
          section6: data?.section6 || prev.section6,
          section7: data?.section7 || prev.section7,
        }));
      } catch (err: any) {
        console.log(err);
      }
    })();
  }

  const [selectedImage, setSelectedImage] = useState<any>();
  const [extraSettingsOpen, setExtraSettingsOpen] = useState(false);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [product, setProduct] = useState<any>(source);
  const [sourceOfImagePicker, setSourceOfImagePicker] = useState("");
  const [currentInput, setCurrentInput] = useState(initialInput);
  const [loading, setLoading] = useState(false);
  function closeImagePicker() {
    setImagePickerOpen(false);
    setSourceOfImagePicker("");
  }

  function handleChange(e: any) {
    if (e.target.name !== "url") {
      setProduct({ ...product, [e.target.name]: e.target.value });
    } else if (e.target.name === "url") {
      setProduct({
        ...product,
        [e.target.name]: createLinkFromText(e.target.value),
      });
    }
  }
  function closeInput() {
    setCurrentInput(initialInput);
  }

  const [isUploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState();
  async function uploadImages(files: any) {
    setUploadCount(files.length);
    setUploading(true);
    const localImagesArray: any = [];
    const uploadFile = async (file: any) => {
      const randId = uuid();
      const imageRef = ref(storage, randId);
      try {
        await uploadBytes(imageRef, file);
        const url = await getDownloadURL(imageRef);
        const data = {
          src: url,
        };
        localImagesArray.push(data);
      } catch (err: any) {
        return;
      }
    };
    const uploadPromises = files.map(uploadFile);
    try {
      await Promise.all(uploadPromises);
      const updatedImages = product?.images
        ? [...product?.images, ...localImagesArray]
        : localImagesArray;
      setProduct({ ...product, images: updatedImages });
      setUploading(false);
    } catch (error) {
      setUploading(false);
      return;
    }
  }

  const [services, setServices] = useState<any[]>([]);
  useEffect(() => {
    const fetchServices = async () => {
      getServices().then((res) => setServices(res));
    };
    fetchServices();
  }, []);
  const [isFullscreen, setIsFullscreen] = useState(false);
  return (
    <div
      className={`w-full duration-500 ${
        isFullscreen ? "fixed left-0 top-0 overflow-y-scroll h-screen" : "p-24"
      }`}
    >
      <div
        className={`fixed right-8 bottom-12 flex items-center group z-[1500] bg-black  p-4 flex-col`}
      >
        <div className="my-4">
          <span className="text-white">Wpisz tytuł posta</span> <br />
          <input
            className="!text-black  bg-slate-400 mt-1 p-2 outline-none placeholder:text-gray-500"
            type="text"
            value={topic}
            onChange={(e) => setTopic(createLinkFromText(e.target.value))}
          />
        </div>
        <button
          onClick={() => {
            generateBlogPost(topic);
          }}
          className="p-3 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold"
        >
          Generuj posta
        </button>
      </div>
      <button
        onClick={() => setIsFullscreen(!isFullscreen)}
        className={`fixed right-8 bottom-8 flex items-center group z-[1500]`}
      >
        <div className="group-hover:opacity-100 duration-300 opacity-0 bg-green-500 h-11 px-3  flex items-center text-white">
          {isFullscreen ? "Zamknij" : "Pełny ekran"}
        </div>
        <div className="text-2xl aspect-square w-11 h-11 group-hover:rounded-l-none  bg-green-500 group-hover:bg-green-400 text-white items-center justify-center flex">
          {!isFullscreen && <AiOutlineFullscreen />}
          {isFullscreen && <AiOutlineFullscreenExit />}
        </div>
      </button>
      {isUploading && (
        <div className="z-[500] flex items-center justify-center text-center fixed left-0 top-0 bg-black bg-opacity-75 w-full h-screen font-bold text-xl text-white">
          Dodawanie {uploadCount} obrazów...
        </div>
      )}
      <ImagePicker handler={uploadImages} />
      <Input
        value={product[currentInput.title]}
        title={currentInput.title}
        handleChange={handleChange}
        type={currentInput.type}
        label={currentInput.label}
        closeInput={closeInput}
      />
      <HtmlInput
        label={currentInput.label}
        type={currentInput.type}
        closeInput={closeInput}
        setProduct={setProduct}
        product={product}
        currentInput={currentInput}
      />
      <div className={`relative w-full bg-white min-h-screen`}>
        <div
          className={`z-[50] sticky w-full flex items-center justify-between bg-slate-800 left-0 top-0 p-1.5 ${
            isFullscreen ? "px-20" : ""
          } `}
        >
          <p className="text-white font-bold w-[50%]">
            {place === "new" && (
              <p className="text-white font-bold w-max">
                Dodajesz nowy wpis na stronę
              </p>
            )}
            {place !== "new" && (
              <>
                Pracujesz nad wpisem{" "}
                <span className="text-green-400 italic">
                  {!product.title && product.id}
                  {product.title && product.title}
                </span>
              </>
            )}
          </p>

          <ExtraSettings
            product={product}
            extraSettingsOpen={extraSettingsOpen}
            setExtraSettingsOpen={setExtraSettingsOpen}
            handleChange={handleChange}
            dbUpdate={updateProduct}
            error={false}
          />
          <div>
            <div className="flex flex-row items-center space-x-2">
              <select
                value={product.type || ""}
                onChange={(e) => {
                  setProduct({ ...product, type: e.target.value });
                }}
                className="bg-gray-100 border border-gray-300 rounded-md p-2 w-[300px]"
              >
                {services.map((service) => (
                  <option
                    value={service.flatten_name}
                    key={service.flatten_name}
                    className={`${
                      service.post ? "font-bold" : ""
                    } text-gray-700`}
                  >
                    {service.flatten_name}
                  </option>
                ))}
              </select>
              {place !== "new" && (
                <>
                  <button
                    onClick={() => {
                      if (place === "products") {
                        deleteProduct(product.id).then(() =>
                          router.push("/admin/products")
                        );
                      } else if (place === "drafts") {
                        deleteDraft(product.id).then(() =>
                          router.push("/admin/products/drafts")
                        );
                      }
                    }}
                    className="bg-red-500 hover:bg-red-400 text-white p-1.5 "
                  >
                    Usuń
                  </button>

                  <button
                    onClick={() => console.log("ok")}
                    className={`bg-gray-500 hover:bg-gray-400
                   text-white p-1.5 `}
                  >
                    {!loading && "Zapisz zmiany"}
                  </button>
                </>
              )}
              {(place === "new" || place === "drafts") && (
                <>
                  {loading && (
                    <div className="bg-green-500 hover:bg-green-400 text-white p-3">
                      Wczytywanie
                    </div>
                  )}
                  {!loading && (
                    <button
                      onClick={() =>
                        addDocument("servicePosts", product.id, {
                          data: product,
                        })
                      }
                      className="w-max bg-green-500 hover:bg-green-400 text-white p-3"
                    >
                      Dodaj wpis
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className={`${isFullscreen ? "px-32" : ""} p-12`}>
          <div className="grid  gap-4 mx-auto mt-12">
            <div className="flex flex-col space-y-4">
              {" "}
              <ContentButton
                label="Tytuł wpisu"
                value={product.title}
                type="text"
                title="title"
                setInput={setCurrentInput}
                optional={false}
              />
              <div className="mt-3"></div>
              <ContentButton
                label="Krótki opis"
                value={product.shortDesc}
                type="html"
                title="shortDesc"
                setInput={setCurrentInput}
                optional={false}
              />
              <ContentButton
                label="Tytuł tekstu 1"
                value={product.text1Title}
                type="text"
                title="text1Title"
                setInput={setCurrentInput}
                optional={true}
              />
              <ContentButton
                label="Opis tekstu 1"
                value={product.text1Desc}
                type="html"
                title="text1Desc"
                setInput={setCurrentInput}
                optional={true}
              />
              {product?.primaryImage && (
                <div className="min-w-full">
                  <Image
                    style={{ boxShadow: "0px 0px 5px #000000" }}
                    src={product?.primaryImage}
                    width={1024}
                    height={1024}
                    alt=""
                    className="min-w-full object-cover"
                  />
                </div>
              )}
              <ContentButton
                label="Tytuł tekstu 2"
                value={product.text2Title}
                type="text"
                title="text2Title"
                setInput={setCurrentInput}
                optional={true}
              />
              <ContentButton
                label="Opis tekstu 2"
                value={product.text2Desc}
                type="html"
                title="text2Desc"
                setInput={setCurrentInput}
                optional={true}
              />
              <Viewer value={product?.section2?.content} />
            </div>
            {/* image input */}
            <div className="flex flex-col items-center mt-4">
              <div className="w-full">
                {product?.section2?.image && (
                  <div className="min-w-full">
                    <Image
                      style={{ boxShadow: "0px 0px 5px #000000" }}
                      src={product?.section2?.image}
                      width={1024}
                      height={1024}
                      alt=""
                      className="min-w-full object-cover"
                    />
                  </div>
                )}
              </div>{" "}
              <div className="w-full flex flex-col">
                <ContentButton
                  label="Tytuł tekstu 3"
                  value={product.text3Title}
                  type="text"
                  title="text3Title"
                  setInput={setCurrentInput}
                  optional={true}
                />
                <ContentButton
                  label="Opis tekstu 3"
                  value={product.text3Desc}
                  type="html"
                  title="text3Desc"
                  setInput={setCurrentInput}
                  optional={true}
                />
                <Viewer value={product?.section3?.content} />
              </div>
            </div>
          </div>
        </div>
        <div className="p-12 grid  w-full mt-24">
          <div className="w-full mt-4">
            {product?.section3?.image && (
              <div className="min-w-full">
                <Image
                  style={{ boxShadow: "0px 0px 5px #000000" }}
                  src={product?.section3?.image}
                  width={1024}
                  height={1024}
                  alt=""
                  className="min-w-full object-cover"
                />
              </div>
            )}
          </div>
          <div className="flex flex-col pl-4">
            <ContentButton
              label="Tytuł tekstu 4"
              value={product.text4Title}
              type="text"
              title="text4Title"
              setInput={setCurrentInput}
              optional={true}
            />
            <ContentButton
              label="Opis tekstu 4"
              value={product.text4Desc}
              type="html"
              title="text4Desc"
              setInput={setCurrentInput}
              optional={true}
            />
            <Viewer value={product?.section4?.content} />
          </div>
        </div>
        <div className="p-12 grid  w-full mt-24">
          {/* Konfiguracja text5 */}

          <div className="flex flex-col pl-4">
            <ContentButton
              label="Tytuł tekstu 5"
              value={product.text5Title}
              type="text"
              title="text5Title"
              setInput={setCurrentInput}
              optional={true}
            />
            <ContentButton
              label="Opis tekstu 5"
              value={product.text5Desc}
              type="html"
              title="text5Desc"
              setInput={setCurrentInput}
              optional={true}
            />
            {product?.section5?.image && (
              <div className="min-w-full">
                <Image
                  style={{ boxShadow: "0px 0px 5px #000000" }}
                  src={product?.section5?.image}
                  width={1024}
                  height={1024}
                  alt=""
                  className="min-w-full object-cover"
                />
              </div>
            )}
            <Viewer value={product?.section5?.content} />
          </div>
        </div>
        <div className="p-12 grid  w-full mt-24">
          <div className="flex flex-col pl-4">
            <ContentButton
              label="Tytuł tekstu 6"
              value={product.text6Title}
              type="text"
              title="text6Title"
              setInput={setCurrentInput}
              optional={true}
            />
            <ContentButton
              label="Opis tekstu 6"
              value={product.text6Desc}
              type="html"
              title="text6Desc"
              setInput={setCurrentInput}
              optional={true}
            />
            {product?.section6?.image && (
              <div className="min-w-full">
                <Image
                  style={{ boxShadow: "0px 0px 5px #000000" }}
                  src={product?.section6?.image}
                  width={1024}
                  height={1024}
                  alt=""
                  className="min-w-full object-cover"
                />
              </div>
            )}
            <Viewer value={product?.section6?.content} />
          </div>
        </div>
        <div className="p-12 grid  w-full mt-24">
          <div className="flex flex-col pl-4">
            <ContentButton
              label="Tytuł tekstu 7"
              value={product.text7Title}
              type="text"
              title="text7Title"
              setInput={setCurrentInput}
              optional={true}
            />
            <ContentButton
              label="Opis tekstu 7"
              value={product.text7Desc}
              type="html"
              title="text7Desc"
              setInput={setCurrentInput}
              optional={true}
            />
            {product?.section7?.image && (
              <div className="min-w-full">
                <Image
                  style={{ boxShadow: "0px 0px 5px #000000" }}
                  src={product?.section7?.image}
                  width={1024}
                  height={1024}
                  alt=""
                  className="min-w-full object-cover"
                />
              </div>
            )}
            <Viewer value={product?.section7?.content} />

            <div className="text-xl mt-24">tagi:</div>
            {product?.tags}
          </div>
        </div>
      </div>
    </div>
  );
}
