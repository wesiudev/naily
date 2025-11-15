/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice?: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  platforms?: string[];
};
import { FaDownload } from "react-icons/fa6";

function DownloadApp({ pt, variant }: { pt?: string; variant?: string }) {
  const [supportsPWA, setSupportsPWA] = useState<boolean>(false);
  const [promptInstall, setPromptInstall] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e as unknown as BeforeInstallPromptEvent);
    };

    const checkInstallation = () => {
      // Check if app is not installed
      if (window.matchMedia("(display-mode: browser)").matches) {
        setShouldShow(true);
      } else {
        setShouldShow(false);
      }
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

  if (!supportsPWA || !shouldShow) {
    return null;
  }

  return (
    <>
      <button
        className={`text-xs bg-primary-600 text-white font-semibold px-3 py-1.5 rounded-md flex items-center gap-2 hover:bg-primary-700 transition-colors duration-200 ${pt} ${variant}`}
        id="setup_button"
        aria-label="Install app"
        title="Install app"
        onClick={onClick}
      >
        <FaDownload className="text-sm" />
        <span className="whitespace-nowrap">Pobierz Aplikację</span>
      </button>
    </>
  );
}

export default DownloadApp;
