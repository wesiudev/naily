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

  const isLoginPage = pathname === "/login";
  
  return (
    <>
      <button
        className={`
          relative
          px-3 py-2.5 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3
          rounded-full
          border-2
          font-semibold
          text-xs sm:text-sm lg:text-base
          whitespace-nowrap
          min-h-[36px] sm:min-h-[40px] lg:min-h-[44px]
          focus:outline-none
          focus:ring-2 focus:ring-offset-2
          transition-all duration-200
          active:scale-95
          touch-target
          ${isLoginPage 
            ? "border-white/90 bg-white/10 text-white hover:bg-white/20 focus:ring-white/50 backdrop-blur-sm" 
            : "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md"
          }
          ${pt} ${variant}
        `}
        id="setup_button"
        aria-label="Pobierz aplikację"
        title="Pobierz aplikację"
        onClick={onClick}
      >
        <span className="flex items-center gap-1.5 sm:gap-2">
          <svg 
            className="w-3 h-3 sm:w-4 sm:h-4 lg:w-4 lg:h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" 
            />
          </svg>
          <span className="hidden xs:inline">Pobierz aplikację</span>
          <span className="xs:hidden">Pobierz</span>
        </span>
      </button>
    </>
  );
}

export default DownloadApp;
