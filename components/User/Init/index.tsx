"use client";
import { auth } from "@/firebase";
import { setUser } from "@/redux/slices/user";
import { fetchUser } from "@/utils/fetchUser";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch } from "react-redux";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default function InitUser() {
  const [user, loading] = useAuthState(auth);
  const dispatch = useDispatch();

  useEffect(() => {
    let unsubscribe: undefined | (() => void);
    if (user && !loading) {
      // Set UID cookie for server-side authentication
      document.cookie = `uid=${user.uid}; path=/; max-age=86400; SameSite=Lax`;

      // Check if user document exists before calling fetchUser to avoid 404s
      const userRef = doc(db, "users", user.uid);
      getDoc(userRef)
        .then((snap) => {
          if (snap.exists()) {
            // Document exists, fetch via API for SSR compatibility
            fetchUser(user?.uid)
              .then((res) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const maybeError = (res as any)?.error as string | undefined;
                if (res && !maybeError) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  dispatch(setUser(res as any));
                }
              })
              .catch(() => {
                // Silently ignore; Firestore onSnapshot will populate when ready
              });
          }
          // If document doesn't exist, onSnapshot below will fire when it's created
        })
        .catch(() => {
          // Silently ignore; Firestore onSnapshot will populate when ready
        });

      // Live updates from Firestore (this will fire when document is created)
      unsubscribe = onSnapshot(userRef, (snap) => {
        const data = snap.data();
        if (data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dispatch(setUser(data as any));
        }
      });
    }
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [user, loading, dispatch]);

  return <div></div>;
}
