import ProductEdit from "@/components/AdminComponents/ProductEdit";
import { v4 as uuidv4 } from "uuid";

export default async function Page() {
  const product = {
    title: "",
    shortDesc: "",
    text1Title: "",
    text1Desc: "",
    text2Title: "",
    text2Desc: "",
    text3Title: "",
    text3Desc: "",
    text4Title: "",
    text4Desc: "",
    text5Title: "", // Dodano sekcję text5
    text5Desc: "",
    text6Title: "", // Dodano sekcję text6
    text6Desc: "",
    text7Title: "", // Dodano sekcję text7
    text7Desc: "",
    imagesHeadingSmallText: "",
    imagesHeadingMainText: "",
    images: [], // Lista obrazów (np. dodatkowe galerie)
    primaryImage: "", // Obraz główny
    secondaryImage: "", // Obraz pomocniczy lub dodatkowy
    tertiaryImage: "", // Obraz pomocniczy lub dodatkowy
    quaternaryImage: "",
    additionalLinks: [], // Dodatkowe linki lub załączniki
    googleTitle: "", // Tytuł do SEO
    googleDescription: "", // Opis do SEO
    googleKeywords: "", // Słowa kluczowe do SEO
    publishDate: "", // Data publikacji
    url: "", // URL produktu lub wpisu
    tags: "", // Tagowanie produktu
    id: uuidv4(), // Generowanie unikalnego ID
  };

  return <ProductEdit source={product} place="new" />;
}
