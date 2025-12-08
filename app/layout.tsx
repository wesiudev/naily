import "./globals.css";
import { Metadata } from "next";
import ConditionalNav from "@/components/ConditionalNav";
import Footer from "@/components/Footer";
import { Providers } from "@/redux/Provider";
import "react-toastify/dist/ReactToastify.css";
import {
  Inter,
  Playfair_Display,
  Poppins,
  Roboto,
  Cormorant_Garamond,
  Marcellus,
  Cinzel,
  Nunito,
  Lora,
  Montserrat,
  Open_Sans,
  Source_Sans_3,
} from "next/font/google";
import FontManager from "@/components/FontManager";
import { ToastContainer } from "react-toastify";
import Script from "next/script";
import ModalManager from "@/components/ModalManager";
import InitUser from "@/components/User/Init";
import localFont from "next/font/local";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});
const marcellus = Marcellus({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  variable: "--font-marcellus",
});
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cinzel",
});
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
});
const lora = Lora({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-open-sans",
});
const sourceSans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],

  variable: "--font-source-sans",
});

const baloo = localFont({
  src: "../public/baloo.ttf",
  variable: "--font-baloo",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${inter.variable} ${playfair.variable} ${poppins.variable} ${roboto.variable} ${cormorant.variable} ${marcellus.variable} ${cinzel.variable} ${nunito.variable} ${lora.variable} ${montserrat.variable} ${openSans.variable} ${sourceSans.variable} ${baloo.variable}`}
    >
      <head>
        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Naily" />
        <link rel="apple-touch-icon" href="/naily-logo.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`max-w-screen overflow-x-hidden font-body bg-white`}>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-6XV8R4XZKS"
          id="google-analytics"
        >
          {` window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-6XV8R4XZKS');`}
        </Script>
        <Script async id="google-analytics1">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-10818390066');
          `}
        </Script>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="professional-card"
        />
        <Providers>
          <FontManager />
          <InitUser />
          <ConditionalNav />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <ModalManager />
        </Providers>
        {/* Register Service Worker for PWA */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .then((reg) => {
                    console.log('Service Worker registered:', reg);
                    // Check for updates periodically
                    setInterval(() => {
                      reg.update();
                    }, 60000); // Check every minute
                  })
                  .catch((err) => {
                    console.log('Service Worker registration failed:', err);
                  });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "https://naily.pl"),
  title: {
    default: "Naily – Profesjonalny manicure i pedicure",
    template: "%s | Naily",
  },
  description:
    "Platforma dla stylistek i pasjonatek paznokci: rezerwacje, profile, blog i sklep z produktami do stylizacji.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Naily",
    title: "Naily – Profesjonalny manicure i pedicure",
    description:
      "Platforma dla stylistek i pasjonatek paznokci: rezerwacje, profile, blog i sklep z produktami do stylizacji.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Naily – Profesjonalny manicure i pedicure",
    description:
      "Platforma dla stylistek i pasjonatek paznokci: rezerwacje, profile, blog i sklep z produktami do stylizacji.",
  },
};
