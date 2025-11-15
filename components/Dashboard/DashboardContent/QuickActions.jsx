"use client";
import { FaPlusCircle, FaShare, FaEye, FaListUl, FaPalette, FaUser } from "react-icons/fa";
import { MdCalendarMonth } from "react-icons/md";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function QuickActions({ user, setActiveTab, onShare }) {
  return (
    <>
     

      <div>
        <Card className="shadow-sm rounded-xl mt-6 lg:mt-0">
          <CardHeader className="pt-0 pb-3">
            <CardTitle className="text-base font-baloo text-xl lg:text-2xl">Szybkie działania</CardTitle>
            <CardDescription className="font-poppins">
              Najczęściej wykonywane operacje
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          <button
            onClick={() => setActiveTab("services")}
            className="px-3 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center gap-2 justify-center shadow-sm touch-manipulation"
          >
            <FaPlusCircle className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              {user?.services?.length ? "Dodaj usługę" : "Dodaj pierwszą usługę"}
            </span>
          </button>
          <button
            onClick={onShare}
            className="px-3 py-2.5 rounded-lg bg-neutral-100 text-neutral-800 text-sm font-medium hover:bg-neutral-200 active:bg-neutral-300 transition-colors flex items-center gap-2 justify-center shadow-sm touch-manipulation"
          >
            <FaShare className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Udostępnij</span>
          </button>
          <button
            onClick={() => window.open(`/zarezerwuj/${user?.userSlugUrl}`, '_blank')}
            className="px-3 py-2.5 rounded-lg bg-neutral-100 text-neutral-800 text-sm font-medium hover:bg-neutral-200 active:bg-neutral-300 transition-colors flex items-center gap-2 justify-center shadow-sm touch-manipulation"
          >
            <FaEye className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Wyświetl profil</span>
          </button>
            </div>
          </CardContent>
          <CardContent className="pt-3">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <button
                onClick={() => setActiveTab("calendar")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveTab("calendar");
                  }
                }}
                aria-label="Przejdź do kalendarza"
                tabIndex={0}
                className="group flex items-center gap-3 p-3 md:p-4 rounded-lg border border-neutral-200 bg-white hover:border-amber-200 hover:bg-amber-50/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/30"
              >
                <div className="p-2 rounded-md bg-amber-50 text-amber-600 group-hover:bg-amber-100">
                  <MdCalendarMonth className="w-4 h-4" />
                </div>
                <span className="text-xs md:text-sm font-medium text-neutral-800">
                  Kalendarz
                </span>
              </button>
              <button
                onClick={() => setActiveTab("services")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveTab("services");
                  }
                }}
                aria-label="Przejdź do usług"
                tabIndex={0}
                className="group flex items-center gap-3 p-3 md:p-4 rounded-lg border border-neutral-200 bg-white hover:border-blue-200 hover:bg-blue-50/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
              >
                <div className="p-2 rounded-md bg-blue-50 text-blue-600 group-hover:bg-blue-100">
                  <FaListUl className="w-4 h-4" />
                </div>
                <span className="text-xs md:text-sm font-medium text-neutral-800">
                  Usługi
                </span>
              </button>
              <button
                onClick={() => setActiveTab("portfolio")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveTab("portfolio");
                  }
                }}
                aria-label="Przejdź do galerii"
                tabIndex={0}
                className="group flex items-center gap-3 p-3 md:p-4 rounded-lg border border-neutral-200 bg-white hover:border-pink-200 hover:bg-pink-50/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/30"
              >
                <div className="p-2 rounded-md bg-pink-50 text-pink-600 group-hover:bg-pink-100">
                  <FaPalette className="w-4 h-4" />
                </div>
                <span className="text-xs md:text-sm font-medium text-neutral-800">
                  Galeria
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab("settings")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveTab("settings");
                  }
                }}
                aria-label="Przejdź do ustawień"
                tabIndex={0}
                className="group flex items-center gap-3 p-3 md:p-4 rounded-lg border border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500/30"
              >
                <div className="p-2 rounded-md bg-neutral-100 text-neutral-700 group-hover:bg-neutral-200">
                  <FaUser className="w-4 h-4" />
                </div>
                <span className="text-xs md:text-sm font-medium text-neutral-800">
                  Ustawienia
                </span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

