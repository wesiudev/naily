"use client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, getDocument } from "@/firebase";
import { toast } from "react-toastify";
import GoogleAuthButton from "@/components/GoogleButton";
import { FaKey } from "react-icons/fa";
import { useAuthState } from "react-firebase-hooks/auth";
import { setUser } from "@/redux/slices/user";
import { useDispatch } from "react-redux";
import { errorCatcher } from "@/utils/errorCatcher";

export default function Login({
  loginModalOpen,
  setLoginModalOpen,
  setRegisterModalOpen,
  setNavOpen,
}: {
  loginModalOpen: boolean;
  setLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRegisterModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [user, loading] = useAuthState(auth);
  const [isThinking, setThinking] = useState(false);
  const [userData, setUserData] = useState({
    password: "",
    email: "",
  });
  function signIn() {
    setThinking(true);
    const id = toast.loading("Proszę czekać...", {
      position: "top-right",
      isLoading: true,
    });

    (async () => {
      try {
        await signInWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        ).then(() => {
          toast.update(id, {
            render: "Zalogowano pomyślnie!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
          setThinking(false);
          setNavOpen(true);
          setLoginModalOpen(false);
        });
      } catch (err) {
        const errorMsg = errorCatcher(err);
        toast.update(id, {
          render: errorMsg,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        setThinking(false);
      }
    })();
  }
  const dispatch = useDispatch();
  useEffect(() => {
    if (user && !loading) {
      getDocument("users", user?.uid).then((data) => {
        dispatch(setUser(data));
      });
    }
  }, [loading, user]);
  return (
    <div
      onClick={() => {
        setLoginModalOpen(false);
      }}
      className={`bg-black/50 z-[100] fixed left-0 top-0 w-screen h-full overflow-y-scroll p-6 lg:p-12 xl:p-40 2xl:p-64 !py-6 lg:!py-12 xl:!py-24  ${
        loginModalOpen ? "block" : "hidden"
      }`}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="h-max bg-gray-200 mx-auto max-w-[40rem] p-6 rounded-xl shadow-sm shadow-zinc-800"
      >
        <h2
          className={`text-black pr-3 font-bold text-2xl lg:text-3xl drop-shadow-xl shadow-black mb-6 flex flex-row items-center`}
        >
          Zaloguj się
        </h2>
        <div className="grid grid-cols-1 gap-3 h-max">
          <div className="flex flex-col">
            {" "}
            <label
              htmlFor="email"
              className="font-gotham text-black  font-light text-lg"
            >
              Email
            </label>
            <input
              required
              type="email"
              placeholder="Wpisz email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              className="input-lg bg-white text-black  p-3 text-lg mb-3 font-light"
            />
          </div>
          <div className="flex flex-col">
            {" "}
            <label
              htmlFor="password"
              className="font-gotham text-black  font-light text-lg"
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
              className="input-lg bg-white text-black  p-3 text-lg mb-3 font-light"
            />
          </div>
        </div>{" "}
        <div className="grid grid-cols-1 gap-3 w-full">
          <button
            disabled={isThinking}
            onClick={signIn}
            className="mt-2 py-3 rounded-md bg-red-500 text-white hover:bg-red-600 font-bold"
          >
            {!isThinking && (
              <div className="flex flex-row items-center justify-center">
                <FaKey className="mr-2" /> Zaloguj się
              </div>
            )}
            {isThinking && "Poczekaj..."}
          </button>
          <div className="font-gotham mt-3 mb-2  flex flex-row items-center justify-center">
            <div className="h-px w-full bg-red-300"></div>
            <div className="px-12 text-gray-600">lub</div>
            <div className="h-px w-full bg-red-300"></div>
          </div>
          <GoogleAuthButton
            setNavOpen={setNavOpen}
            setRegisterModalOpen={setRegisterModalOpen}
            setLoginModalOpen={setLoginModalOpen}
          />
          <div className="text-center text-black font-light text-lg">
            Nie posiadasz jeszcze konta?{" "}
            <button
              onClick={() => {
                setLoginModalOpen(false);
                setRegisterModalOpen(true);
              }}
              className="text-[#126b91] hover:underline"
            >
              Zarejestruj się
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
