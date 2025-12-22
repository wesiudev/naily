import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kreator Profilu - Stwórz swój profil na Naily",
  description:
    "Stwórz profesjonalny profil stylistki paznokci na Naily. Dodaj swoje usługi, cennik, galerię zdjęć i rozpocznij przyjmowanie rezerwacji online.",
  openGraph: {
    title: "Kreator Profilu - Stwórz swój profil na Naily",
    description:
      "Stwórz profesjonalny profil stylistki paznokci na Naily. Dodaj swoje usługi, cennik, galerię zdjęć i rozpocznij przyjmowanie rezerwacji online.",
    type: "website",
    url: "https://naily.pl/kreator-profilu",
    siteName: "Naily",
    images: [
      {
        url: "/landing.png", // You can change this to a custom image for this page
        width: 1200,
        height: 630,
        alt: "Kreator Profilu Naily",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kreator Profilu - Stwórz swój profil na Naily",
    description:
      "Stwórz profesjonalny profil stylistki paznokci na Naily. Dodaj swoje usługi, cennik, galerię zdjęć i rozpocznij przyjmowanie rezerwacji online.",
    images: [
      {
        url: "/landing.png", // You can change this to a custom image for this page
        alt: "Kreator Profilu Naily",
      },
    ],
  },
};

export default function KreatorProfiluLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

