"use client";
import { auth } from "@/firebase";
import { setUser } from "@/redux/slices/user";
import { fetchUser } from "@/utils/fetchUser";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch } from "react-redux";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";

export default function InitUser() {
  const [user, loading] = useAuthState(auth);
  const dispatch = useDispatch();

  useEffect(() => {
    let unsubscribe: undefined | (() => void);
    if (user && !loading) {
      // Initial fetch for SSR compatibility
      fetchUser(user?.uid)
        .then((res) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const maybeError = (res as any)?.error as string | undefined;
          if (res && !maybeError) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            dispatch(setUser(res as any));
          }
          // If error, Firestore onSnapshot below will likely deliver the doc soon after creation
        })
        .catch(() => {
          // Silently ignore; Firestore onSnapshot will populate when ready
        });

      // Set UID cookie for server-side authentication
      document.cookie = `uid=${user.uid}; path=/; max-age=86400; SameSite=Lax`;

      // Live updates from Firestore
      const ref = doc(db, "users", user.uid);
      unsubscribe = onSnapshot(ref, (snap) => {
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
