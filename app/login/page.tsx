"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import Link from "next/link";
import { auth, getDocument } from "@/firebase";
import { setUser } from "@/redux/slices/user";
import { errorCatcher } from "@/utils/errorCatcher";
import { FaEnvelope, FaLock, FaArrowRight, FaUser } from "react-icons/fa";

type LoginFormState = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [form, setForm] = useState<LoginFormState>({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecoveryOpen, setIsRecoveryOpen] = useState<boolean>(false);

  async function handleLogin(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    if (!form.email || !form.password) return;

    setIsLoading(true);
    const toastId = toast.loading("Loguję...", {
      position: "top-right",
      isLoading: true,
    });
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const uid = credential?.user?.uid as string;

      const dbUser = await getDocument("users", uid);
      if (dbUser) {
        dispatch(setUser(dbUser));
        
        // Set UID cookie for server-side authentication
        document.cookie = `uid=${uid}; path=/; max-age=86400; SameSite=Lax`;
      }

      toast.update(toastId, {
        render: "Zalogowano pomyślnie!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setForm({ email: "", password: "" });
      router.push("/dashboard");
    } catch (err) {
      const errorMsg = errorCatcher(err);
      toast.update(toastId, {
        render: errorMsg,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePasswordReset(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    if (!form.email) {
      toast.error("Podaj adres email do resetu hasła", { autoClose: 3000 });
      return;
    }

    const toastId = toast.loading("Wysyłam link resetujący...", {
      position: "top-right",
      isLoading: true,
    });
    try {
      await sendPasswordResetEmail(auth, form.email);
      toast.update(toastId, {
        render: "Wysłano email z linkiem do resetu hasła",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setIsRecoveryOpen(false);
    } catch (err) {
      const errorMsg = errorCatcher(err);
      toast.update(toastId, {
        render: errorMsg,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  }

  return (
    // Use min-h-screen instead of h-screen to allow scroll on overflow.
    // Also, set overflow-y-auto and prevent "overflow: hidden"
    <main className="py-12 sm:py-16 md:py-24 min-h-screen w-full flex items-center justify-center p-4 sm:px-8 md:px-12 overflow-y-auto relative">
      <div className="fixed top-0 left-0 w-full h-full bg-zinc-900/85 z-[-1] pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-full z-[-2] pointer-events-none">
        <video
          src={"/loginvideo.mp4"}
          autoPlay
          muted
          loop
          className="w-full h-full object-cover"
        />
      </div>
      <div className="border border-white/20 backdrop-blur-xl relative w-full md:max-w-md lg:max-w-lg xl:max-w-xl bg-white/10 shadow-2xl p-6 sm:p-8 lg:p-10 xl:p-12 rounded-3xl flex flex-col gap-6 sm:gap-8">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/20 mb-2">
            <FaUser className="text-2xl sm:text-3xl text-white/90" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-baloo font-bold text-white mb-2 leading-tight">
            {isRecoveryOpen
              ? "Odzyskiwanie hasła"
              : "Zaloguj się do panelu stylistki"}
          </h1>
          {!isRecoveryOpen && (
            <p className="text-center text-gray-200/90 text-base sm:text-lg mb-2 font-poppins leading-relaxed max-w-md mx-auto">
              Witaj ponownie! Zaloguj się, aby zarządzać swoim profilem.
            </p>
          )}
        </div>

        {!isRecoveryOpen && (
          <>
            <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-white/90 mb-2 font-poppins"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaEnvelope className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm sm:text-base bg-white/95 backdrop-blur-sm text-zinc-800 placeholder:text-gray-400 transition-all duration-200"
                    placeholder="email@example.com"
                    required
                    autoComplete="username"
                    inputMode="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-white/90 mb-2 font-poppins"
                >
                  Hasło
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaLock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm sm:text-base bg-white/95 backdrop-blur-sm text-zinc-800 placeholder:text-gray-400 transition-all duration-200"
                    placeholder="Wpisz hasło"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isLoading ? (
                      "Ładowanie..."
                    ) : (
                      <>
                        Zaloguj się
                        <FaArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsRecoveryOpen(true)}
                  className="w-full text-white/80 hover:text-white text-sm font-poppins transition-colors duration-200"
                >
                  Przypomnij hasło
                </button>
              </div>
            </form>
            
            <div className="pt-4 border-t border-white/10">
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm text-gray-300/80 font-poppins">
                  Nie posiadasz jeszcze konta?
                </span>
                <Link
                  href="/kreator-profilu"
                  className="text-base text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200 flex items-center gap-2 group"
                >
                  Zarejestruj się
                  <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </>
        )}

        {isRecoveryOpen && (
          <form onSubmit={handlePasswordReset} className="space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="recovery-email"
                className="block text-sm font-semibold text-white/90 mb-2 font-poppins"
              >
                Email powiązany z kontem
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaEnvelope className="w-4 h-4" />
                </div>
                <input
                  id="recovery-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm sm:text-base bg-white/95 backdrop-blur-sm text-zinc-800 placeholder:text-gray-400 transition-all duration-200"
                  placeholder="email@example.com"
                  required
                  autoComplete="username"
                  inputMode="email"
                />
              </div>
            </div>
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Wyślij link resetujący
                  <FaArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button
                type="button"
                onClick={() => setIsRecoveryOpen(false)}
                className="w-full py-2.5 text-sm text-white/80 hover:text-white transition-colors duration-200 font-poppins"
              >
                Wróć do logowania
              </button>
            </div>
            <div className="pt-4 border-t border-white/10 text-center">
              <span className="text-sm text-gray-300/80 font-poppins block mb-2">
                Nie posiadasz jeszcze konta?
              </span>
              <Link
                href="/kreator-profilu"
                className="inline-flex items-center gap-2 text-base text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200 group"
              >
                Zarejestruj się
                <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
