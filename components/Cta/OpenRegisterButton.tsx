/* eslint-disable no-unused-vars */
"use client";

import { PropsWithChildren } from "react";

declare global {
  interface Window {
    openLoginRegisterPopup?: (
      tab?: "login" | "register",
      accountType?: "salon" | "individual"
    ) => void;
  }
}

export default function OpenRegisterButton({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  const handleClick = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/kreator-profilu";
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      <span className="relative flex items-center gap-2 justify-center">
        {children}
      </span>
    </button>
  );
}
