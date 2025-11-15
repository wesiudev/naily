"use client";
import googleLogo from "../../public/googleLogo.webp";
import React from "react";
import { createUser, provider, grantFreePremium } from "@/firebase";
import { getAuth, UserCredential, signInWithPopup } from "firebase/auth";
import { errorCatcher } from "@/utils/errorCatcher";
import { setMultiStepCreatorOpen, setPromotionPopupOpen } from "@/redux/slices/cta";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { setUser } from "@/redux/slices/user";
import { fetchUser } from "@/utils/fetchUser";
import { toast } from "react-toastify";

export default function GoogleAuthButton({
  setNavOpen,
  setRegisterModalOpen,
  setLoginModalOpen,
}: {
  setNavOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setRegisterModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setLoginModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useDispatch();
  
  async function googleHandler() {
    const auth = getAuth();
    try {
      const result = await signInWithPopup(auth, provider);
      const { user }: UserCredential = await result;
      const existingUser = await fetchUser(user?.uid);
      
      if (existingUser.error) {
        // New user - create account
        await createUser({
          uid: user?.uid,
          name: user?.displayName,
          email: user?.email,
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
          await grantFreePremium(user?.uid);
        } catch (premiumError) {
          console.error("Error granting free premium:", premiumError);
          // Continue even if premium grant fails
        }
        
        // Close any open modals
        if (setNavOpen) setNavOpen(true);
        if (setRegisterModalOpen) setRegisterModalOpen(false);
        if (setLoginModalOpen) setLoginModalOpen(false);
        dispatch(setMultiStepCreatorOpen(false));
        
        // Show promotion popup for new users
        dispatch(setPromotionPopupOpen(true));
        
        toast.success("Konto utworzone pomyślnie!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        // Existing user - just log in
        dispatch(setUser(existingUser));
        if (setNavOpen) setNavOpen(true);
        if (setRegisterModalOpen) setRegisterModalOpen(false);
        if (setLoginModalOpen) setLoginModalOpen(false);
        dispatch(setMultiStepCreatorOpen(false));
        
        toast.success("Zalogowano pomyślnie!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      errorCatcher(error);
    }
  }
  
  return (
    <div className="google-button-container">
      <button
        onClick={() => googleHandler()}
        type="button"
        className={`block bg-white hover:bg-gray-100 focus:bg-gray-100 mx-auto rounded-lg text-black font-semibold px-4 py-3 border border-gray-300`}
      >
        <div className="flex items-center justify-center">
          <Image
            src={googleLogo}
            width={124}
            height={124}
            alt="Google Logo"
            className="w-7 h-7"
          />
          <span className="ml-4 block">Zaloguj z Google</span>
        </div>
      </button>
    </div>
  );
}
