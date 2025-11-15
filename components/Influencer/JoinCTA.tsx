"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";

export default function JoinCTA() {
  const { user } = useSelector((s: RootState) => s.user);
  const router = useRouter();

  const go = () => {
    if (!user?.uid) return router.push("/kreator-profilu");
    router.push("/influencer/dashboard");
  };

  return (
    <button
      onClick={go}
      className={`text-xl lg:text-base inline-flex items-center justify-center font-bold rounded-full py-3 px-6 bg-blue-700 text-white`}
    >
      Zacznij już dziś
    </button>
  );
}
