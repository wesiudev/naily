/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import GoogleAuthButton from "@/components/GoogleButton";
export default function CreateAccountForm({
  createAccount,
  setUserData,
  userData,
  loading,
  setNavOpen,
  setRegisterModalOpen,
  setLoginModalOpen,
}: {
  createAccount: any;
  setUserData: any;
  userData: any;
  loading: boolean;
  setNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRegisterModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div>
      <div className="flex flex-col">
        {" "}
        <label htmlFor="email" className="font-light text-lg text-black ">
          Email
        </label>
        <input
          required
          type="email"
          id="email"
          placeholder="Wpisz email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          className="rounded-md outline-red-400 border-gray-300 border bg-white text-black  p-3 text-xl font-light"
        />
        <div className="flex flex-col mt-3 w-full">
          <div className="flex flex-col w-full">
            {" "}
            <label
              htmlFor="password"
              className="font-light text-lg text-black "
            >
              Hasło
            </label>
            <input
              required
              type="password"
              placeholder="Wpisz hasło"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              className="rounded-md outline-red-400 border-gray-300 border bg-white text-black  p-3 text-xl font-light"
            />
          </div>
          <div className="flex flex-col w-full mt-3">
            {" "}
            <label
              htmlFor="password"
              className="font-light text-lg text-black "
            >
              Powtórz hasło
            </label>
            <input
              required
              type="password"
              placeholder="Powtórz hasło"
              value={userData.repeatPassword}
              onChange={(e) =>
                setUserData({ ...userData, repeatPassword: e.target.value })
              }
              className="rounded-md outline-red-400 border-gray-300 border bg-white text-black  p-3 text-xl font-light"
            />
          </div>
        </div>
      </div>{" "}
      <button
        disabled={loading}
        onClick={() => {
          createAccount();
        }}
        className="w-full mt-3 py-3 font-bold bg-red-500 text-white hover:bg-red-600 rounded-md"
      >
        {!loading && (
          <div className="flex flex-row items-center justify-center">
            Zarejestruj się
          </div>
        )}
        {loading && "Chwila..."}
      </button>
      <div className="mt-6 mb-5 flex flex-row items-center justify-center">
        <div className="h-px w-full bg-red-300"></div>
        <div className="px-12 text-gray-600">lub</div>
        <div className="h-px w-full bg-red-300"></div>
      </div>
      <GoogleAuthButton
        setNavOpen={setNavOpen}
        setRegisterModalOpen={setRegisterModalOpen}
        setLoginModalOpen={setLoginModalOpen}
      />
    </div>
  );
}
