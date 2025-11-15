"use client";
import ChooseAccountType from "./ChooseAccountType";
import AccountLocation from "./AccountLocation";
import AccountPresence from "./AccountPresence";
import AccountDisplay from "./AccountDisplay";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function ProfileConfig() {
  const [step, setStep] = useState(0);
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <div className={`${user?.uid === "" ? "block" : "hidden"} py-16 px-6`}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-pink-500 via-purple-600 to-pink-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-white/10 backdrop-blur-sm p-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Utwórz profil specjalisty
            </h2>
            <div className="flex items-center justify-center gap-2 text-white mb-4">
              <span className="text-sm font-semibold">Krok {step + 1} z 4</span>
            </div>
            <p className="text-white font-medium text-lg">
              {step === 0 && "Wybierz rodzaj profilu"}
              {step === 1 && "Uzupełnij podstawowe informacje"}
              {step === 2 && "Prezentacja profilu"}
              {step === 3 && "Wyświetlanie profilu"}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/10 px-8 py-4">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((step + 1) / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 lg:p-12 bg-white">
            {step === 0 && <ChooseAccountType setStep={setStep} />}
            {step === 1 && <AccountLocation setStep={setStep} user={user} />}
            {step === 2 && <AccountPresence setStep={setStep} user={user} />}
            {step === 3 && <AccountDisplay setStep={setStep} user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
}
