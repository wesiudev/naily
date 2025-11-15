"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

export default function FontManager() {
  const user = useSelector((state: any) => state.user.user);
  const pathname = usePathname();
  useEffect(() => {
    const isDashboard = pathname?.startsWith("/dashboard");
    const settings = user?.settings || {};
    const fontKey = settings.fontFamily || "inter";
    const root = document.documentElement;
    let fontVar = "var(--font-inter)";
    if (fontKey === "roboto") fontVar = "var(--font-roboto)";
    if (fontKey === "poppins") fontVar = "var(--font-poppins)";
    if (fontKey === "playfair") fontVar = "var(--font-playfair)";
    if (fontKey === "nunito") fontVar = "var(--font-nunito)";
    if (fontKey === "lora") fontVar = "var(--font-lora)";
    root.style.setProperty("--app-font-family", fontVar);
    // Apply marketing fonts only outside dashboard
    if (!isDashboard) {
      root.classList.add("marketing-fonts");
    } else {
      root.classList.remove("marketing-fonts");
    }
  }, [user?.settings?.fontFamily, pathname]);
  return null;
}
