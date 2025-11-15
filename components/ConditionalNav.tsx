"use client";
import { usePathname } from "next/navigation";
import Nav from "@/components/Nav";

export default function ConditionalNav() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const isUserProfile = pathname?.includes("/u/");

  if (isDashboard) return null;
  if (isUserProfile) return <Nav isUserProfile={true} />;
  return pathname !== "/" ? <Nav /> : <Nav landing={true} />;
}
