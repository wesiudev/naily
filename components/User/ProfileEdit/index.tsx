import { User } from "@/types";
import { useState } from "react";
import MainSettings from "./MainSettings";
import { updateUser } from "@/firebase";
import PaymentSettings from "./PaymentSettings";
import DisplaySettings from "./DisplaySettings";
import { toast } from "react-toastify";
import PortfolioSettings from "./PortfolioSettings";
export default function ProfileEdit({
  user,
  setProfileEditOpen,
  setPricingOpen,
  setServicesOpen,
  profileEditOpen,
}: {
  user: User;
  setProfileEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPricingOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setServicesOpen: React.Dispatch<React.SetStateAction<boolean>>;
  profileEditOpen: boolean;
}) {
  const [currentTab, setCurrentTab] = useState<string>("main");
  return (
    <div
      onClick={() => {
        setProfileEditOpen(false);
      }}
      className={`flex-col bg-black/50 z-[92] fixed left-0 top-0 w-screen h-screen flex overflow-y-scroll p-6 lg:p-12 xl:p-40 2xl:p-64 !pt-6 lg:!pt-12 xl:!pt-24 !pb-24 ${
        profileEditOpen && user?.configured ? "block" : "hidden"
      }`}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="relative h-max bg-white mx-auto max-w-[40rem] p-6 rounded-xl shadow-sm shadow-zinc-800"
      >
        {currentTab === "main" && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-center">
              Edytuj profil
            </h2>
            <span className="text-sm text-gray-600 mt-1.5 block text-center">
              Zarządzaj informacjami o swoim profilu
            </span>
          </div>
        )}
        {currentTab === "payments" && (
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-center">
              Płatności
            </h3>
            <span className="text-sm text-gray-600 mt-1.5 block text-center">
              Zarządzaj swoimi płatności
            </span>
          </div>
        )}
        {currentTab === "display" && (
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-center">
              Wyświetlanie
            </h3>
            <span className="text-sm text-gray-600 mt-1.5 block text-center">
              Zarządzaj zakładkami, w których wyświetla się Twój profil
            </span>
          </div>
        )}
        {currentTab === "portfolio" && (
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-center">
              Portfolio
            </h3>
            <span className="text-sm text-gray-600 mt-1.5 block text-center">
              Skonfiguruj zdjęcia wraz z opisami, aby zapewnić klientom wgląd do
              Twoich stylizacji
            </span>
          </div>
        )}
        <div className="mt-4 flex items-center justify-center flex-wrap gap-3">
          <button
            onClick={() => setCurrentTab("main")}
            className={`${
              currentTab === "main"
                ? "border-gray-500 bg-gray-300"
                : "border-gray-200 bg-gray-200"
            } border-2 px-3 py-1.5 text-black font-light rounded-md`}
          >
            Ustawienia
          </button>
          <button
            onClick={() => setCurrentTab("payments")}
            className={`${
              currentTab === "payments"
                ? "border-gray-500 bg-gray-300"
                : "border-gray-200 bg-gray-200"
            } border-2 px-3 py-1.5 text-black font-light rounded-md`}
          >
            Płatności
          </button>
          <button
            onClick={() => setCurrentTab("display")}
            className={`${
              currentTab === "display"
                ? "border-gray-500 bg-gray-300"
                : "border-gray-200 bg-gray-200"
            } border-2 px-3 py-1.5 text-black font-light rounded-md`}
          >
            Wyświetlanie
          </button>
          <button
            onClick={() => setCurrentTab("portfolio")}
            className={`${
              currentTab === "portfolio"
                ? "border-gray-500 bg-gray-300"
                : "border-gray-200 bg-gray-200"
            } border-2 px-3 py-1.5 text-black font-light rounded-md`}
          >
            Portfolio
          </button>
          {currentTab === "main" && <MainSettings user={user} />}
          {currentTab === "portfolio" && <PortfolioSettings user={user} />}
          {currentTab === "payments" && (
            <PaymentSettings
              user={user}
              setProfileEditOpen={setProfileEditOpen}
              setPricingOpen={setPricingOpen}
            />
          )}
          <div className={`${currentTab === "display" ? "block" : "hidden"}`}>
            <DisplaySettings
              setServicesOpen={setServicesOpen}
              setProfileEditOpen={setProfileEditOpen}
              user={user}
            />
          </div>

          <div
            style={{ boxShadow: "0px 0px 3px black" }}
            className="fixed bottom-0 w-max left-1/2 -translate-x-1/2 bg-white flex items-center justify-center gap-3 py-2 px-4 rounded-t-lg"
          >
            <button
              onClick={() => {
                setProfileEditOpen(false);
              }}
              className="px-12 rounded-md w-max bg-gray-500 text-white py-2"
            >
              Zamknij
            </button>
            <button
              onClick={() => {
                updateUser(user?.uid, user);
                toast.success("Zmiany zostały zapisane", {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                });
              }}
              className="px-12 rounded-md w-max bg-green-500 text-white py-2"
            >
              Zapisz zmiany
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
