/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice?: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  platforms?: string[];
};

function DownloadApp({ pt, variant }: { pt?: string; variant?: string }) {
  const pathname = usePathname();
  const [promptInstall, setPromptInstall] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPromptInstall(e as unknown as BeforeInstallPromptEvent);
    };

    const checkInstallation = () => {
      // Check if app is installed (standalone mode)
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      
      // Show button if NOT in standalone mode (i.e., app is not installed)
      setShouldShow(!isStandalone);
    };

    window.addEventListener("beforeinstallprompt", handler);
    checkInstallation();

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const onClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    if (!promptInstall) {
      // Fallback to store URLs
      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        ((navigator as any).platform === "MacIntel" &&
          (navigator as any).maxTouchPoints > 1);
      const androidUrl = process.env.NEXT_PUBLIC_APP_ANDROID_URL;
      const iosUrl = process.env.NEXT_PUBLIC_APP_IOS_URL;
      const urlToOpen = isIOS ? iosUrl : androidUrl;
      if (urlToOpen) window.open(urlToOpen, "_blank");
      return;
    }
    promptInstall.prompt();
  };

  if (!shouldShow) {
    return null;
  }

  return (
    <>
      <button
        className={`p-3 px-5 rounded-full border ${
          pathname === "/login" ? "border-white" : "border-blue-700"
        } ${
          pathname === "/login" ? "text-white" : "text-blue-700"
        } focus:outline-none hover:opacity-80 transition-colors duration-200 whitespace-nowrap ${pt} ${variant}`}
        id="setup_button"
        aria-label="Install app"
        title="Install app"
        onClick={onClick}
      >
        Pobierz aplikację
      </button>
    </>
  );
}

export default DownloadApp;
