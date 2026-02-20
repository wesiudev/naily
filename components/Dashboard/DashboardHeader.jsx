"use client";
import {
  FaGem,
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch } from "react-redux";
import { setUser, initialState } from "@/redux/slices/user";
export default function DashboardHeader({
  user,
  firebaseUser,
  notificationCount,
  setActiveTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(setUser(initialState.user));
      
      // Clear UID cookie
      document.cookie = "uid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      
      toast.success("Wylogowano pomyślnie");
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Błąd podczas wylogowywania");
    }
  };

  const handleViewPublicProfile = () => {
    if (user?.userSlugUrl) {
      // Open public profile in new tab
      window.open(`/zarezerwuj/${user.userSlugUrl}`, "_blank");
    } else if (user?.uid) {
      // Fallback to uid if no slug is set
      window.open(`/zarezerwuj/${user.uid}`, "_blank");
    } else {
      toast.error("Brak informacji o profilu użytkownika");
    }
  };

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container-professional">
        <div className="flex items-center justify-between py-4 gap-3">
          {/* Left: menu toggle + brand */}
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Zamknij menu" : "Otwórz menu"}
            >
              {isMobileMenuOpen ? (
                <FaTimes className="h-5 w-5" />
              ) : (
                <FaBars className="h-5 w-5" />
              )}
            </Button>
            <FaGem className="h-6 w-6 text-primary flex-shrink-0" />
            <h1 className="text-lg md:text-xl font-semibold truncate">
              Twój panel — wszystko w jednym miejscu
            </h1>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveTab("notifications")}
              className="relative flex-shrink-0"
              aria-label="Powiadomienia"
            >
              <FaBell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleViewPublicProfile}
              className="md:hidden flex-shrink-0"
              title="Zobacz profil publiczny"
              aria-label="Zobacz profil publiczny"
            >
              <FaExternalLinkAlt className="h-5 w-5" />
            </Button>

            <div className="hidden md:flex items-center gap-3 min-w-0">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback>
                  <FaUser className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="font-medium truncate max-w-[200px]">
                {user?.name || firebaseUser?.displayName || "Użytkownik"}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleViewPublicProfile}
              className="hidden md:flex flex-shrink-0"
              title="Zobacz profil publiczny"
              aria-label="Zobacz profil publiczny"
            >
              <FaExternalLinkAlt className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="hidden md:flex flex-shrink-0"
              title="Wyloguj się"
              aria-label="Wyloguj się"
            >
              <FaSignOutAlt className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
