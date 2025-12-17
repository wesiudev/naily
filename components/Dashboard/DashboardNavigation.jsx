"use client";
import { useEffect, useRef } from "react";
import { MdBookOnline, MdCategory, MdPhotoLibrary, MdSettings, MdWork } from "react-icons/md";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import { cn } from "@/lib/utils";
import styles from "./dashboardChips.module.css";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaBell, FaMagnifyingGlass } from "react-icons/fa6";

export default function DashboardNavigation({
  activeTab,
  setActiveTab,
  notificationCount,
  user,
}) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      
      // Clear UID cookie
      document.cookie = "uid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navigationItems = [
    { id: "overview", label: "Panel główny", icon: FaHome },
    { id: "calendar", label: "Kalendarz", icon: MdBookOnline },
    { id: "services", label: "Cennik", icon: MdCategory },
    { id: "portfolio", label: "Galeria", icon: MdPhotoLibrary },
    // Only show job offers tab for salons (seek === false)
    ...(user?.seek === false ? [{ id: "joboffers", label: "Oferty pracy", icon: MdWork }] : []),
    { id: "settings", label: "Ustawienia", icon: MdSettings },
    { id: "logout", label: "Wyloguj się", icon: FaSignOutAlt },
  ];

  const onSelectTab = (id) => {
    if (id === "logout") {
      handleLogout();
    } else {
      setActiveTab(id);
      // Scroll to top without animation when switching tabs
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };


  const topWrapperRef = useRef(null);

  // Report height to parent so content can offset when header is fixed
  useEffect(() => {
    const publishHeight = () => {
      const height = topWrapperRef.current?.offsetHeight || 0;
      try {
        window.dispatchEvent(
          new CustomEvent("dashboard:top-nav-height", { detail: height })
        );
      } catch (e) {
        // noop
      }
    };
    publishHeight();
    window.addEventListener("resize", publishHeight);
    return () => window.removeEventListener("resize", publishHeight);
  }, []);

  const TopChipsNav = (
    <div ref={topWrapperRef} className={`${styles.chipsNavWrapper} bg-white`}>
      {/* Top row with logo and optional notification shortcut */}
      <div className="flex items-center gap-3 px-4 w-full">
          <button
            type="button"
            className="flex items-center flex-shrink-0"
            onClick={() => router.push("/")}
            aria-label="Przejdź do strony głównej"
          >
            <div className="w-max">
              <Image
                src="/naily-logo2.png"
                alt="Naily Logo"
                width={112}
                height={40}
                className="h-7 w-auto sm:h-8"
                priority
              />
            </div>
          </button>
          {/* Search bar */}
          <div className="flex w-full justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0 mx-2 sm:mx-4 lg:max-w-[400px]">
            <div
              className="flex items-center gap-2 px-3 py-2 w-full border border-gray-200 rounded-full bg-white"
              role="search"
            >
              <FaMagnifyingGlass className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <input
                type="search"
                placeholder="np. Manicure Warszawa"
                enterKeyHint="search"
                className="w-full font-poppins placeholder:text-gray-400 placeholder:text-xs focus:outline-none bg-transparent"
                aria-label="Szukaj"
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveTab("notifications");
                window.scrollTo({ top: 0, behavior: 'auto' });
              }}
              className="rounded-full relative focus:outline-none w-9 h-9 inline-flex items-center justify-center text-black transition-colors active:scale-95"
              title="Powiadomienia"
            >
              <FaBell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="z-10 absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-red-500 h-5 min-w-[1.25rem] px-1 text-[10px] font-semibold text-white ring-2 ring-white">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </button>
          </div>
          </div>
      </div>

      <div className="mt-2">
        <nav
          className={`${styles.chipsScroller} px-4 pt-0.5`}
          aria-label="Nawigacja dashboardu"
        >
            {navigationItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`font-poppins focus:outline-none ${cn(
                    styles.chipButton,
                    isActive && styles.chipButtonActive
                  )}`}
                  onClick={() => onSelectTab(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={item.label}
                  title={item.label}
                >
                  {/* {Icon && <Icon className={styles.chipIcon} aria-hidden />} */}
                  <span>{item.label}</span>
                  {item.id === "notifications" && notificationCount > 0 && (
                    <span className={styles.badgeCount}>
                      {notificationCount}
                    </span>
                  )}
                </button>
              );
            })}
        </nav>
      </div>
    </div>
  );

  return TopChipsNav;
}
