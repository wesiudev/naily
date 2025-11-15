"use client";
import { createUserWithEmailAndPassword, UserCredential } from "firebase/auth";
import { useEffect, useState } from "react";
import { addDocument, auth, getDocument, grantFreePremium } from "@/firebase";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { setUser } from "@/redux/slices/user";
import { useDispatch } from "react-redux";
import { errorCatcher } from "@/utils/errorCatcher";
import CreateAccountForm from "./CreateAccountForm";
import { setRegisterOpen } from "@/redux/slices/cta";
export default function Register({
  registerModalOpen,
  setRegisterModalOpen,
  setLoginModalOpen,
  setNavOpen,
}: {
  registerModalOpen: boolean;
  setRegisterModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState({
    password: "",
    repeatPassword: "",
    email: "",
  });
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  function createAccount() {
    setLoading(true);
    const id = toast.loading(<span>Rejestruję...</span>, {
      position: "top-right",
      isLoading: true,
    });
    if (userData.password !== userData.repeatPassword) {
      setLoading(false);
      toast.update(id, {
        render: "Hasła nie są takie same",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return;
    }
    if (userData.password?.length < 6) {
      setLoading(false);
      toast.update(id, {
        render: "Hasło powinno składać się z minimum 6 znaków",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return;
    }
    if (!userData.email) {
      setLoading(false);
      toast.update(id, {
        render: "Prosimy wpisać email",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return;
    }
    (async () => {
      try {
        await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        ).then(async (userCredential: UserCredential) => {
          await addDocument("users", userCredential.user?.uid, {
            uid: userCredential.user?.uid,
            name: "",
            email: userData?.email,
            description: "",
            logo: "",

            seek: false,
            emailVerified: false,
            configured: false,
            active: false,
            profileComments: [],

            services: [],
            location: { lng: 21.0122287, lat: 52.2296756, address: "" },
            phoneNumber: "",
          });

          // Grant 30-day free premium for new users
          try {
            await grantFreePremium(userCredential.user?.uid);
          } catch (premiumError) {
            console.error("Error granting free premium:", premiumError);
            // Continue even if premium grant fails
          }

          toast.update(id, {
            render: "Konto utworzone pomyślnie!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
          setLoading(false);
          setRegisterModalOpen(false);
          dispatch(setRegisterOpen(false));
          setNavOpen(true);
        });
      } catch (err) {
        const errorMsg = errorCatcher(err);
        toast.update(id, {
          render: errorMsg,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        setLoading(false);
      }
    })();
  }
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
        setRegisterModalOpen(false);
        dispatch(setRegisterOpen(false));
      }}
      className={`bg-black/50 z-[100] fixed left-0 top-0 w-screen h-full overflow-y-scroll p-6 lg:p-12 xl:p-40 2xl:p-64 !py-6 lg:!py-12 xl:!py-24  ${
        registerModalOpen ? "block" : "hidden"
      }`}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="h-max bg-gray-200 mx-auto max-w-[40rem] p-6 rounded-xl shadow-sm shadow-zinc-800"
      >
        <h2
          className={`text-black text-left font-bold text-2xl xl:text-3xl drop-shadow-xl shadow-black mb-6`}
        >
          Zarejestruj się
        </h2>
        <CreateAccountForm
          userData={userData}
          setUserData={setUserData}
          createAccount={createAccount}
          loading={isLoading}
          setNavOpen={setNavOpen}
          setRegisterModalOpen={setRegisterModalOpen}
          setLoginModalOpen={setLoginModalOpen}
        />
        <div className="text-center justify-center mt-3 flex flex-row flex-wrap text-black font-light text-lg">
          Posiadasz już konto?{" "}
          <button
            className="ml-2 text-[#126b91] hover:underline"
            onClick={() => {
              setRegisterModalOpen(false);
              dispatch(setRegisterOpen(false));
              setLoginModalOpen(true);
            }}
          >
            Zaloguj się
          </button>
        </div>
      </div>
    </div>
  );
}
