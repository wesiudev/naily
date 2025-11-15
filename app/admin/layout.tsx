"use client";
import { auth2 } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import LoginPage from "./LoginPage";
import Loading from "./loading";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading] = useAuthState(auth2);
  if (loading) {
    return <Loading />;
  } else
    return (
      <div className="w-full relative z-[9999] bg-white">
        {user ? (
          <>
            <div className="min-w-full min-h-screen bg-[#222430]">
              {children}
            </div>
          </>
        ) : (
          <LoginPage />
        )}
      </div>
    );
}
