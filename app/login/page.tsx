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
    <main className="py-32 min-h-screen w-full flex items-center justify-center p-4 sm:px-8 md:px-12 overflow-y-auto relative">
      <div className="fixed top-0 left-0 w-full h-full bg-zinc-800/80 z-[-1] pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-full z-[-2] pointer-events-none">
        <video
          src={"/loginvideo.mp4"}
          autoPlay
          muted
          loop
          className="w-full h-full object-cover"
        />
      </div>
      <div className="border border-white/10 backdrop-blur-[6px] relative w-full md:max-w-md lg:max-w-lg xl:max-w-xl bg-white/5 shadow-2xl p-6 lg:p-12 rounded-2xl flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-baloo font-bold text-white mb-2 text-center">
            {isRecoveryOpen
              ? "Odzyskiwanie hasła"
              : "Zaloguj się do panelu stylistki"}
          </h1>
          {!isRecoveryOpen && (
            <p className="text-center text-gray-200 text-sm mb-6 font-poppins">
              Witaj ponownie! Zaloguj się, aby zarządzać swoim profilem.
            </p>
          )}
        </div>

        {!isRecoveryOpen && (
          <>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white/85"
                  placeholder="email@example.com"
                  required
                  autoComplete="username"
                  inputMode="email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Hasło
                </label>
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white/85"
                  placeholder="Hasło"
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto professional-button py-3 px-6 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Ładowanie..." : "Zaloguj się"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsRecoveryOpen(true)}
                  className="w-full sm:w-auto text-white hover:text-gray-300 text-sm font-poppins underline underline-offset-2"
                >
                  Przypomnij hasło
                </button>
              </div>
            </form>
            <div className="mt-8 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-300 font-poppins">
                Nie posiadasz jeszcze konta?
              </span>
              <Link
                href="/kreator-profilu"
                className="text-sm text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2 transition"
              >
                Zarejestruj się
              </Link>
            </div>
          </>
        )}

        {isRecoveryOpen && (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label
                htmlFor="recovery-email"
                className="block text-sm font-poppins text-white mb-2"
              >
                Email powiązany z kontem
              </label>
              <input
                id="recovery-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white/85"
                placeholder="email@example.com"
                required
                autoComplete="username"
                inputMode="email"
              />
            </div>
            <button
              type="submit"
              className="w-full professional-button py-3 text-sm font-semibold"
            >
              Wyślij link resetujący
            </button>
            <button
              type="button"
              onClick={() => setIsRecoveryOpen(false)}
              className="w-full py-2 text-sm text-white hover:text-gray-300"
            >
              Wróć do logowania
            </button>
            <div className="mt-4 text-center">
              <span className="text-xs text-gray-300 font-poppins">
                Nie posiadasz jeszcze konta?
              </span>
              <Link
                href="/kreator-profilu"
                className="block text-sm text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2 transition mt-2"
              >
                Zarejestruj się
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
